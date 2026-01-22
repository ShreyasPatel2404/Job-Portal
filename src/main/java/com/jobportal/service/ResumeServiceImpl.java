
package com.jobportal.service;

import com.jobportal.exception.JobPortalException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.jobportal.entity.Resume;
import com.jobportal.entity.User;
import com.jobportal.repository.ResumeRepository;

@Service
public class ResumeServiceImpl implements ResumeService {
	
	private static final Logger log = LoggerFactory.getLogger(ResumeServiceImpl.class);
	
	@Autowired
	private ResumeRepository resumeRepository;
	
	@Value("${app.upload.directory:uploads/resumes}")
	private String uploadDirectory;

	@Override
	public Resume uploadResume(MultipartFile file, String filename, Boolean isDefault, User user) {
		try {
			// Create upload directory if it doesn't exist
			Path uploadPath = Paths.get(uploadDirectory);
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}
			
			// Save file to disk
			Path filePath = uploadPath.resolve(filename);
			Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
			
			// Create resume entity
			Resume resume = new Resume();
			resume.setUserId(user);
			resume.setFileName(file.getOriginalFilename());
			resume.setFileUrl(filePath.toString());
			resume.setFileSize(file.getSize());
			resume.setFileType(getFileExtension(file.getOriginalFilename()));
			resume.setUploadedAt(LocalDateTime.now());
			
			// If this is the first resume, set as default
			if (resumeRepository.countByUserId(user) == 0) {
				resume.setIsDefault(true);
			} else if (isDefault != null && isDefault) {
				// If setting as default, unset others
				resumeRepository.findByUserId(user).forEach(r -> {
					if (r.getIsDefault()) {
						r.setIsDefault(false);
						resumeRepository.save(r);
					}
				});
				resume.setIsDefault(true);
			} else {
				resume.setIsDefault(false);
			}
			
			Resume saved = resumeRepository.save(resume);
			log.info("Resume uploaded successfully for user: {} - File: {}", user.getEmail(), filename);
			return saved;
			
		} catch (IOException e) {
			log.error("Failed to upload resume for user: {} - Error: {}", user.getEmail(), e.getMessage());
			throw new JobPortalException("Failed to upload resume: " + e.getMessage());
		}
	}

	@Override
	public Resume getResumeById(String resumeId, User user) {
		Resume resume = resumeRepository.findByIdAndUserId(resumeId, user)
				   .orElseThrow(() -> new JobPortalException("Resume not found"));
		return resume;
	}

	@Override
	public List<Resume> getResumesByUser(User user) {
		return resumeRepository.findByUserId(user);
	}

	@Override
	public Resume setAsDefault(String resumeId, User user) {
		Resume resume = resumeRepository.findByIdAndUserId(resumeId, user)
				   .orElseThrow(() -> new JobPortalException("Resume not found"));
		
		// Unset all other defaults
		resumeRepository.findByUserId(user).forEach(r -> {
			if (r.getIsDefault() && !r.getId().equals(resumeId)) {
				r.setIsDefault(false);
				resumeRepository.save(r);
			}
		});
		
		resume.setIsDefault(true);
		Resume saved = resumeRepository.save(resume);
		log.info("Resume set as default for user: {} - Resume ID: {}", user.getEmail(), resumeId);
		return saved;
	}

	@Override
	public Resume getDefaultResume(User user) {
		return resumeRepository.findByUserIdAndIsDefaultTrue(user)
				   .orElseThrow(() -> new JobPortalException("No default resume found"));
	}

	@Override
	public void deleteResume(String resumeId, User user) {
		Resume resume = resumeRepository.findByIdAndUserId(resumeId, user)
				   .orElseThrow(() -> new JobPortalException("Resume not found"));
		
		// Delete file from disk
		try {
			Path filePath = Paths.get(resume.getFileUrl());
			Files.deleteIfExists(filePath);
		} catch (IOException e) {
			log.warn("Failed to delete resume file from disk: {}", e.getMessage());
		}
		
		// If deleting default resume, set another as default
		if (resume.getIsDefault()) {
			List<Resume> otherResumes = resumeRepository.findByUserId(user);
			otherResumes.remove(resume);
			if (!otherResumes.isEmpty()) {
				otherResumes.get(0).setIsDefault(true);
				resumeRepository.save(otherResumes.get(0));
			}
		}
		
		resumeRepository.delete(resume);
		log.info("Resume deleted for user: {} - Resume ID: {}", user.getEmail(), resumeId);
	}
	
	private String getFileExtension(String filename) {
		if (filename == null || !filename.contains(".")) {
			return "";
		}
		return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
	}
}
