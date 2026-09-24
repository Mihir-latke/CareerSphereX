package com.careerspherex.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "job_id"}))
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.APPLIED;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Column(name = "applied_date", nullable = false)
    private LocalDate appliedDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    public enum Status { APPLIED, REVIEWING, SHORTLISTED, INTERVIEW, REJECTED, HIRED }

    // Getters
    public Long getApplicationId() { return applicationId; }
    public User getUser() { return user; }
    public Job getJob() { return job; }
    public Status getStatus() { return status; }
    public String getCoverLetter() { return coverLetter; }
    public String getResumeUrl() { return resumeUrl; }
    public LocalDate getAppliedDate() { return appliedDate; }
    public String getNotes() { return notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setApplicationId(Long v) { applicationId = v; }
    public void setUser(User v) { user = v; }
    public void setJob(Job v) { job = v; }
    public void setStatus(Status v) { status = v; }
    public void setCoverLetter(String v) { coverLetter = v; }
    public void setResumeUrl(String v) { resumeUrl = v; }
    public void setAppliedDate(LocalDate v) { appliedDate = v; }
    public void setNotes(String v) { notes = v; }
}
