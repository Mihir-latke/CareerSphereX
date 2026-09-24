package com.careerspherex.repository;

import com.careerspherex.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByPosterUserId(Long posterId);

    @Query("""
        SELECT j FROM Job j
        WHERE j.open = true
          AND (:search IS NULL OR LOWER(j.jobTitle) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(j.companyName) LIKE LOWER(CONCAT('%', :search, '%')))
          AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
          AND (:type IS NULL OR j.jobType = :type)
        ORDER BY j.postedDate DESC
        """)
    List<Job> searchJobs(
            @Param("search")   String search,
            @Param("location") String location,
            @Param("type")     Job.JobType type
    );
}
