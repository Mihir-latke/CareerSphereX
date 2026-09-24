package com.careerspherex.repository;

import com.careerspherex.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

    List<SavedJob> findByUserUserId(Long userId);

    Optional<SavedJob> findByUserUserIdAndJobJobId(Long userId, Long jobId);

    boolean existsByUserUserIdAndJobJobId(Long userId, Long jobId);

    void deleteByUserUserIdAndJobJobId(Long userId, Long jobId);
}
