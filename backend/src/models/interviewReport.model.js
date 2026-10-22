import mongoose from 'mongoose';

const questionItemSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'question is required']
    },
    category: {
        type: String,
        default: 'Technical Fundamentals'
    },
    difficulty: {
        type: String,
        default: 'Intermediate'
    },
    projectRef: {
        type: String,
        default: ''
    },
    whyAsked: {
        type: String,
        default: ''
    },
    intention: {
        type: String,
        default: ''
    },
    idealAnswer: {
        type: String,
        default: ''
    },
    userAnswer: {
        type: String,
        default: ''
    },
    isChallenge: {
        type: Boolean,
        default: false
    },
    feedback: {
        score: { type: Number, default: 0 },
        whatWell: { type: String, default: '' },
        whatMissing: { type: String, default: '' },
        howToImprove: { type: String, default: '' },
        strongerAnswer: { type: String, default: '' },
        likelyFollowUp: { type: String, default: '' },
        improvements: [String],
        drawbacks: [String]
    }
}, { _id: false });

// Backward compatibility legacy sub-schemas
const legacyTechnicalSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, default: '' },
    answer: { type: String, default: '' },
    userAnswer: String,
    feedback: {
        improvements: [String],
        drawbacks: [String],
        score: Number
    }
}, { _id: false });

const legacyBehavioralSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, default: '' },
    answer: { type: String, default: '' },
    userAnswer: String,
    feedback: {
        improvements: [String],
        drawbacks: [String],
        score: Number
    }
}, { _id: false });

const skiilsGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, 'skill is required']
    },
    severity: {
        type: String,
        default: 'medium'
    }
}, { _id: false });

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        default: 1
    },
    focused_topic: {
        type: String,
        default: 'Interview Preparation'
    },
    task: {
        type: [String],
        default: []
    }
}, { _id: false });

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, 'Job description is required'],
    },
    resume: {
        type: String
    },
    selfDescription: {
        type: String
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 70
    },
    title: {
        type: String,
        default: 'Interview Evaluation'
    },
    status: {
        type: String,
        default: 'generated'
    },
    
    // Detailed Profile & Job Analysis
    candidateProfile: {
        technicalSkills: { type: [String], default: [] },
        programmingLanguages: { type: [String], default: [] },
        frameworks: { type: [String], default: [] },
        databases: { type: [String], default: [] },
        cloudDevOps: { type: [String], default: [] },
        projects: [{
            title: String,
            description: String,
            technologies: [String]
        }],
        experience: { type: String, default: '' },
        education: { type: String, default: '' },
        relevantAchievements: { type: [String], default: [] }
    },
    jobAnalysis: {
        targetRole: { type: String, default: '' },
        requiredSkills: { type: [String], default: [] },
        preferredSkills: { type: [String], default: [] },
        responsibilities: { type: [String], default: [] },
        technicalRequirements: { type: [String], default: [] },
        experienceRequirements: { type: String, default: '' }
    },
    skillComparison: [{
        skill: { type: String, default: '' },
        status: {
            type: String,
            default: 'Moderate'
        },
        evidence: { type: String, default: '' }
    }],

    // Personalized Interview Plan
    interviewPlan: {
        totalQuestions: { type: Number, default: 12 },
        breakdown: [{
            category: String,
            count: Number
        }],
        focusAreas: [{
            skill: String,
            status: String
        }]
    },

    // Dynamic Adaptive Questions
    adaptiveQuestions: [questionItemSchema],
    currentDifficulty: {
        type: String,
        default: 'Intermediate'
    },

    // Comprehensive Final Evaluation
    finalEvaluation: {
        overallScore: { type: Number, default: 0 },
        recommendation: { type: String, default: '' },
        scoreBreakdown: {
            technicalKnowledge: { type: Number, default: 0 },
            problemSolving: { type: Number, default: 0 },
            communication: { type: Number, default: 0 },
            projectUnderstanding: { type: Number, default: 0 },
            systemDesign: { type: Number, default: 0 },
            roleReadiness: { type: Number, default: 0 }
        },
        skillHeatmap: [{
            skill: String,
            score: Number,
            level: String
        }],
        jobReadiness: {
            score: { type: Number, default: 0 },
            summary: { type: String, default: '' },
            priorityAreas: [String]
        },
        strengths: [{
            title: String,
            evidence: String
        }],
        weaknesses: [{
            title: String,
            whyItMatters: String,
            evidence: String,
            whatToStudy: String,
            exposedByQuestion: String
        }]
    },

    // Legacy fields for backward compatibility
    technicalQuestions: [legacyTechnicalSchema],
    behavioralQuestions: [legacyBehavioralSchema],
    skillsGaps: [skiilsGapSchema],
    preparationPlan: [preparationPlanSchema],
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user is required']
    }
}, {
    timestamps: true 
});

const interviewReportModel = mongoose.model('InterviewReport', interviewReportSchema);
export default interviewReportModel;
