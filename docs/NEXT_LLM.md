# Guide for Next LLM / Developer

## What intervAI Does
intervAI is an adaptive AI interview platform. It digests a candidate's PDF resume and a target job description, performs evidence-based profile extraction and skill gap analysis, crafts a focused interview plan, conducts an adaptive interview (with Challenge Mode and project architecture probing), and delivers a comprehensive SaaS-grade visual interview report with one-click weak area practice.

## Current State
- Auth is fully implemented and secured with Resend OTP.
- PDF parsing works via `pdf-parse`.
- Audio/Video setup in the browser works with Web Speech API transcription.
- Architecture docs and task breakdown are active in `/docs`.
- Adaptive Interview loop is fully connected (`submitAnswer` -> `getNextAdaptiveQuestion` -> `completeInterview` -> `retryWeakAreas`).
- Visual Final Report is operational with score breakdowns, heatmap, job readiness, 4-pillar question feedback, and "Why was I asked this?".

## Important Files
- `backend/src/models/interviewReport.model.js`: Mongoose schema for interview reports.
- `backend/src/services/ai.service.js`: Gemini integration for analysis, question generation, and evaluations.
- `backend/src/controllers/interview.controller.js`: Orchestrates interview actions.
- `backend/src/routes/interview.route.js`: API routes for interview operations.
- `frontend/src/features/interview/pages/Dashboard.jsx`: Resume/JD input and interview launch.
- `frontend/src/features/interview/pages/InterviewSelection.jsx`: Pre-flight briefing and plan review.
- `frontend/src/features/interview/pages/Interview.jsx`: Adaptive interview chamber with Challenge Mode & transcription.
- `frontend/src/features/interview/pages/Evaluation.jsx`: Visual final analytics report.

## Things NOT to Change
- Do NOT rewrite the authentication system or remove Resend OTP logic.
- Do NOT change backend environment variable names without updating `.env`.
- Do NOT replace the working `@google/genai` library with another SDK.
