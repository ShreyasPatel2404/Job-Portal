---
description: Testing the AI Job Portal Chatbot features
---

To verify all 5 AI features, follow these steps:

### 1. Preparation
- Ensure the backend is running and the database is seeded.
- Use the credentials provided in the walkthrough (e.g., `john.doe@example.com` / `Seeker@123`).
- Open the application and click the **Antigravity AI** floating icon in the bottom-right.

### 2. Feature Workflows

#### Feature 1: Natural Language Job Search
// turbo
1. Type: "Remote Java jobs"
2. Expected: The AI should detect `JOB_SEARCH` intent, query the DB, and display "Senior Java Backend Engineer" at Google.

#### Feature 2: Resume Improvement Advice
// turbo
1. Type: "Review my resume and suggest 3 improvements."
2. Expected: The AI should fetch your (John's) Java resume from Mongo and provide specific feedback on Spring Boot or AWS skills.

#### Feature 3: Interview Question Generation
// turbo
1. Type: "Generate 5 interview questions for a Lead Java Developer role."
2. Expected: The AI should return a structured list of technical and managerial questions.

#### Feature 4: Skill Recommendation
// turbo
1. Type: "What skills should I learn to transition into AI and Machine Learning?"
2. Expected: The AI should suggest skills like Python, TensorFlow, PyTorch, and Data Engineering.

#### Feature 5: Career Guidance
// turbo
1. Type: "I have 5 years of experience in Java. What should be my next strategic career move?"
2. Expected: The AI should provide strategic advice about Senior Level roles, Architecture, or Management paths.

### 3. Verification
- Verify that each response has the correct icon (Briefcase, File, etc.).
- Verify that token usage and intents are logged in the `chat_logs` collection in MongoDB.
