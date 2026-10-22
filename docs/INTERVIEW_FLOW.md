# Adaptive Interview Flow

## Dynamics
Instead of asking a pre-generated static list of questions sequentially:
1. An initial question is selected from the planned categories (Fundamentals, Project Deep Dive, Role Skills, Problem Solving).
2. The candidate records their answer verbally or provides text.
3. The server processes the answer through Gemini, evaluating:
   - Correctness & completeness
   - Technical depth & reasoning
   - Recognition of trade-offs vs shallow buzzwords
4. Based on the evaluation:
   - **Shallow / Hand-waving Answer**: Triggers **Challenge Mode** to probe unverified claims (e.g. "You mentioned Docker scales this. Which component handles traffic spikes?").
   - **Strong Answer**: Increases difficulty tier (`Beginner` -> `Intermediate` -> `Advanced` -> `Expert`).
   - **Struggling Answer**: Scales back difficulty, testing fundamentals.
   - **Project Mentions**: Launches a targeted project architecture deep-dive.
5. Next question is selected dynamically using full context of the candidate's prior responses.
