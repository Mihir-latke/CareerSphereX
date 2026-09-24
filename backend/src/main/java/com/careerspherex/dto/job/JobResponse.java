package com.careerspherex.dto.job;

import com.careerspherex.entity.Job;

import java.math.BigDecimal;
import java.time.LocalDate;

public class JobResponse {
    private Long jobId;
    private Long posterId;
    private String posterName;
    private String companyName;
    private String jobTitle;
    private String description;
    private String requirements;
    private String location;
    private String jobType;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String experienceRequired;
    private boolean open;
    private LocalDate postedDate;

    // Getters
    public Long getJobId() { return jobId; }
    public Long getPosterId() { return posterId; }
    public String getPosterName() { return posterName; }
    public String getCompanyName() { return companyName; }
    public String getJobTitle() { return jobTitle; }
    public String getDescription() { return description; }
    public String getRequirements() { return requirements; }
    public String getLocation() { return location; }
    public String getJobType() { return jobType; }
    public BigDecimal getSalaryMin() { return salaryMin; }
    public BigDecimal getSalaryMax() { return salaryMax; }
    public String getExperienceRequired() { return experienceRequired; }
    public boolean isOpen() { return open; }
    public LocalDate getPostedDate() { return postedDate; }

    public static JobResponse fromEntity(Job j) {
        JobResponse r = new JobResponse();
        r.jobId = j.getJobId();
        r.posterId = j.getPoster() != null ? j.getPoster().getUserId() : null;
        r.posterName = j.getPoster() != null ? j.getPoster().getName() : null;
        r.companyName = j.getCompanyName();
        r.jobTitle = j.getJobTitle();
        r.description = j.getDescription();
        r.requirements = j.getRequirements();
        r.location = j.getLocation();
        r.jobType = j.getJobType() != null ? j.getJobType().name() : null;
        r.salaryMin = j.getSalaryMin();
        r.salaryMax = j.getSalaryMax();
        r.experienceRequired = j.getExperienceRequired();
        r.open = j.isOpen();
        r.postedDate = j.getPostedDate();
        return r;
    }
}
