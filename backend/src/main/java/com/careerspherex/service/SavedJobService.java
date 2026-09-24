package com.careerspherex.service;

import com.careerspherex.dto.job.JobResponse;
import com.careerspherex.entity.Job;
import com.careerspherex.entity.SavedJob;
import com.careerspherex.entity.User;
import com.careerspherex.exception.ResourceNotFoundException;
import com.careerspherex.repository.JobRepository;
import com.careerspherex.repository.SavedJobRepository;
import com.careerspherex.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @Transactional
    public Map<String, Object> toggleSave(String userEmail, Long jobId) {
        User user = findUserOrThrow(userEmail);
        Job  job  = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        Optional<SavedJob> existing = savedJobRepository.findByUserUserIdAndJobJobId(user.getUserId(), jobId);
        if (existing.isPresent()) {
            savedJobRepository.delete(existing.get());
            return Map.of("saved", false);
        } else {
            SavedJob sj = new SavedJob();
            sj.setUser(user);
            sj.setJob(job);
            savedJobRepository.save(sj);
            return Map.of("saved", true);
        }
    }

    public List<JobResponse> getSavedJobs(String userEmail) {
        User user = findUserOrThrow(userEmail);
        return savedJobRepository.findByUserUserId(user.getUserId())
                .stream()
                .map(sj -> JobResponse.fromEntity(sj.getJob()))
                .toList();
    }

    public boolean isSaved(String userEmail, Long jobId) {
        User user = findUserOrThrow(userEmail);
        return savedJobRepository.existsByUserUserIdAndJobJobId(user.getUserId(), jobId);
    }

    private User findUserOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
