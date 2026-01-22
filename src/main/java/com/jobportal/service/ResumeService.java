package com.jobportal.service;

import java.util.List;

import com.jobportal.entity.Resume;
import com.jobportal.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeService {
	Resume uploadResume(org.springframework.web.multipart.MultipartFile file, String filename, Boolean isDefault, User user);
	Resume getResumeById(String resumeId, User user);
	List<Resume> getResumesByUser(User user);
	Resume setAsDefault(String resumeId, User user);
	Resume getDefaultResume(User user);
	void deleteResume(String resumeId, User user);


}
