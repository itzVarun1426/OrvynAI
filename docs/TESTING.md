# Manual & Automated Testing Guide

## Prerequisite Checks
1. Backend environment variables configured in `backend/.env`.
2. Frontend environment configured in `frontend/.env`.
3. MongoDB Atlas or local database accessible.
4. Gemini API Key active.

## Step-by-Step Test Walkthrough
1. **Start Services**:
   - Backend: `npm start` in `backend/`
   - Frontend: `npm run dev` in `frontend/`
2. **User Authentication**:
   - Register or log in to a verified account.
3. **Candidate Input**:
   - Upload sample resume PDF.
   - Paste Target Job Description.
   - Click "Analyze & Create Interview Plan".
4. **Plan Inspection**:
   - Verify Candidate Profile, Job Analysis, Skill Gap matrix, and Interview Plan breakdown are rendered.
5. **Interview Session**:
   - Test camera & microphone permission.
   - Speak answers to test real-time Web Speech transcription.
   - Observe adaptive questions responding to previous responses.
6. **Final Report Review**:
   - Verify Score breakdown cards (Technical, Problem Solving, Communication, etc.).
   - Verify Skill Heatmap and Job Readiness card.
   - Inspect Question feedback (What went well, what was missing, stronger answer).
   - Test "Why was I asked this?".
   - Click "Practice Weak Areas" to launch remediated session.
