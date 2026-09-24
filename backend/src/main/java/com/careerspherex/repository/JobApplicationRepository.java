package com.careerspherex.repository;

import com.careerspherex.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByUserUserId(Long userId);

    List<JobApplication> findByJobJobId(Long jobId);

    boolean existsByUserUserIdAndJobJobId(Long userId, Long jobId);

    Optional<JobApplication> findByUserUserIdAndJobJobId(Long userId, Long jobId);
}
