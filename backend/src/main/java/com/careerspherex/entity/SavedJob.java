package com.careerspherex.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_jobs",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "job_id"}))
public class SavedJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "saved_job_id")
    private Long savedJobId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "saved_at", updatable = false, insertable = false)
    private LocalDateTime savedAt;

    // Getters
    public Long getSavedJobId() { return savedJobId; }
    public User getUser() { return user; }
    public Job getJob() { return job; }
    public LocalDateTime getSavedAt() { return savedAt; }

    // Setters
    public void setSavedJobId(Long v) { savedJobId = v; }
    public void setUser(User v) { user = v; }
    public void setJob(Job v) { job = v; }
}
