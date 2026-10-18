# Email OTP Verification System Implementation Plan

## Overview
Add secure email OTP verification to the existing intervAI registration flow using Resend for transactional emails, reusing existing architecture and patterns.

## Phase 2 — Plan

### Files to Modify
**Backend:**
1. `backend/src/services/emailService.js` - Replace Nodemailer SMTP with Resend
2. `backend/src/controllers/auth.controller.js` - Modify registerUser, add OTP endpoints
3. `backend/src/routes/auth.routes.js` - Add OTP verification routes
4. `backend/src/models/user.model.js` - Ensure OTP fields are properly utilized
5. `backend/.env` - Add Resend environment variables
6. `backend/.env.example` - Add example Resend variables

**Frontend:**
1. `frontend/src/features/auth/pages/Register.jsx` - Modify to handle OTP verification step
2. `frontend/src/features/auth/pages/Login.jsx` - No changes needed (login unaffected)
3. `frontend/src/features/auth/services/auth.api.js` - Add OTP API functions
4. `frontend/src/features/auth/hooks/useAuth.js` - Add OTP handling functions
5. `frontend/src/features/auth/components/` - Create new OTP verification component (if needed)
6. `frontend/.env` - No changes needed (VITE vars already covered)
7. `frontend/index.html` - No changes needed

### New Files to Create
**Backend:**
- None (reusing existing structures)

**Frontend:**
- `frontend/src/features/auth/pages/VerifyOTP.jsx` - New OTP verification page
- `frontend/src/features/auth/components/OTPInput.jsx` - Reusable OTP input component (optional)

### Dependencies to Add
**Backend:**
- `resend` - Official Resend API client
- `crypto` - Built-in Node module (no install needed)

**Frontend:**
- None (reusing existing React/Vite/Tailwind stack)

### Database Changes
- No schema changes needed (user model already has verification fields)
- Will use existing `verificationToken` field to store hashed OTP
- Will use existing `verificationExpires` for OTP expiry
- Will use existing `verificationAttempts` for attempt tracking
- Will use existing `isVerified` to track email verification status

### API Changes
**New Endpoints:**
1. `POST /api/auth/send-otp` - Send OTP to email
2. `POST /api/auth/verify-otp` - Verify OTP and complete registration
3. `POST /api/auth/resend-otp` - Resend OTP with cooldown

**Modified Endpoints:**
1. `POST /api/auth/register` - Modified to create user but not complete registration until OTP verified

### Environment Variables Required
Add to backend `.env`:
- `RESEND_API_KEY=` - Resend API key
- `RESEND_FROM_EMAIL=` - Verified sender email (e.g., "intervAI@yourdomain.com")
- `OTP_EXPIRY_MINUTES=5` - OTP expiry time (default 5 minutes)

Add to backend `.env.example`:
- Same variables with empty values for documentation

### Implementation Approach
1. **Registration Flow Changes:**
   - User submits registration form → backend creates user record but doesn't set JWT cookie
   - Backend generates secure 6-digit OTP, hashes it, stores in user.verificationToken
   - Backend sets verificationExpires and resets verificationAttempts
   - Backend sends OTP email via Resend
   - Frontend shows OTP verification screen instead of redirecting to dashboard
   - User enters OTP → backend verifies → if correct, sets isVerified=true, creates JWT cookie
   - Backend sends registration success email
   - Frontend redirects to dashboard

2. **Security Measures:**
   - Use Node's `crypto.randomInt()` for cryptographically secure OTP generation
   - Hash OTP with bcrypt before storing (same as password hashing)
   - Implement rate limiting (max 5 incorrect attempts)
   - Implement resend cooldown (minimum 60 seconds between sends)
   - Normalize email (trim + lowercase)
   - Never return OTP in API responses
   - Never log OTP or secrets

3. **Frontend Changes:**
   - Modify Register.jsx to handle OTP verification state
   - Create VerifyOTP.jsx page for OTP input
   - Add OTP input component with 6 separate inputs or single masked input
   - Add resend button with countdown timer
   - Show success/error states
   - Maintain existing intervAI styling and branding

### Verification Steps
1. Test OTP generation is cryptographically secure
2. Test OTP hashing and verification
3. Test OTP expiration (5 minutes)
4. Test attempt limiting (5 max incorrect attempts)
5. Test resend cooldown functionality
6. Test existing registration still works (with OTP verification)
7. Test existing login still works
8. Test Google OAuth still works
9. Test Docker Compose environment variable injection
10. Test frontend build and linting