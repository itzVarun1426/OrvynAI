import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import { 
    generateInterviewReport, 
    evaluateAnswer, 
    generateNextAdaptiveQuestion, 
    generateFinalEvaluationReport,
    generateWeakAreasInterview
} from '../services/ai.service.js';
import interviewReportModel from '../models/interviewReport.model.js';

async function generateInterviewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;
        let resumeText = "";

        // Handle Resume Parsing if file is provided
        if (req.file) {
            try {
                const pdfParser = new pdf.PDFParse({ data: req.file.buffer });
                const textResult = await pdfParser.getText();
                resumeText = textResult.text || "";
            } catch (pdfError) {
                console.error("PDF Parsing Error:", pdfError);
                return res.status(400).json({ error: 'Failed to parse PDF resume' });
            }
        }

        // Detailed validation
        if (!jobDescription) {
            return res.status(400).json({ error: 'Job Description is missing.' });
        }
        if (!selfDescription && !resumeText) {
            return res.status(400).json({ error: 'Please provide either a Bio or a Resume.' });
        }

        const interviewReportGeneratedByAI = await generateInterviewReport({
            resume: resumeText || "Not provided",
            selfDescription: selfDescription || "Not provided",
            jobDescription
        });

        if (!interviewReportGeneratedByAI) {
            return res.status(500).json({
                message: "AI generation failed"
            });
        }

        // Compute baseline final evaluation immediately so evaluation / report page is populated even if user skips straight to report
        const baselineFinalEval = await generateFinalEvaluationReport({
            interviewReport: {
                jobDescription,
                candidateProfile: interviewReportGeneratedByAI.candidateProfile,
                adaptiveQuestions: interviewReportGeneratedByAI.adaptiveQuestions
            }
        });

        const interviewReport = await interviewReportModel.create({
            jobDescription,
            resume: resumeText,
            selfDescription,
            user: req.decoded.id,
            ...interviewReportGeneratedByAI,
            finalEvaluation: baselineFinalEval || undefined
        });

        res.status(200).json({
            message: 'Interview report generated successfully',
            interviewReport
        });

    } catch (err) {
        console.error("Controller Error:", err);
        res.status(500).json({ error: 'Failed to generate interview report' });
    }
}

async function getInterviewByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        if (!interviewId) {
            return res.status(400).json({
                message: "interview id is required"
            });
        }
        const interviewReport = await interviewReportModel.findById(interviewId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "interview report not found"
            });
        }

        // If finalEvaluation is missing or empty, generate and save it
        if (!interviewReport.finalEvaluation || !interviewReport.finalEvaluation.scoreBreakdown?.technicalKnowledge) {
            try {
                const evalData = await generateFinalEvaluationReport({ interviewReport });
                if (evalData) {
                    interviewReport.finalEvaluation = evalData;
                    if (evalData.overallScore) {
                        interviewReport.matchScore = evalData.overallScore;
                    }
                    await interviewReport.save();
                }
            } catch (evalErr) {
                console.error("On-demand final evaluation error:", evalErr);
            }
        }

        res.status(200).json({
            message: "interview report found",
            interviewReport
        });
    }
    catch (err) {
        console.error("getInterviewById Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAllInterviewReportByUserId(req, res) {
    try {
        const user = req.decoded.id;
        const reports = await interviewReportModel.find({ user })
            .sort({ createdAt: -1 })
            .select("-resume -jobDescription -selfDescription -__v");

        if (!reports) {
            return res.status(404).json({
                message: "interview reports not found"
            });
        }
        res.status(200).json({
            message: "interview reports found",
            reports
        });

    }
    catch (err) {
        console.error("getAllInterviewReport Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params;
        const user = req.decoded.id;

        if (!interviewId) {
            return res.status(400).json({
                message: "interview id is required"
            });
        }

        const deletedReport = await interviewReportModel.findOneAndDelete({ _id: interviewId, user });

        if (!deletedReport) {
            return res.status(404).json({
                message: "interview report not found or you are not authorized to delete it"
            });
        }

        res.status(200).json({
            message: "interview report deleted successfully"
        });

    } catch (err) {
        console.error("deleteInterviewReport Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function submitAnswerController(req, res) {
    try {
        const { interviewId } = req.params;
        const { questionType, questionIndex, userAnswer } = req.body;
        const audioFile = req.file;

        if (!interviewId || questionIndex === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const report = await interviewReportModel.findById(interviewId);
        if (!report) return res.status(404).json({ error: 'Report not found' });

        let isAdaptive = Array.isArray(report.adaptiveQuestions) && report.adaptiveQuestions.length > 0;
        let questionObj = null;

        if (isAdaptive && report.adaptiveQuestions[questionIndex]) {
            questionObj = report.adaptiveQuestions[questionIndex];
        } else {
            const questionList = questionType === 'technical' ? report.technicalQuestions : report.behavioralQuestions;
            questionObj = questionList ? questionList[questionIndex] : null;
        }

        if (!questionObj) return res.status(404).json({ error: 'Question not found' });

        let audioBase64 = null;
        if (audioFile) {
            audioBase64 = audioFile.buffer.toString('base64');
        }

        // Evaluate using Gemini
        const evaluation = await evaluateAnswer({
            question: questionObj.question,
            intention: questionObj.intention || '',
            modelAnswer: questionObj.idealAnswer || questionObj.answer || '',
            userAnswer: userAnswer || "",
            audioBase64,
            mimeType: audioFile?.mimetype || 'audio/webm'
        });

        // Determine difficulty progression
        let nextDifficulty = report.currentDifficulty || 'Intermediate';
        if (evaluation.score >= 85) {
            if (nextDifficulty === 'Beginner') nextDifficulty = 'Intermediate';
            else if (nextDifficulty === 'Intermediate') nextDifficulty = 'Advanced';
            else if (nextDifficulty === 'Advanced') nextDifficulty = 'Expert';
        } else if (evaluation.score <= 50) {
            if (nextDifficulty === 'Expert') nextDifficulty = 'Advanced';
            else if (nextDifficulty === 'Advanced') nextDifficulty = 'Intermediate';
            else if (nextDifficulty === 'Intermediate') nextDifficulty = 'Beginner';
        }

        // Update database with structured feedback
        if (isAdaptive) {
            const updateKey = `adaptiveQuestions.${questionIndex}`;
            await interviewReportModel.updateOne(
                { _id: interviewId },
                {
                    $set: {
                        [`${updateKey}.userAnswer`]: evaluation.userAnswer,
                        [`${updateKey}.feedback`]: {
                            score: evaluation.score,
                            whatWell: evaluation.whatWell,
                            whatMissing: evaluation.whatMissing,
                            howToImprove: evaluation.howToImprove,
                            strongerAnswer: evaluation.strongerAnswer,
                            likelyFollowUp: evaluation.likelyFollowUp,
                            improvements: evaluation.improvements,
                            drawbacks: evaluation.drawbacks
                        },
                        currentDifficulty: nextDifficulty,
                        status: 'in-progress'
                    }
                }
            );
        } else {
            const updateKey = `${questionType}Questions.${questionIndex}`;
            await interviewReportModel.updateOne(
                { _id: interviewId },
                {
                    $set: {
                        [`${updateKey}.userAnswer`]: evaluation.userAnswer,
                        [`${updateKey}.feedback`]: {
                            improvements: evaluation.improvements,
                            drawbacks: evaluation.drawbacks,
                            score: evaluation.score,
                            whatWell: evaluation.whatWell,
                            whatMissing: evaluation.whatMissing,
                            howToImprove: evaluation.howToImprove,
                            strongerAnswer: evaluation.strongerAnswer,
                            likelyFollowUp: evaluation.likelyFollowUp
                        },
                        status: 'in-progress'
                    }
                }
            );
        }

        res.status(200).json({
            message: 'Answer submitted and evaluated',
            evaluation,
            currentDifficulty: nextDifficulty
        });

    } catch (err) {
        console.error("submitAnswer Error:", err);
        res.status(500).json({ error: 'Failed to process answer' });
    }
}

/**
 * Fetch next adaptive question dynamically responding to the candidate's answer
 */
async function getNextAdaptiveQuestionController(req, res) {
    try {
        const { interviewId } = req.params;
        const report = await interviewReportModel.findById(interviewId);
        if (!report) return res.status(404).json({ error: 'Report not found' });

        const previousQuestionsAndAnswers = (report.adaptiveQuestions || []).map(q => ({
            question: q.question,
            category: q.category,
            difficulty: q.difficulty,
            userAnswer: q.userAnswer || "(No answer)",
            score: q.feedback?.score || 0
        }));

        const lastQ = report.adaptiveQuestions && report.adaptiveQuestions.length > 0 
            ? report.adaptiveQuestions[report.adaptiveQuestions.length - 1] 
            : null;

        const nextQ = await generateNextAdaptiveQuestion({
            interviewReport: report,
            previousQuestionsAndAnswers,
            lastAnswerEvaluation: lastQ?.feedback || {},
            currentDifficulty: report.currentDifficulty || 'Intermediate'
        });

        // Push new adaptive question into report array
        report.adaptiveQuestions.push(nextQ);
        await report.save();

        res.status(200).json({
            message: 'Next adaptive question generated',
            question: nextQ,
            questionIndex: report.adaptiveQuestions.length - 1,
            currentDifficulty: report.currentDifficulty
        });
    } catch (err) {
        console.error("getNextAdaptiveQuestion Error:", err);
        res.status(500).json({ error: 'Failed to generate next question' });
    }
}

/**
 * Complete interview and compile high-grade visual metrics
 */
async function completeInterviewController(req, res) {
    try {
        const { interviewId } = req.params;
        const report = await interviewReportModel.findById(interviewId);
        if (!report) return res.status(404).json({ error: 'Interview report not found' });

        const finalEvaluation = await generateFinalEvaluationReport({ interviewReport: report });

        if (finalEvaluation) {
            report.finalEvaluation = finalEvaluation;
            if (finalEvaluation.overallScore) {
                report.matchScore = finalEvaluation.overallScore;
            }
            if (finalEvaluation.preparationPlan && Array.isArray(finalEvaluation.preparationPlan)) {
                report.preparationPlan = finalEvaluation.preparationPlan;
            }
        }

        report.status = 'completed';
        await report.save();

        res.status(200).json({ 
            message: 'Interview completed successfully', 
            finalEvaluation: report.finalEvaluation,
            report 
        });
    } catch (err) {
        console.error("completeInterview Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Retry weak areas: Creates a targeted practice interview
 */
async function retryWeakAreasController(req, res) {
    try {
        const { interviewId } = req.params;
        const report = await interviewReportModel.findById(interviewId);
        if (!report) return res.status(404).json({ error: 'Interview report not found' });

        const weakSkills = (report.finalEvaluation?.weaknesses || []).map(w => w.title).concat(
            (report.skillsGaps || []).filter(g => g.severity === 'high').map(g => g.skill)
        );

        const weakPractice = await generateWeakAreasInterview({
            weakSkills: weakSkills.length > 0 ? weakSkills : ["System Design", "SQL Optimization"],
            candidateProfile: report.candidateProfile,
            jobDescription: report.jobDescription
        });

        // Create new interview session dedicated to practicing weak areas
        const practiceReport = await interviewReportModel.create({
            jobDescription: report.jobDescription,
            resume: report.resume,
            selfDescription: report.selfDescription,
            user: req.decoded.id,
            title: `Practice Weak Areas: ${report.jobAnalysis?.targetRole || 'Target Role'}`,
            matchScore: Math.max((report.matchScore || 60) - 10, 40),
            candidateProfile: report.candidateProfile,
            jobAnalysis: report.jobAnalysis,
            skillComparison: report.skillComparison,
            interviewPlan: {
                totalQuestions: (weakPractice.questions || []).length,
                breakdown: [{ category: "Weak Areas Remediation", count: (weakPractice.questions || []).length }],
                focusAreas: weakSkills.map(s => ({ skill: s, status: "Weak" }))
            },
            adaptiveQuestions: weakPractice.questions || [],
            currentDifficulty: "Intermediate",
            status: "in-progress"
        });

        res.status(200).json({
            message: 'Weak areas practice session created',
            practiceInterviewId: practiceReport._id,
            practiceReport
        });
    } catch (err) {
        console.error("retryWeakAreas Error:", err);
        res.status(500).json({ error: 'Failed to create weak area practice session' });
    }
}

export default { 
    generateInterviewReportController, 
    getInterviewByIdController, 
    getAllInterviewReportByUserId, 
    deleteInterviewReportController,
    submitAnswerController,
    getNextAdaptiveQuestionController,
    completeInterviewController,
    retryWeakAreasController
};
