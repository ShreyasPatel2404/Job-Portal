package com.jobportal.service;

import com.jobportal.entity.Application;
import com.jobportal.entity.Resume;
import com.jobportal.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class ApplicationHelpService {

    private final ApplicationRepository applicationRepository;

    public Map<String, Object> getApplicationIntelligence(String userId, Resume resume) {
        List<Application> applications = applicationRepository.findByApplicantIdOrderByAppliedAtDesc(new com.jobportal.entity.User() {{ setId(userId); }});
        
        long total = applications.size();
        long rejected = applications.stream().filter(a -> "rejected".equals(a.getStatus())).count();
        long pending = applications.stream().filter(a -> "pending".equals(a.getStatus())).count();
        long interview = applications.stream().filter(a -> "hired".equals(a.getStatus()) || "shortlisted".equals(a.getStatus())).count();

        Map<String, Object> intel = new HashMap<>();
        intel.put("totalApplications", total);
        intel.put("rejectionRate", total > 0 ? (rejected * 100 / total) : 0);
        intel.put("conversionRate", total > 0 ? (interview * 100 / total) : 0);
        intel.put("pendingReview", pending);
        intel.put("resumeQualityScore", resume != null && resume.getParsedData() != null ? 85 : 40); // Heuristic
        
        return intel;
    }
}
