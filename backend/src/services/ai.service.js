import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const getGenAI = () => new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const genai = {
  get models() {
    return getGenAI().models;
  }
};

const GeminiModel = "gemini-2.5-flash-lite";

function cleanJsonText(rawText) {
  if (!rawText) return "{}";
  return rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
}

function normalizeDifficulty(val) {
  if (!val || typeof val !== "string") return "Intermediate";
  const lower = val.toLowerCase().trim();
  if (lower.includes("easy") || lower.includes("begin")) return "Beginner";
  if (lower.includes("expert") || lower.includes("lead") || lower.includes("prin")) return "Expert";
  if (lower.includes("hard") || lower.includes("adv")) return "Advanced";
  return "Intermediate";
}

function normalizeStatus(val) {
  if (!val || typeof val !== "string") return "Moderate";
  const lower = val.toLowerCase().trim();
  if (lower.includes("strong") || lower.includes("high") || lower.includes("good")) return "Strong";
  if (lower.includes("weak") || lower.includes("low") || lower.includes("poor") || lower.includes("none") || lower.includes("lack")) return "Weak";
  return "Moderate";
}

function normalizeSeverity(val) {
  if (!val || typeof val !== "string") return "medium";
  const lower = val.toLowerCase().trim();
  if (lower.includes("high") || lower.includes("crit") || lower.includes("sever")) return "high";
  if (lower.includes("low") || lower.includes("min")) return "low";
  return "medium";
}

/**
 * 1. RESUME + JOB DESCRIPTION ANALYSIS & INTERVIEW PLAN
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  try {
    const prompt = `
You are an elite Staff Technical Interviewer and Engineering Manager at a top tech company.
Analyze the candidate's Resume/Bio and the Target Job Description with high precision.

Do NOT simply match keywords or strings. Reason deeply about evidence, architectural exposure, and gaps.

Return ONLY valid JSON matching this structure:
{
  "title": "Role Title Assessment",
  "matchScore": 78,
  "candidateProfile": {
    "technicalSkills": ["Node.js", "Express", "MongoDB", "React", "Docker"],
    "programmingLanguages": ["JavaScript", "TypeScript", "Python"],
    "frameworks": ["React", "Express", "TailwindCSS"],
    "databases": ["MongoDB", "PostgreSQL", "Redis"],
    "cloudDevOps": ["AWS (EC2, S3)", "Docker", "GitHub Actions"],
    "projects": [
      {
        "title": "Project Name from resume",
        "description": "Short architecture description and what was claimed",
        "technologies": ["React", "Node.js", "Socket.io"]
      }
    ],
    "experience": "2 years backend development experience",
    "education": "B.Tech in Computer Science",
    "relevantAchievements": ["Built high-throughput payment webhook handler"]
  },
  "jobAnalysis": {
    "targetRole": "Backend Engineer",
    "requiredSkills": ["Node.js", "Microservices", "PostgreSQL", "Redis"],
    "preferredSkills": ["Kafka", "Kubernetes", "AWS"],
    "responsibilities": ["Design scalable REST/gRPC APIs", "Optimize SQL queries"],
    "technicalRequirements": ["Production experience with high-load Node services"],
    "experienceRequirements": "2+ years"
  },
  "skillComparison": [
    {
      "skill": "Node.js",
      "status": "Strong",
      "evidence": "Extensive production usage demonstrated across multiple projects."
    },
    {
      "skill": "System Design",
      "status": "Weak",
      "evidence": "Resume mentions simple CRUD applications without evidence of caching or partition strategies."
    }
  ],
  "interviewPlan": {
    "totalQuestions": 12,
    "breakdown": [
      { "category": "Technical Fundamentals", "count": 3 },
      { "category": "Project Deep Dive", "count": 3 },
      { "category": "Role-Specific Skills", "count": 3 },
      { "category": "Problem Solving", "count": 2 },
      { "category": "Behavioral", "count": 1 }
    ],
    "focusAreas": [
      { "skill": "React", "status": "Strong" },
      { "skill": "Node.js", "status": "Strong" },
      { "skill": "SQL", "status": "Moderate" },
      { "skill": "System Design", "status": "Weak" },
      { "skill": "AWS", "status": "Weak" }
    ]
  },
  "technicalQuestions": [
    {
      "question": "In Node.js, how does the libuv event loop handle thread pool offloading for I/O and crypto tasks?",
      "category": "Technical Fundamentals",
      "difficulty": "Intermediate",
      "projectRef": "",
      "whyAsked": "Selected because Node.js is a required skill for this role.",
      "intention": "Test fundamental comprehension of Node's single-threaded nature vs thread pool execution.",
      "answer": "Explanation of event loop phases, UV_THREADPOOL_SIZE, and distinguishing between async non-blocking OS primitives and threadpool operations.",
      "isChallenge": false
    },
    {
      "question": "Walk me through the end-to-end architecture of your most demanding project and the primary bottleneck you resolved.",
      "category": "Project Deep Dive",
      "difficulty": "Intermediate",
      "projectRef": "Primary Resume Project",
      "whyAsked": "Selected based on the flagship project claimed on your resume to evaluate hands-on architectural ownership.",
      "intention": "Evaluate architectural clarity, understanding of latency bottlenecks, and trade-off decisions.",
      "answer": "Should describe data flow, component decoupling, bottleneck diagnosis (profiling/metrics), and the quantitative outcome.",
      "isChallenge": false
    },
    {
      "question": "How do composite B-Tree indexes in SQL handle multi-column lookups when the leading prefix is omitted in the WHERE clause?",
      "category": "Role-Specific Skills",
      "difficulty": "Intermediate",
      "projectRef": "",
      "whyAsked": "Assesses SQL query optimization capabilities specified in the job description.",
      "intention": "Probe understanding of index traversal constraints and avoiding full table scans.",
      "answer": "Explains why B-Tree index traversal requires the leftmost prefix, and why omitting it forces an index or table scan.",
      "isChallenge": false
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a difficult technical conflict you had with a teammate regarding system architecture, and how you reached a resolution.",
      "category": "Behavioral",
      "difficulty": "Intermediate",
      "projectRef": "",
      "whyAsked": "Assesses collaborative problem solving, technical communication, and constructive alignment under differing engineering opinions.",
      "intention": "Evaluate emotional intelligence, constructive persuasion with data, and professional maturity.",
      "answer": "Structured using STAR method: defines context, conflicting technical trade-offs, collaborative proof-of-concept/benchmarking, and constructive team alignment.",
      "isChallenge": false
    },
    {
      "question": "Describe a production outage or critical bug you introduced. How did you diagnose it, communicate with stakeholders, and prevent recurrence?",
      "category": "Behavioral",
      "difficulty": "Intermediate",
      "projectRef": "",
      "whyAsked": "Tests accountability, crisis management, post-mortem methodology, and systemic learning.",
      "intention": "Probe ownership, incident management, and preventive engineering practices.",
      "answer": "Candidate takes personal ownership, details triage under pressure, root cause identification, and creation of automated regression tests or monitoring guards.",
      "isChallenge": false
    }
  ],
  "skillsGaps": [
    {
      "skill": "System Design",
      "severity": "high"
    },
    {
      "skill": "SQL Optimization",
      "severity": "medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focused_topic": "SQL Indexing & Query Optimization",
      "task": ["Analyze EXPLAIN ANALYZE execution plans", "Review B-Tree vs Hash index trade-offs"]
    },
    {
      "day": 2,
      "focused_topic": "System Design Fundamentals",
      "task": ["Study horizontal vs vertical scaling", "Design rate limiter and caching strategies"]
    }
  ]
}

Candidate Resume:
${resume}

Candidate Bio / Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    const response = await genai.models.generateContent({
      model: GeminiModel,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const parsed = JSON.parse(cleanJsonText(response.text));

    const technicalQuestions = (Array.isArray(parsed.technicalQuestions) ? parsed.technicalQuestions : []).map(q => ({
      question: q.question || "Technical Question",
      category: q.category || "Technical Fundamentals",
      difficulty: normalizeDifficulty(q.difficulty),
      projectRef: q.projectRef || "",
      whyAsked: q.whyAsked || "Selected based on technical requirements.",
      intention: q.intention || "",
      answer: q.answer || q.idealAnswer || "Provide structured technical explanation.",
      idealAnswer: q.answer || q.idealAnswer || "Provide structured technical explanation.",
      isChallenge: Boolean(q.isChallenge)
    }));

    const behavioralQuestions = (Array.isArray(parsed.behavioralQuestions) ? parsed.behavioralQuestions : []).map(q => ({
      question: q.question || "Behavioral Question",
      category: q.category || "Behavioral",
      difficulty: normalizeDifficulty(q.difficulty),
      projectRef: q.projectRef || "",
      whyAsked: q.whyAsked || "Selected to evaluate communication and ownership.",
      intention: q.intention || "",
      answer: q.answer || q.idealAnswer || "Candidate uses STAR method.",
      idealAnswer: q.answer || q.idealAnswer || "Candidate uses STAR method.",
      isChallenge: Boolean(q.isChallenge)
    }));

    const skillComparison = (Array.isArray(parsed.skillComparison) ? parsed.skillComparison : []).map(sc => ({
      skill: sc.skill || "Technical Skill",
      status: normalizeStatus(sc.status),
      evidence: sc.evidence || ""
    }));

    const skillsGaps = (Array.isArray(parsed.skillsGaps) ? parsed.skillsGaps : []).map(sg => ({
      skill: sg.skill || "Skill Gap",
      severity: normalizeSeverity(sg.severity)
    }));

    const preparationPlan = (Array.isArray(parsed.preparationPlan) ? parsed.preparationPlan : []).map((pp, idx) => ({
      day: typeof pp.day === "number" ? pp.day : (idx + 1),
      focused_topic: pp.focused_topic || "Core Preparation",
      task: Array.isArray(pp.task) ? pp.task.map(String) : ["Review topic"]
    }));

    // Combine both technical and behavioral questions into the initial adaptive queue
    const initialAdaptiveQuestions = [
      ...technicalQuestions,
      ...behavioralQuestions
    ];

    const matchScore = typeof parsed.matchScore === "number" ? Math.min(Math.max(parsed.matchScore, 0), 100) : 75;

    return {
      title: parsed.title || "Technical & Behavioral Interview Plan",
      matchScore,
      candidateProfile: parsed.candidateProfile || {},
      jobAnalysis: parsed.jobAnalysis || {},
      skillComparison,
      interviewPlan: parsed.interviewPlan || {
        totalQuestions: initialAdaptiveQuestions.length,
        breakdown: [
          { category: "Technical Fundamentals", count: technicalQuestions.length },
          { category: "Behavioral", count: behavioralQuestions.length }
        ],
        focusAreas: []
      },
      adaptiveQuestions: initialAdaptiveQuestions,
      technicalQuestions,
      behavioralQuestions,
      currentDifficulty: "Intermediate",
      skillsGaps,
      preparationPlan
    };
  } catch (error) {
    console.error("Analysis AI Error:", error);
    return null;
  }
}

/**
 * 2. ANSWER EVALUATION (Depth, Correctness, Feedback Breakdown)
 */
async function evaluateAnswer({ question, intention, modelAnswer, userAnswer, audioBase64, mimeType }) {
  try {
    const prompt = `
You are a senior technical and behavioral interviewer evaluating a candidate's live answer.

Question: ${question}
Interviewer Intention: ${intention}
Ideal Model Answer: ${modelAnswer}

Candidate's Answer (Provided Text): ${userAnswer || "No text provided, extract transcription from attached audio."}

Evaluate the candidate's understanding deeply. Do not settle for shallow buzzwords.
Estimate depth across correctness, specificity, and recognition of trade-offs.

Return ONLY valid JSON matching this format:
{
  "userAnswer": "Accurate transcription of candidate answer",
  "score": 78,
  "whatWell": "Clearly explained the primary mechanism and correctly cited the relevant data structure.",
  "whatMissing": "Did not address edge cases or the write overhead incurred.",
  "howToImprove": "Mention how you would handle write amplification or concurrency conflicts.",
  "strongerAnswer": "A crisp, senior-level response synthesizing the concept with clear trade-offs.",
  "likelyFollowUp": "How would you handle cache invalidation if this key expires concurrently across replicas?",
  "improvements": ["Deepen explanation of failure recovery", "Clarify memory trade-offs"],
  "drawbacks": ["Omitted concurrency control"],
  "depthLevel": "Intermediate",
  "understandingDepth": 75,
  "shouldChallenge": false,
  "challengeReason": ""
}
`;

    const parts = [{ text: prompt }];
    if (audioBase64 && mimeType) {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: audioBase64
        }
      });
    }

    const response = await genai.models.generateContent({
      model: GeminiModel,
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(cleanJsonText(response.text));
    return {
      userAnswer: parsed.userAnswer || userAnswer || "(Verbal response recorded)",
      score: typeof parsed.score === "number" ? parsed.score : 70,
      whatWell: parsed.whatWell || "Clear communication and relevant fundamental points.",
      whatMissing: parsed.whatMissing || "Could have included trade-offs and operational challenges.",
      howToImprove: parsed.howToImprove || "Explain edge cases and system constraints.",
      strongerAnswer: parsed.strongerAnswer || modelAnswer,
      likelyFollowUp: parsed.likelyFollowUp || "Can you elaborate on the performance implications?",
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      drawbacks: Array.isArray(parsed.drawbacks) ? parsed.drawbacks : [],
      depthLevel: normalizeDifficulty(parsed.depthLevel),
      understandingDepth: typeof parsed.understandingDepth === "number" ? parsed.understandingDepth : 70,
      shouldChallenge: Boolean(parsed.shouldChallenge),
      challengeReason: parsed.challengeReason || ""
    };
  } catch (error) {
    console.error("Evaluation AI Error:", error);
    return {
      userAnswer: userAnswer || "Response recorded",
      score: 70,
      whatWell: "Addressed the question directly.",
      whatMissing: "Deeper technical justification of trade-offs.",
      howToImprove: "Mention operational performance and constraints.",
      strongerAnswer: modelAnswer || "A complete answer clearly discussing edge cases and trade-offs.",
      likelyFollowUp: "How does this scale under heavy concurrent load?",
      improvements: ["Elaborate on edge cases"],
      drawbacks: ["Could be more specific"],
      depthLevel: "Intermediate",
      understandingDepth: 70,
      shouldChallenge: false
    };
  }
}

/**
 * 3. DYNAMIC ADAPTIVE NEXT QUESTION GENERATOR (with Challenge Mode & Project Deep Dive)
 */
async function generateNextAdaptiveQuestion({
  interviewReport,
  previousQuestionsAndAnswers,
  lastAnswerEvaluation,
  currentDifficulty
}) {
  try {
    const prompt = `
You are an active Technical & Behavioral Interviewer conducting a live adaptive interview.

Candidate Profile & Projects:
${JSON.stringify(interviewReport.candidateProfile || {}, null, 2)}

Target Job Description:
${interviewReport.jobDescription}

Interview Plan Breakdown & Focus Areas:
${JSON.stringify(interviewReport.interviewPlan || {}, null, 2)}

Current Difficulty: ${currentDifficulty}

Previous Questions and Candidate Answers:
${JSON.stringify(previousQuestionsAndAnswers, null, 2)}

Evaluation of the candidate's last answer:
${JSON.stringify(lastAnswerEvaluation, null, 2)}

INSTRUCTIONS FOR ADAPTIVE QUESTION SELECTION:
1. ADAPTIVE DIFFICULTY:
   - If candidate scored >= 85, advance difficulty level (e.g. Intermediate -> Advanced, Advanced -> Expert).
   - If candidate scored <= 50, ease difficulty to probe fundamentals (e.g. Advanced -> Intermediate, Intermediate -> Beginner).
   - Otherwise, maintain or pivot laterally.
2. BALANCE CATEGORIES:
   - Mix technical fundamentals, project architecture deep dives, role-specific problem solving, and behavioral/leadership scenarios based on the interview plan.
3. CHALLENGE MODE:
   - If the candidate made an unsubstantiated claim, shallow buzzword statement, or showed confusion (e.g. "Docker makes it scalable", "MongoDB is just faster"), CHALLENGE that claim directly and respectfully.
   - Example: "You mentioned using Redis for caching. What data did you cache, and how did you handle cache invalidation?"
4. PROJECT DEEP DIVE:
   - Reference specific projects from the candidate's resume! Probe architecture, bottlenecks, failure modes, scale (e.g. "What would break if 10,000 users hit this simultaneously?").
5. "WHY WAS I ASKED THIS?":
   - Provide a clear, transparent reason explicitly linking the candidate's resume claims, target job requirements, and their previous answers.

Return ONLY valid JSON matching this format:
{
  "question": "Dynamic personalized next question",
  "category": "Project Deep Dive",
  "difficulty": "Intermediate",
  "projectRef": "Project Name (if relevant)",
  "whyAsked": "Clear explanation referencing their resume, job requirements, and previous response.",
  "intention": "Specific technical or behavioral competency being probed.",
  "idealAnswer": "Comprehensive ideal response detailing concepts and trade-offs.",
  "isChallenge": true
}
`;

    const response = await genai.models.generateContent({
      model: GeminiModel,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(cleanJsonText(response.text));
    return {
      question: parsed.question || "Can you walk through your problem-solving approach for this technical bottleneck?",
      category: parsed.category || "Technical Fundamentals",
      difficulty: normalizeDifficulty(parsed.difficulty || currentDifficulty),
      projectRef: parsed.projectRef || "",
      whyAsked: parsed.whyAsked || "Selected to assess key role capabilities.",
      intention: parsed.intention || "Assess depth of reasoning.",
      idealAnswer: parsed.idealAnswer || "",
      isChallenge: Boolean(parsed.isChallenge)
    };
  } catch (error) {
    console.error("Next Question AI Error:", error);
    return {
      question: "Can you describe how you approach debugging memory leaks or asynchronous bottlenecks in production?",
      category: "Problem Solving",
      difficulty: normalizeDifficulty(currentDifficulty),
      projectRef: "",
      whyAsked: "Selected to test practical operational troubleshooting under production workloads.",
      intention: "Examine systematic problem-solving methodology.",
      idealAnswer: "Using heap dumps, Chrome DevTools/node --inspect, monitoring garbage collection pauses, and systematic isolation.",
      isChallenge: false
    };
  }
}

/**
 * 4. FINAL COMPREHENSIVE REPORT GENERATION
 */
async function generateFinalEvaluationReport({ interviewReport }) {
  try {
    const questionsCompleted = (interviewReport.adaptiveQuestions || []).filter(q => q.userAnswer);

    const prompt = `
You are a Staff Technical Evaluator creating a definitive final interview report for an executive engineering panel.

Job Description:
${interviewReport.jobDescription}

Candidate Profile:
${JSON.stringify(interviewReport.candidateProfile || {}, null, 2)}

Completed Interview Questions, Candidate Answers, and Detailed Feedback:
${JSON.stringify(questionsCompleted, null, 2)}

Generate a comprehensive, visual, analytics-grade final evaluation report.
Return ONLY valid JSON with this format:
{
  "overallScore": 82,
  "recommendation": "Strong candidate with specific gaps in System Design & SQL optimization.",
  "scoreBreakdown": {
    "technicalKnowledge": 86,
    "problemSolving": 81,
    "communication": 78,
    "projectUnderstanding": 91,
    "systemDesign": 62,
    "roleReadiness": 79
  },
  "skillHeatmap": [
    { "skill": "React", "score": 89, "level": "Advanced" },
    { "skill": "Node.js", "score": 91, "level": "Expert" },
    { "skill": "MongoDB", "score": 74, "level": "Intermediate" },
    { "skill": "SQL", "score": 52, "level": "Beginner" },
    { "skill": "AWS", "score": 61, "level": "Intermediate" },
    { "skill": "System Design", "score": 43, "level": "Beginner" }
  ],
  "jobReadiness": {
    "score": 78,
    "summary": "You are well prepared for backend responsibilities, but should strengthen distributed systems and database indexing before senior-level loops.",
    "priorityAreas": ["System Design", "SQL optimization", "AWS architecture"]
  },
  "strengths": [
    {
      "title": "Strong Node.js Architecture",
      "evidence": "Detailed and accurate explanation of event loop asynchronous task dispatching."
    },
    {
      "title": "Deep Project Understanding",
      "evidence": "Clearly justified architecture and data structures in the flagship resume project."
    }
  ],
  "weaknesses": [
    {
      "title": "System Design & Scalability Trade-offs",
      "whyItMatters": "Senior and mid-level roles require designing systems that handle traffic surges without data loss.",
      "evidence": "Relied on containerization as a substitute for horizontal partitioning and cache invalidation.",
      "whatToStudy": "Read Designing Data-Intensive Applications; practice consistent hashing and read/write replication.",
      "exposedByQuestion": "Question regarding 100,000 concurrent user scaling."
    },
    {
      "title": "SQL Query Optimization",
      "whyItMatters": "Production latency bottlenecks commonly stem from un-indexed sequential table scans.",
      "evidence": "Could not identify write penalty associated with multi-column composite indexes.",
      "whatToStudy": "Study B-tree index structures, covering indexes, and EXPLAIN ANALYZE execution cost.",
      "exposedByQuestion": "Database query optimization question."
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focused_topic": "SQL Fundamentals & EXPLAIN Cost Analysis",
      "task": ["Review B-tree index mechanics", "Run EXPLAIN ANALYZE on complex joins"]
    },
    {
      "day": 2,
      "focused_topic": "SQL Optimization & Write Penalties",
      "task": ["Benchmark index insertion overhead", "Design covering indexes for heavy workloads"]
    },
    {
      "day": 3,
      "focused_topic": "System Design Fundamentals",
      "task": ["Study horizontal partitioning vs sharding", "Design cache-aside with Redis"]
    },
    {
      "day": 4,
      "focused_topic": "AWS Distributed Architecture",
      "task": ["Review VPC, ALB, Auto Scaling groups", "Configure SQS decoupling patterns"]
    },
    {
      "day": 5,
      "focused_topic": "Project Deep Dive Defense",
      "task": ["Diagram complete project data pipeline", "Quantify latency numbers and failure points"]
    },
    {
      "day": 6,
      "focused_topic": "Mock Challenge Interview",
      "task": ["Practice explaining technical trade-offs aloud", "Defend architectural decisions"]
    },
    {
      "day": 7,
      "focused_topic": "Retry Weak Areas Practice",
      "task": ["Complete OrvynAI targeted weak-area mini-loop", "Validate score improvement"]
    }
  ]
}
`;

    const response = await genai.models.generateContent({
      model: GeminiModel,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const parsed = JSON.parse(cleanJsonText(response.text));
    return parsed;
  } catch (error) {
    console.error("Final Evaluation AI Error:", error);
    return null;
  }
}

/**
 * 5. RETRY WEAK AREAS MINI-INTERVIEW GENERATOR
 */
async function generateWeakAreasInterview({ weakSkills, candidateProfile, jobDescription }) {
  try {
    const prompt = `
You are a Technical Interviewer generating a targeted practice session focused specifically on a candidate's diagnosed weak areas.

Weak Skills / Gaps to target:
${JSON.stringify(weakSkills)}

Candidate Background:
${JSON.stringify(candidateProfile || {})}

Target Job:
${jobDescription}

Generate 4 high-yield, adaptive practice questions that directly drill these specific weak areas.
Each question must include a clear "whyAsked" explanation.

Return ONLY valid JSON matching this format:
{
  "focusTitle": "Targeted Weak Areas Mastery Loop",
  "questions": [
    {
      "question": "How do composite B-Tree indexes handle multi-column queries when the leftmost prefix is omitted?",
      "category": "Technical Fundamentals",
      "difficulty": "Intermediate",
      "projectRef": "",
      "whyAsked": "Drills your diagnosed weakness in SQL indexing mechanics.",
      "intention": "Verify understanding of leftmost index prefix rule.",
      "idealAnswer": "Explains why the index cannot be traversed efficiently without the leading column.",
      "isChallenge": false
    }
  ]
}
`;

    const response = await genai.models.generateContent({
      model: GeminiModel,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(cleanJsonText(response.text));
    return {
      focusTitle: parsed.focusTitle || "Weak Area Remediation",
      questions: (Array.isArray(parsed.questions) ? parsed.questions : []).map(q => ({
        question: q.question,
        category: q.category || "Technical Fundamentals",
        difficulty: normalizeDifficulty(q.difficulty),
        projectRef: q.projectRef || "",
        whyAsked: q.whyAsked || "Targeting diagnosed weak area.",
        intention: q.intention || "",
        idealAnswer: q.idealAnswer || "",
        isChallenge: Boolean(q.isChallenge)
      }))
    };
  } catch (error) {
    console.error("Weak Area AI Error:", error);
    return {
      focusTitle: "Weak Area Remediation",
      questions: [
        {
          question: "Can you explain how you would design a cache invalidation strategy to avoid stale reads under high concurrency?",
          category: "System Design",
          difficulty: "Intermediate",
          projectRef: "",
          whyAsked: "Targeting your diagnosed weakness in System Design and caching.",
          intention: "Assess understanding of cache-aside and cache stampede prevention.",
          idealAnswer: "Using TTLs, write-through or cache-aside, mutexes, and distributed locking.",
          isChallenge: false
        }
      ]
    };
  }
}

export {
  generateInterviewReport,
  evaluateAnswer,
  generateNextAdaptiveQuestion,
  generateFinalEvaluationReport,
  generateWeakAreasInterview
};
