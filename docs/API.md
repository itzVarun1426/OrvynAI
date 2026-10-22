# intervAI REST API Documentation

## Auth Endpoints
- `POST /api/auth/register`: Register user and send OTP email.
- `POST /api/auth/send-otp`: Request or resend 6-digit OTP.
- `POST /api/auth/verify-otp`: Validate OTP and activate JWT session.
- `POST /api/auth/login`: Authenticate existing user.
- `GET /api/auth/profile`: Get logged in user details.
- `POST /api/auth/logout`: Invalidate cookie.

## Interview & AI Endpoints
- `POST /api/interview`: Upload resume & JD, extract profile, skill comparison, and interview plan.
- `GET /api/interview`: Get all historical interview reports for user.
- `GET /api/interview/report/:interviewId`: Fetch single complete interview report.
- `DELETE /api/interview/:interviewId`: Remove an interview report.
- `POST /api/interview/:interviewId/answer`: Submit answer text or audio blob; returns evaluation and triggers adaptive state.
- `POST /api/interview/:interviewId/next-question`: Fetch next adaptive question based on previous answers, projects, and difficulty level.
- `POST /api/interview/:interviewId/retry-weak`: Create focused practice session for diagnosed weak areas.
- `POST /api/interview/:interviewId/complete`: Finalize report and generate comprehensive visual metrics.
