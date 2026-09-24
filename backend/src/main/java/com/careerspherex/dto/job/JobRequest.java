package com.careerspherex.dto.job;

import java.math.BigDecimal;

import com.careerspherex.entity.Job;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class JobRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    private String description;
    private String requirements;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Job type is required")
    private Job.JobType jobType;

    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String experienceRequired;
    private boolean open = true;

    // Getters
    public String getCompanyName() { return companyName; }
    public String getJobTitle() { return jobTitle; }
    public String getDescription() { return description; }
    public String getRequirements() { return requirements; }
    public String getLocation() { return location; }
    public Job.JobType getJobType() { return jobType; }
    public BigDecimal getSalaryMin() { return salaryMin; }
    public BigDecimal getSalaryMax() { return salaryMax; }
    public String getExperienceRequired() { return experienceRequired; }
    public boolean isOpen() { return open; }

    // Setters (needed for Jackson deserialization)
    public void setCompanyName(String v) { companyName = v; }
    public void setJobTitle(String v) { jobTitle = v; }
    public void setDescription(String v) { description = v; }
    public void setRequirements(String v) { requirements = v; }
    public void setLocation(String v) { location = v; }
    public void setJobType(Job.JobType v) { jobType = v; }
    public void setSalaryMin(BigDecimal v) { salaryMin = v; }
    public void setSalaryMax(BigDecimal v) { salaryMax = v; }
    public void setExperienceRequired(String v) { experienceRequired = v; }
    public void setOpen(boolean v) { open = v; }
}
