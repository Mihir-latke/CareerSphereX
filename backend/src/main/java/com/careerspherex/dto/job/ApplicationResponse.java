package com.careerspherex.dto.job;

import com.careerspherex.entity.JobApplication;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ApplicationResponse {
    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String location;
    private String jobType;
    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
    private String status;
    private String coverLetter;
    private String resumeUrl;
    private LocalDate appliedDate;
    private LocalDateTime createdAt;

    // Getters
    public Long getApplicationId() { return applicationId; }
    public Long getJobId() { return jobId; }
    public String getJobTitle() { return jobTitle; }
    public String getCompanyName() { return companyName; }
    public String getLocation() { return location; }
    public String getJobType() { return jobType; }
    public Long getApplicantId() { return applicantId; }
    public String getApplicantName() { return applicantName; }
    public String getApplicantEmail() { return applicantEmail; }
    public String getStatus() { return status; }
    public String getCoverLetter() { return coverLetter; }
    public String getResumeUrl() { return resumeUrl; }
    public LocalDate getAppliedDate() { return appliedDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public static ApplicationResponse fromEntity(JobApplication a) {
        ApplicationResponse r = new ApplicationResponse();
        r.applicationId = a.getApplicationId();
        r.jobId = a.getJob().getJobId();
        r.jobTitle = a.getJob().getJobTitle();
        r.companyName = a.getJob().getCompanyName();
        r.location = a.getJob().getLocation();
        r.jobType = a.getJob().getJobType() != null ? a.getJob().getJobType().name() : null;
        r.applicantId = a.getUser().getUserId();
        r.applicantName = a.getUser().getName();
        r.applicantEmail = a.getUser().getEmail();
        r.status = a.getStatus().name();
        r.coverLetter = a.getCoverLetter();
        r.resumeUrl = a.getResumeUrl();
        r.appliedDate = a.getAppliedDate();
        r.createdAt = a.getCreatedAt();
        return r;
    }
}
