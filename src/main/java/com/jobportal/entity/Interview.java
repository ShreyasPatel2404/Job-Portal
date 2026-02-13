package com.jobportal.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "interviews")
public class Interview {
	
	@Id
	private String id;
	
	@DBRef
	private User recruiter;
	
	@DBRef
	private User candidate;
	
	private String jobTitle;
	
	private LocalDateTime scheduledTime;
	
	private String type; // Video, On-site, Phone
	
	private String status; // Scheduled, Completed, Cancelled
	
	private String meetingLink;
	
	private String notes;
}
