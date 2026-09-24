package com.careerspherex.service;

import com.careerspherex.dto.job.JobRequest;
import com.careerspherex.dto.job.JobResponse;
import com.careerspherex.entity.Job;
import com.careerspherex.entity.User;
import com.careerspherex.exception.ResourceNotFoundException;
import com.careerspherex.repository.JobRepository;
import com.careerspherex.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public List<JobResponse> searchJobs(String search, String location, String type) {
        Job.JobType jobType = null;
        if (type != null && !type.isBlank()) {
            try { jobType = Job.JobType.valueOf(type.toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }
        String s = (search   != null && !search.isBlank())   ? search   : null;
        String l = (location != null && !location.isBlank()) ? location : null;
        return jobRepository.searchJobs(s, l, jobType)
                .stream().map(JobResponse::fromEntity).toList();
    }

    public JobResponse getById(Long jobId) {
        return JobResponse.fromEntity(findOrThrow(jobId));
    }

    @Transactional
    public JobResponse createJob(String posterEmail, JobRequest req) {
        User poster = findUserOrThrow(posterEmail);
        Job job = new Job();
        job.setPoster(poster);
        job.setCompanyName(req.getCompanyName());
        job.setJobTitle(req.getJobTitle());
        job.setDescription(req.getDescription());
        job.setRequirements(req.getRequirements());
        job.setLocation(req.getLocation());
        job.setJobType(req.getJobType());
        job.setSalaryMin(req.getSalaryMin());
        job.setSalaryMax(req.getSalaryMax());
        job.setExperienceRequired(req.getExperienceRequired());
        job.setOpen(req.isOpen());
        job.setPostedDate(LocalDate.now());
        return JobResponse.fromEntity(jobRepository.save(job));
    }

    @Transactional
    public JobResponse updateJob(String posterEmail, Long jobId, JobRequest req) {
        User poster = findUserOrThrow(posterEmail);
        Job job = findOrThrow(jobId);
        if (job.getPoster() == null || !job.getPoster().getUserId().equals(poster.getUserId())) {
            throw new AccessDeniedException("You don't own this job listing");
        }
        job.setCompanyName(req.getCompanyName());
        job.setJobTitle(req.getJobTitle());
        job.setDescription(req.getDescription());
        job.setRequirements(req.getRequirements());
        job.setLocation(req.getLocation());
        job.setJobType(req.getJobType());
        job.setSalaryMin(req.getSalaryMin());
        job.setSalaryMax(req.getSalaryMax());
        job.setExperienceRequired(req.getExperienceRequired());
        job.setOpen(req.isOpen());
        return JobResponse.fromEntity(jobRepository.save(job));
    }

    @Transactional
    public void deleteJob(String posterEmail, Long jobId) {
        User poster = findUserOrThrow(posterEmail);
        Job job = findOrThrow(jobId);
        if (job.getPoster() == null || !job.getPoster().getUserId().equals(poster.getUserId())) {
            throw new AccessDeniedException("You don't own this job listing");
        }
        jobRepository.delete(job);
    }

    public List<JobResponse> getMyJobs(String posterEmail) {
        User poster = findUserOrThrow(posterEmail);
        return jobRepository.findByPosterUserId(poster.getUserId())
                .stream().map(JobResponse::fromEntity).toList();
    }

    private Job findOrThrow(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));
    }

    private User findUserOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
