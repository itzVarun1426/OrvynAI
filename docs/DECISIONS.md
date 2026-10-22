# Architectural Decisions

## Decision 1: Reuse existing Express + Mongoose + Vite Stack
- **Context**: intervAI already had a working foundation for authentication, file handling, and basic Gemini connectivity.
- **Decision**: Keep and extend the existing framework rather than replacing it with an unfamiliar stack.
- **Benefits**: Zero regression on auth, avoids dependency churn before hackathon submission.

## Decision 2: Schema Extension over Discard
- **Context**: The `interviewReportModel` had basic `technicalQuestions` and `behavioralQuestions`.
- **Decision**: Extend the model backward-compatibly to include `candidateProfile`, `jobAnalysis`, `skillComparison`, `interviewPlan`, `questions` (adaptive array with challenge tags & feedback), and `finalEvaluation`.
- **Benefits**: Existing reports remain readable while new reports feature rich adaptive intelligence.

## Decision 3: Single Structured Gemini Calls for Analysis and Evaluation
- **Context**: Generating many sequential roundtrips can introduce latency in hackathon demos.
- **Decision**: Use structured JSON prompts with fallback tolerance, ensuring reliable responses within seconds.
