# OrvynAi

<p align="center">
  <img src="assets/orvynai-logo.png" alt="OrvynAi Logo" width="180"/>
</p>

<h3 align="center">Practice Smarter. Grow Faster.</h3>

<p align="center">
  An AI-powered adaptive interview platform that understands your resume,
  analyzes your target role, challenges your technical knowledge,
  and tells you exactly what to improve.
</p>

<p align="center">

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/GenAI-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

</p>

---

## 🚀 Overview

Most interview preparation platforms provide candidates with a fixed set of questions.

**OrvynAi takes a different approach.**

It analyzes the candidate's **resume**, the **target job description**, and the candidate's **responses during the interview** to create a personalized and adaptive interview experience.

Instead of simply asking:

> "What is React?"

OrvynAi can understand the candidate's background and ask questions such as:

> "You mentioned building a React application with Redux. Why did you choose Redux over Context API for that project?"

The interview then adapts based on the candidate's answer.

The goal is simple:

> **Don't just practice more questions. Discover what you actually know — and what you don't.**

---

## 🎯 Problem

Traditional interview preparation has several limitations:

- Static question banks
- Generic mock interviews
- Little connection to the candidate's actual resume
- No understanding of the target job
- Limited follow-up questioning
- No meaningful diagnosis of skill gaps
- Generic feedback
- No personalized improvement path

A candidate may answer hundreds of questions without knowing **which skills are actually holding them back**.

---

## 💡 Solution

OrvynAi creates a continuous learning loop:

```text
Resume + Job Description
          ↓
   Candidate Analysis
          ↓
    Skill Gap Analysis
          ↓
 Personalized Interview
          ↓
    Candidate Answer
          ↓
     AI Evaluation
          ↓
 Adaptive Follow-up
          ↓
   Final Assessment
          ↓
 Skill Gaps + Feedback
          ↓
 Personalized Preparation
          ↓
       Retry
          ↓
       Improve
```

---

## 🧠 How OrvynAi Works

![OrvynAi Overview](assets/orvynai-overview.png)

### 1. Resume & Job Analysis

The candidate provides:

- Resume
- Target job description

OrvynAi extracts relevant information such as:

- Technical skills
- Programming languages
- Frameworks
- Databases
- Cloud technologies
- Projects
- Experience
- Job requirements

The system then identifies potential strengths and gaps relative to the target role.

---

### 2. Personalized Interview

Instead of generating a generic interview, OrvynAi creates questions based on:

- Candidate experience
- Resume projects
- Required job skills
- Candidate skill gaps
- Previous answers

This makes every interview different.

---

### 3. Adaptive Questioning

The interviewer does not blindly follow a predefined list.

The flow is:

```text
Question
   ↓
Candidate Answer
   ↓
AI Evaluation
   ↓
Understanding Level
   ↓
Next Question
```

If the candidate demonstrates strong understanding, the system can increase the difficulty.

If the candidate struggles, it can probe fundamentals or provide a different question targeting the same concept.

---

### 4. Project Deep Dive

One of OrvynAi's key features is questioning candidates about projects they actually mention on their resume.

For example:

```text
Resume:
AI Meeting Intelligence Platform
```

The interviewer can explore:

- Architecture
- Technology choices
- Database design
- Scalability
- Performance
- Security
- Failure scenarios
- Trade-offs
- Deployment

This helps distinguish between candidates who **built a project** and candidates who only know how to describe it.

---

### 5. AI Evaluation

Answers are evaluated across multiple dimensions:

| Dimension | What is evaluated |
|---|---|
| Correctness | Is the answer technically accurate? |
| Depth | Does the candidate understand the concept deeply? |
| Reasoning | Can they explain why? |
| Specificity | Are they providing concrete technical details? |
| Communication | Can they clearly explain technical concepts? |
| Practical Understanding | Can they apply the concept to real situations? |

---

### 6. Challenge Questions

OrvynAi can challenge statements made by the candidate.

For example:

**Candidate:**

> "Docker makes our application scalable."

**AI Interviewer:**

> "Docker provides containerization, but doesn't by itself guarantee scalability. What part of your architecture handles increased traffic?"

This helps test whether the candidate genuinely understands the technologies and projects listed on their resume.

---

## 📊 Interview Report

After the interview, OrvynAi generates a detailed visual report.

The report provides:

- Overall interview score
- Technical skill breakdown
- Strengths
- Weaknesses
- Job readiness
- Skill gaps
- Question-by-question evaluation
- Personalized recommendations
- Preparation roadmap

Example:

```text
Overall Score
     82 / 100

Technical Knowledge     86
Problem Solving        81
Communication          78
Project Understanding  91
System Design          62
Role Readiness         79
```

---

## 🎯 Personalized Learning

The interview does not end with the score.

OrvynAi identifies weak areas and converts them into an actionable preparation plan.

Example:

```text
Weak Areas

1. System Design
2. SQL Optimization
3. AWS Architecture
```

The candidate can then select:

**Practice My Weak Areas**

and receive another targeted interview.

This creates a continuous loop:

```text
Interview
    ↓
Diagnose
    ↓
Practice
    ↓
Retry
    ↓
Improve
```

---

## 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │     Candidate    │
                    └────────┬─────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │   React / Vite App    │
                 └───────────┬───────────┘
                             │
                         REST API
                             │
                             ▼
                 ┌───────────────────────┐
                 │   Node.js + Express   │
                 └───────┬───────┬───────┘
                         │       │
              ┌──────────┘       └──────────┐
              ▼                             ▼
      ┌───────────────┐             ┌───────────────┐
      │   MongoDB     │             │  Gemini / LLM │
      │   Database    │             │    Services   │
      └───────────────┘             └───────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- JavaScript
- Web Speech / browser media APIs where applicable

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- MongoDB
- MongoDB Atlas

### GenAI

- Google Gemini API
- LLM-based question generation
- LLM-based answer evaluation
- Resume and job-description analysis

### Authentication & Services

- JWT / existing authentication implementation
- Google OAuth where configured
- Resend for email/OTP functionality where configured

### Deployment

- Vercel — Frontend
- Railway — Backend
- MongoDB Atlas — Database

---

## 📁 Project Structure

```text
OrvynAi/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   └── package.json
│
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   ├── CURRENT_ARCHITECTURE.md
│   ├── PRODUCT_FLOW.md
│   ├── INTERVIEW_FLOW.md
│   ├── AI_EVALUATION.md
│   ├── REPORT_SYSTEM.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── TESTING.md
│   ├── DECISIONS.md
│   ├── TASKS.md
│   └── NEXT_LLM.md
│
├── assets/
│   └── orvynai-overview.png
│
├── README.md
└── .gitignore
```

> Adjust the structure above to match the actual repository. Do not document files that do not exist.

---

## ⚙️ Local Setup

### Prerequisites

Make sure you have:

- Node.js 18+
- npm
- MongoDB / MongoDB Atlas
- Gemini API key

### Clone

```bash
git clone https://github.com/YOUR_USERNAME/OrvynAi.git
cd OrvynAi
```

### Backend

```bash
cd backend
npm install
```

Create:

```text
.env
```

Add the environment variables required by the backend.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Use the actual variable names from the project.

### Frontend

```bash
cd ../frontend
npm install
```

Create:

```text
.env
```

Example:

```env
VITE_API_URL=http://localhost:5000
```

Again, use the actual variables required by the project.

### Run

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL displayed by Vite.

---

## 🔐 Environment Variables

**Never commit `.env` files or API keys to GitHub.**

Use `.env.example` files containing only variable names:

```env
PORT=
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
```

---

## 🧪 Testing Flow

A complete manual test should cover:

```text
[ ] Register / Login
[ ] Upload Resume
[ ] Enter Job Description
[ ] Analyze Candidate
[ ] Generate Interview
[ ] Start Interview
[ ] Answer Question
[ ] Verify AI Evaluation
[ ] Verify Adaptive Follow-up
[ ] Verify Project Deep Dive
[ ] Complete Interview
[ ] Open Final Report
[ ] Verify Skill Analysis
[ ] Verify Strengths & Weaknesses
[ ] Verify Job Readiness
[ ] Verify Recommendations
[ ] Practice Weak Areas
[ ] Retry Questions
```

---

## 🔮 Future Improvements

Potential future improvements include:

- More advanced multimodal interview analysis
- Better role-specific evaluation models
- Interview benchmarking
- Peer/company-specific interview simulations
- Coding interview environments
- System-design whiteboards
- More detailed learning paths
- Interview history and progress tracking
- Improved evaluation calibration
- Support for additional LLM providers

---

## 🏆 Hackathon Context

OrvynAi is built around the **Learning & Education** problem space.

The core idea is:

> **Interview preparation should not be about answering more questions. It should be about understanding exactly where you stand and what you need to improve.**

OrvynAi turns interview preparation into an adaptive learning loop:

```text
ASSESS
  ↓
DIAGNOSE
  ↓
PRA
