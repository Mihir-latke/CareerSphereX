package com.careerspherex.controller;

import com.careerspherex.dto.job.JobRequest;
import com.careerspherex.dto.job.JobResponse;
import com.careerspherex.service.JobService;
import com.careerspherex.service.SavedJobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final SavedJobService savedJobService;

    // ---- Public browsing ----

    @GetMapping
    public List<JobResponse> listJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type) {
        return jobService.searchJobs(search, location, type);
    }

    @GetMapping("/{id}")
    public JobResponse getJob(@PathVariable Long id) {
        return jobService.getById(id);
    }

    // ---- Recruiter — own listings ----

    @GetMapping("/my")
    public List<JobResponse> myJobs(Authentication auth) {
        return jobService.getMyJobs(auth.getName());
    }

    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            Authentication auth, @Valid @RequestBody JobRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(jobService.createJob(auth.getName(), req));
    }

    @PutMapping("/{id}")
    public JobResponse updateJob(
            Authentication auth, @PathVariable Long id,
            @Valid @RequestBody JobRequest req) {
        return jobService.updateJob(auth.getName(), id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(Authentication auth, @PathVariable Long id) {
        jobService.deleteJob(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }

    // ---- Save / unsave (authenticated users) ----

    @PostMapping("/{id}/save")
    public Map<String, Object> toggleSave(Authentication auth, @PathVariable Long id) {
        return savedJobService.toggleSave(auth.getName(), id);
    }

    @GetMapping("/saved")
    public List<JobResponse> savedJobs(Authentication auth) {
        return savedJobService.getSavedJobs(auth.getName());
    }

    @GetMapping("/{id}/saved")
    public Map<String, Boolean> isSaved(Authentication auth, @PathVariable Long id) {
        return Map.of("saved", savedJobService.isSaved(auth.getName(), id));
    }
}
