package com.careerspherex.controller;

import com.careerspherex.dto.job.ApplicationResponse;
import com.careerspherex.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService appService;

    /** Candidate: apply for a job (multipart — supports resume upload) */
    @PostMapping(value = "/api/jobs/{jobId}/apply",
                 consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApplicationResponse> apply(
            Authentication auth,
            @PathVariable Long jobId,
            @RequestParam(required = false) String coverLetter,
            @RequestParam(required = false) MultipartFile resume) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(appService.apply(auth.getName(), jobId, coverLetter, resume));
    }

    /** Candidate: my applications */
    @GetMapping("/api/applications/my")
    public List<ApplicationResponse> myApplications(Authentication auth) {
        return appService.getMyApplications(auth.getName());
    }

    /** Recruiter: applicants for one of their jobs */
    @GetMapping("/api/jobs/{jobId}/applicants")
    public List<ApplicationResponse> applicants(
            Authentication auth, @PathVariable Long jobId) {
        return appService.getApplicantsForJob(auth.getName(), jobId);
    }

    /** Recruiter: update application status */
    @PatchMapping("/api/applications/{id}/status")
    public ApplicationResponse updateStatus(
            Authentication auth,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return appService.updateStatus(auth.getName(), id, body.get("status"));
    }
}
