package com.jobportal.service;

import java.util.List;

import com.jobportal.entity.Interview;
import com.jobportal.entity.User;

public interface InterviewService {
	
	Interview scheduleInterview(Interview interview, String recruiterEmail, String candidateEmail);
	List<Interview> getInterviewsByRecruiter(User recruiter);
	List<Interview> getInterviewsByCandidate(User candidate);
	Interview updateStatus(String id, String status, User user);
	void cancelInterview(String id, User user);
}
