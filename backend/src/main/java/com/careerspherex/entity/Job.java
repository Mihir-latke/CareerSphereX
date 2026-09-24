package com.careerspherex.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Long jobId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poster_id")
    private User poster;

    @Column(name = "company_name", length = 150, nullable = false)
    private String companyName;

    @Column(name = "job_title", length = 150, nullable = false)
    private String jobTitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(length = 150)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type")
    private JobType jobType = JobType.FULL_TIME;

    @Column(name = "salary_min", precision = 12, scale = 2)
    private BigDecimal salaryMin;

    @Column(name = "salary_max", precision = 12, scale = 2)
    private BigDecimal salaryMax;

    @Column(name = "experience_required", length = 100)
    private String experienceRequired;

    @Column(name = "is_open", nullable = false)
    private boolean open = true;

    @Column(name = "posted_date")
    private LocalDate postedDate;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    public enum JobType { FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT, REMOTE }

    // Getters
    public Long getJobId() { return jobId; }
    public User getPoster() { return poster; }
    public String getCompanyName() { return companyName; }
    public String getJobTitle() { return jobTitle; }
    public String getDescription() { return description; }
    public String getRequirements() { return requirements; }
    public String getLocation() { return location; }
    public JobType getJobType() { return jobType; }
    public BigDecimal getSalaryMin() { return salaryMin; }
    public BigDecimal getSalaryMax() { return salaryMax; }
    public String getExperienceRequired() { return experienceRequired; }
    public boolean isOpen() { return open; }
    public LocalDate getPostedDate() { return postedDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setJobId(Long v) { jobId = v; }
    public void setPoster(User v) { poster = v; }
    public void setCompanyName(String v) { companyName = v; }
    public void setJobTitle(String v) { jobTitle = v; }
    public void setDescription(String v) { description = v; }
    public void setRequirements(String v) { requirements = v; }
    public void setLocation(String v) { location = v; }
    public void setJobType(JobType v) { jobType = v; }
    public void setSalaryMin(BigDecimal v) { salaryMin = v; }
    public void setSalaryMax(BigDecimal v) { salaryMax = v; }
    public void setExperienceRequired(String v) { experienceRequired = v; }
    public void setOpen(boolean v) { open = v; }
    public void setPostedDate(LocalDate v) { postedDate = v; }
}
