# Current Architecture

## 1. System Components
- **Client (Frontend)**: React 19 single-page application built with Vite.
  - State management: React Context (`Auth.context.jsx`, `interview.context.jsx`).
  - Audio/Video: Browser `navigator.mediaDevices.getUserMedia` and Web Speech API (`webkitSpeechRecognition`).
  - Network: Axios instance with credentials enabled (`withCredentials: true`).
- **Server (Backend)**: Express 5 application running on Node.js (ESM).
  - MongoDB connection via Mongoose with TLS replica set.
  - JWT in HTTP-only cookies (`token`).
  - File upload via Multer memory storage (`req.file.buffer`).
  - PDF text extraction using `pdf-parse`.
- **AI Service**: Google GenAI SDK (`@google/genai`), using `gemini-2.5-flash-lite` with structured JSON responses.

## 2. Existing Working Assets
- **Auth**: Email/Password registration with 6-digit OTP verification via Resend, login, profile updates, and route protection.
- **Resume Upload & Parsing**: PDF upload to in-memory buffer and parsing via `pdf-parse`.
- **Speech & Audio**: Browser Web Speech API for real-time transcription and audio blob recording for server upload.
- **AI Generation**: Structured JSON extraction for interview questions, intention, suggested answers, skill gaps, and preparation plan.
