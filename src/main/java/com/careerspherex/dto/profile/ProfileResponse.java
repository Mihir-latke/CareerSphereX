package com.careerspherex.dto.profile;

import com.careerspherex.entity.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Builder @AllArgsConstructor
public class ProfileResponse {
    private Long profileId;
    private String phone;
    private LocalDate dateOfBirth;
    private String location;
    private String education;
    private String degree;
    private String college;
    private Integer graduationYear;
    private BigDecimal experienceYears;
    private String careerGoal;
    private String interests;
    private String bio;
    private String profilePhoto;

    public static ProfileResponse fromEntity(UserProfile p) {
        return ProfileResponse.builder()
                .profileId(p.getProfileId())
                .phone(p.getPhone())
                .dateOfBirth(p.getDateOfBirth())
                .location(p.getLocation())
                .education(p.getEducation())
                .degree(p.getDegree())
                .college(p.getCollege())
                .graduationYear(p.getGraduationYear())
                .experienceYears(p.getExperienceYears())
                .careerGoal(p.getCareerGoal())
                .interests(p.getInterests())
                .bio(p.getBio())
                .profilePhoto(p.getProfilePhoto())
                .build();
    }

    /** An empty shape for a user who hasn't created a profile row yet. */
    public static ProfileResponse empty() {
        return ProfileResponse.builder().experienceYears(BigDecimal.ZERO).build();
    }
}
