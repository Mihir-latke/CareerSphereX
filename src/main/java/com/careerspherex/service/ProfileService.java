package com.careerspherex.service;

import com.careerspherex.dto.profile.ProfileRequest;
import com.careerspherex.dto.profile.ProfileResponse;
import com.careerspherex.entity.User;
import com.careerspherex.entity.UserProfile;
import com.careerspherex.exception.ResourceNotFoundException;
import com.careerspherex.repository.UserProfileRepository;
import com.careerspherex.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public ProfileResponse getProfile(Long userId) {
        return userProfileRepository.findByUser_UserId(userId)
                .map(ProfileResponse::fromEntity)
                .orElseGet(ProfileResponse::empty);
    }

    @Transactional
    public ProfileResponse upsertProfile(Long userId, ProfileRequest request) {
        UserProfile profile = userProfileRepository.findByUser_UserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    return UserProfile.builder().user(user).build();
                });

        profile.setPhone(request.getPhone());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setLocation(request.getLocation());
        profile.setEducation(request.getEducation());
        profile.setDegree(request.getDegree());
        profile.setCollege(request.getCollege());
        profile.setGraduationYear(request.getGraduationYear());
        if (request.getExperienceYears() != null) profile.setExperienceYears(request.getExperienceYears());
        profile.setCareerGoal(request.getCareerGoal());
        profile.setInterests(request.getInterests());
        profile.setBio(request.getBio());

        return ProfileResponse.fromEntity(userProfileRepository.save(profile));
    }
}
