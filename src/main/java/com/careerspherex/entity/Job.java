package com.careerspherex.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Long jobId;

    @Column(name = "company_name", length = 150, nullable = false)
    private String companyName;

    @Column(name = "job_title", length = 150, nullable = false)
    private String jobTitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 150)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type")
    @Builder.Default
    private JobType jobType = JobType.FULL_TIME;

    @Column(precision = 12, scale = 2)
    private BigDecimal salary;

    @Column(name = "experience_required", length = 100)
    private String experienceRequired;

    @Column(name = "posted_date", nullable = false)
    private LocalDate postedDate;

    @Column(name = "application_url", length = 500)
    private String applicationUrl;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    public enum JobType { FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT, REMOTE }
}
