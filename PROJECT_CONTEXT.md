# intervAI - Project Context

## Overview
intervAI is an adaptive AI interview platform designed to conduct realistic technical and behavioral interviews. Rather than relying on a static questionnaire or generic chatbot responses, intervAI evaluates candidates' resumes against target job descriptions, identifies evidence-backed skill gaps, plans a focused interview, conducts an adaptive dynamic interview with real-time audio/video interaction, challenges weak claims, and produces an actionable visual final report with targeted weak-area remediation.

## Core Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Framer Motion, Lucide React, Axios, React Router 7
- **Backend**: Node.js (ES Modules), Express 5, MongoDB / Mongoose 9, Multer, pdf-parse
- **AI & Integrations**: Google GenAI SDK (`@google/genai`), Gemini 2.5 Flash / Flash-lite models
- **Auth**: JWT with HTTP-only cookies, bcrypt password & OTP hashing, Resend email OTP verification

## Directory Layout
- `backend/`: Express server, controllers, models, routes, services
- `frontend/`: React Vite app, feature slices (`interview`, `auth`), components, styling
- `docs/`: In-depth documentation suite for architecture, flow, API, database, and evaluation
