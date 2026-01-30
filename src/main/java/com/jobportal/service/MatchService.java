package com.jobportal.service;

import com.jobportal.entity.Job;
import com.jobportal.entity.Resume;
import com.jobportal.entity.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.ResumeRepository;
import com.jobportal.util.CosineSimilarityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class MatchService {

    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;

    public List<Map<String, Object>> matchJobs(String resumeId, User user) {
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, user)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (resume.getEmbedding() == null || resume.getEmbedding().isEmpty()) {
            throw new RuntimeException("Resume has no embedding. Try uploading again.");
        }

        List<Job> activeJobs = jobRepository.findByStatus("active");

        return activeJobs.stream()
                .filter(job -> job.getEmbedding() != null && !job.getEmbedding().isEmpty())
                .map(job -> {
                    double similarity = CosineSimilarityUtil.calculate(resume.getEmbedding(), job.getEmbedding());
                    double score = Math.round(similarity * 10000.0) / 100.0;
                    
                    return Map.of(
                            "jobId", job.getId(),
                            "title", job.getTitle(),
                            "company", job.getCompany(),
                            "location", job.getLocation(),
                            "matchScore", score
                    );
                })
                .sorted((a, b) -> Double.compare((double) b.get("matchScore"), (double) a.get("matchScore")))
                .limit(10)
                .collect(Collectors.toList());
    }
}
