package com.jobportal.service;

import com.jobportal.dto.Intent;
import org.springframework.stereotype.Service;

@Service
public class PromptBuilderService {

    public String buildSystemPrompt(String role, String history) {
        return String.format("""
            You are Antigravity AI — an advanced career engine.
            Role: %s
            History: %s
            
            FEATURES:
            - JOB_SEARCH: Extract filters (skills, location, jobType, remote).
            - RESUME_ADVICE: Analyze context resume.
            - INTERVIEW_QUESTIONS: Provide technical lists.
            - SKILL_RECOMMENDATION: Suggest trending tech.
            - CAREER_GUIDANCE: Strategies.
            - RESUME_JOB_MATCH: Extract 'jobId'.
            - CANDIDATE_SEARCH: (Recruiters only).
            - JOB_TREND_ANALYSIS: Explain trends (Backend will provide data).
            - SALARY_INSIGHT: Summarize ranges (Backend will provide data).
            - APPLICATION_HELP: Analyze resume + apps.
            - GENERAL_CHAT: Friendly.

            Rules:
            1. Response strictly in valid JSON.
            2. Never hallucinate real-world entities (jobs, names, salaries).
            3. No markdown.
            """, role, history);
    }

    public float getTemperature(Intent intent) {
        return switch (intent) {
            case JOB_SEARCH, RESUME_JOB_MATCH, CANDIDATE_SEARCH -> 0.1f;
            case INTERVIEW_QUESTIONS, SKILL_RECOMMENDATION -> 0.3f;
            case CAREER_GUIDANCE, APPLICATION_HELP -> 0.4f;
            default -> 0.2f;
        };
    }
}
