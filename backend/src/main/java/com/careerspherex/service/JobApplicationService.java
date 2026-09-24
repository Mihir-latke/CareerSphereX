package com.careerspherex.service;

import com.careerspherex.dto.job.ApplicationResponse;
import com.careerspherex.entity.Job;
import com.careerspherex.entity.JobApplication;
import com.careerspherex.entity.User;
import com.careerspherex.exception.DuplicateResourceException;
import com.careerspherex.exception.ResourceNotFoundException;
import com.careerspherex.repository.JobApplicationRepository;
import com.careerspherex.repository.JobRepository;
import com.careerspherex.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository appRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    private static final Path UPLOAD_DIR = Paths.get("uploads", "resumes");

    @Transactional
    public ApplicationResponse apply(String applicantEmail, Long jobId,
                                     String coverLetter, MultipartFile resume) {
        User user = findUserOrThrow(applicantEmail);
        Job job   = findJobOrThrow(jobId);

        if (!job.isOpen()) throw new IllegalStateException("This job is no longer accepting applications");
        if (appRepository.existsByUserUserIdAndJobJobId(user.getUserId(), jobId)) {
            throw new DuplicateResourceException("You have already applied to this job");
        }

        String resumeUrl = null;
        if (resume != null && !resume.isEmpty()) {
            resumeUrl = saveFile(resume);
        }

        JobApplication app = new JobApplication();
        app.setUser(user);
        app.setJob(job);
        app.setCoverLetter(coverLetter);
        app.setResumeUrl(resumeUrl);
        app.setAppliedDate(LocalDate.now());
        return ApplicationResponse.fromEntity(appRepository.save(app));
    }

    public List<ApplicationResponse> getMyApplications(String applicantEmail) {
        User user = findUserOrThrow(applicantEmail);
        return appRepository.findByUserUserId(user.getUserId())
                .stream().map(ApplicationResponse::fromEntity).toList();
    }

    public List<ApplicationResponse> getApplicantsForJob(String recruiterEmail, Long jobId) {
        User recruiter = findUserOrThrow(recruiterEmail);
        Job job = findJobOrThrow(jobId);
        if (job.getPoster() == null || !job.getPoster().getUserId().equals(recruiter.getUserId())) {
            throw new AccessDeniedException("You don't own this job listing");
        }
        return appRepository.findByJobJobId(jobId)
                .stream().map(ApplicationResponse::fromEntity).toList();
    }

    @Transactional
    public ApplicationResponse updateStatus(String recruiterEmail, Long applicationId, String status) {
        User recruiter = findUserOrThrow(recruiterEmail);
        JobApplication app = appRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        if (app.getJob().getPoster() == null || !app.getJob().getPoster().getUserId().equals(recruiter.getUserId())) {
            throw new AccessDeniedException("You don't own the job for this application");
        }
        app.setStatus(JobApplication.Status.valueOf(status.toUpperCase()));
        return ApplicationResponse.fromEntity(appRepository.save(app));
    }

    private String saveFile(MultipartFile file) {
        try {
            Files.createDirectories(UPLOAD_DIR);
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path dest = UPLOAD_DIR.resolve(filename);
            Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
            return "/api/resumes/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store resume file", e);
        }
    }

    private Job findJobOrThrow(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
    }

    private User findUserOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
