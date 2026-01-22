package com.jobportal.config;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.jobportal.dto.AccountType;
import com.jobportal.entity.Application;
import com.jobportal.entity.Company;
import com.jobportal.entity.Job;
import com.jobportal.entity.Notification;
import com.jobportal.entity.Resume;
import com.jobportal.entity.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.NotificationRepository;
import com.jobportal.repository.ResumeRepository;
import com.jobportal.repository.UserRepository;

@Configuration
@Profile("!test") // Run in all profiles except test
public class DataSeeder {

	private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CompanyRepository companyRepository;

	@Autowired
	private JobRepository jobRepository;

	@Autowired
	private ApplicationRepository applicationRepository;
	
	@Autowired
	private ResumeRepository resumeRepository;
	
	@Autowired
	private NotificationRepository notificationRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Bean
	public CommandLineRunner seedData() {
		return args -> {
			if (userRepository.count() > 0) {
				log.info("Database already seeded. Skipping data generation.");
				return;
			}

			log.info("Starting data seeding...");

			// 1. Create Users
			User admin = createUser("Admin User", "admin@jobportal.com", "Admin@123", AccountType.ADMIN);
			
			User empGoogle = createUser("Sarah Recruiter", "sarah.recruiter@google.com", "Employer@123", AccountType.EMPLOYER);
			User empStartup = createUser("Mike Founder", "mike@startuphub.io", "Employer@123", AccountType.EMPLOYER);
			
			User seekerJohn = createUser("John Java", "john.doe@example.com", "Seeker@123", AccountType.APPLICANT);
			// John's Profile
			seekerJohn.setBio("Passionate Java Backend Developer with 5 years of experience in Spring Boot and Microservices.");
			seekerJohn.setSkills(Arrays.asList("Java", "Spring Boot", "Microservices", "MongoDB", "AWS"));
			seekerJohn.setLocation("New York, NY");
			seekerJohn.setPhone("+1-555-0101");
			seekerJohn.setExperience(Arrays.asList(
					new User.Experience("Tech Corp", "Senior Java Developer", LocalDateTime.now().minusYears(2), null, true, "Leading backend team"),
					new User.Experience("Legacy Sys", "Junior Developer", LocalDateTime.now().minusYears(5), LocalDateTime.now().minusYears(2), false, "Maintained legacy apps")
			));
			seekerJohn.setEducation(Arrays.asList(
					new User.Education("MIT", "B.S.", "Computer Science", LocalDateTime.now().minusYears(6), LocalDateTime.now().minusYears(5), false)
			));
			userRepository.save(seekerJohn);

			User seekerJane = createUser("Jane Frontend", "jane.smith@example.com", "Seeker@123", AccountType.APPLICANT);
			seekerJane.setBio("Creative Frontend Engineer specializing in React and ensuring pixel-perfect UI.");
			seekerJane.setSkills(Arrays.asList("React", "TypeScript", "Redux", "Tailwind CSS", "Figma"));
			seekerJane.setLocation("San Francisco, CA");
			userRepository.save(seekerJane);
			
			log.info("Users created: Admin, Employers (Google, Startup), Seekers (John, Jane)");

			// 2. Create Companies
			Company google = createCompany(empGoogle, "Google", "Leading technology company specializing in search engine, cloud computing, and consumer electronics.", "https://google.com", "Technology", "100,000+", "Mountain View, CA");
			Company startupHub = createCompany(empStartup, "StartupHub", "Innovative startup incubator and software solution provider.", "https://startuphub.io", "Software", "11-50", "Austin, TX");
			
			log.info("Companies created: Google, StartupHub");

			// 3. Create Jobs
			Job jobJavaLead = createJob(empGoogle, "Senior Java Backend Engineer", google, 
					"We are looking for an experienced Java Engineer to join our Cloud team.",
					"Remote", "full-time", "senior", 150000.0, 220000.0, "Active");
			jobJavaLead.setRequirements(Arrays.asList("5+ years Java experience", "Deep understanding of Spring Boot", "Experience with Distributed Systems"));
			jobJavaLead.setResponsibilities(Arrays.asList("Design and implement scalable microservices", "Mentor junior developers", "Participate in code reviews"));
			jobJavaLead.setSkills(Arrays.asList("Java", "Spring Boot", "System Design", "Kubernetes"));
			jobRepository.save(jobJavaLead);
			
			Job jobReactDev = createJob(empStartup, "Frontend React Developer", startupHub,
					"Join our fast-paced startup to build the next gen UI.",
					"Austin, TX", "full-time", "mid", 90000.0, 130000.0, "Active");
			jobReactDev.setSkills(Arrays.asList("React", "TypeScript", "CSS"));
			jobRepository.save(jobReactDev);
			
			Job jobIntern = createJob(empGoogle, "Software Engineering Intern", google,
					"Summer internship for CS students.",
					"New York, NY", "internship", "entry", 5000.0, 8000.0, "Active");
			jobIntern.setSalaryCurrency("USD/Month");
			jobRepository.save(jobIntern);

			log.info("Jobs created: Java Lead, React Dev, Intern");

			// 4. Create Applications
			// John applies to Java Lead
			createApplication(jobJavaLead, seekerJohn, "pending", 85.0);
			
			// Jane applies to React Dev
			createApplication(jobReactDev, seekerJane, "shortlisted", 92.0);
			// Jane applies to Intern (maybe mistakenly or just trying)
			createApplication(jobIntern, seekerJane, "rejected", 40.0);

			log.info("Applications created for John and Jane");
			
			// 5. Create Resumes
			createResume(seekerJohn, "John_Doe_Java_CV.pdf", true);
			createResume(seekerJane, "Jane_Smith_Resume.pdf", true);
			
			log.info("Resumes created");
			
			// 6. Create Notifications
			createNotification(seekerJane, "Your application for Frontend React Developer at StartupHub has been shortlisted!", "application_update");
			createNotification(seekerJohn, "Application received for Senior Java Backend Engineer.", "application_received");
			
			log.info("Data seeding completed successfully!");
		};
	}

	private User createUser(String name, String email, String password, AccountType type) {
		User user = new User();
		user.setName(name);
		user.setEmail(email);
		user.setPassword(passwordEncoder.encode(password));
		user.setAccountType(type);
		user.setIsActive(true);
		user.setIsEmailVerified(true);
		user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusDays(1)); // Valid token
		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());
		return userRepository.save(user);
	}

	private Company createCompany(User recruiter, String name, String desc, String website, String industry, String size, String location) {
		Company company = new Company();
		company.setRecruiterId(recruiter);
		company.setCompanyName(name);
		company.setDescription(desc);
		company.setWebsite(website);
		company.setIndustry(industry);
		company.setCompanySize(size);
		company.setLocation(location);
		company.setCreatedAt(LocalDateTime.now());
		company.setUpdatedAt(LocalDateTime.now());
		return companyRepository.save(company);
	}

	private Job createJob(User recruiter, String title, Company company, String description, String location, String type, String level, Double min, Double max, String status) {
		Job job = new Job();
		job.setTitle(title);
		job.setPostedBy(recruiter);
		job.setCompany(company.getCompanyName());
		job.setDescription(description);
		job.setLocation(location);
		job.setJobType(type);
		job.setExperienceLevel(level);
		job.setSalaryMin(min);
		job.setSalaryMax(max);
		job.setStatus(status.toLowerCase()); // active
		job.setIsFeatured(status.equalsIgnoreCase("Active"));
		job.setCreatedAt(LocalDateTime.now());
		job.setApplicationDeadline(LocalDateTime.now().plusMonths(1));
		job.setCategory("Software Engineering");
		job.setIndustry(company.getIndustry());
		return jobRepository.save(job);
	}

	private Application createApplication(Job job, User applicant, String status, Double matchScore) {
		Application app = new Application();
		app.setJobId(job);
		app.setApplicantId(applicant);
		app.setStatus(status);
		app.setMatchScore(matchScore);
		app.setAppliedAt(LocalDateTime.now());
		app.setResumeUrl("http://localhost:8080/uploads/resumes/dummy.pdf"); 
		app.setCoverLetter("I am very interested in this role and believe my skills match perfectly.");
		
		if (status.equals("shortlisted")) {
			app.setReviewedAt(LocalDateTime.now());
			app.setInterviewDate(LocalDateTime.now().plusDays(5));
		}
		if (status.equals("rejected")) {
			app.setReviewedAt(LocalDateTime.now());
			app.setRejectionReason("Not enough experience in X.");
		}
		
		return applicationRepository.save(app);
	}
	
	private Resume createResume(User user, String filename, boolean isDefault) {
		Resume resume = new Resume();
		resume.setUserId(user);
		resume.setFileName(filename);
		resume.setFileUrl("uploads/resumes/" + filename);
		resume.setFileSize(1024L * 500); // 500KB
		resume.setFileType("application/pdf");
		resume.setIsDefault(isDefault);
		resume.setUploadedAt(LocalDateTime.now());
		
		// Add parsed data
		Resume.ParsedData parsed = new Resume.ParsedData();
		if (filename.contains("Java")) {
			parsed.setSkills(Arrays.asList("Java", "Spring Boot", "Microservices", "SQL"));
			parsed.setExperience(5);
			parsed.setEducation(Arrays.asList("BS Computer Science"));
			parsed.setCertifications(Arrays.asList("AWS Certified Developer"));
		} else {
			parsed.setSkills(Arrays.asList("React", "TypeScript", "CSS", "Figma"));
			parsed.setExperience(3);
			parsed.setEducation(Arrays.asList("BS Software Engineering"));
			parsed.setCertifications(Arrays.asList("Meta Frontend Developer"));
		}
		resume.setParsedData(parsed);
		
		return resumeRepository.save(resume);
	}
	
	private Notification createNotification(User user, String message, String type) {
		Notification notif = new Notification();
		notif.setUserId(user);
		notif.setMessage(message);
		notif.setType(type);
		notif.setRead(false);
		notif.setCreatedAt(LocalDateTime.now());
		return notificationRepository.save(notif);
	}
}
