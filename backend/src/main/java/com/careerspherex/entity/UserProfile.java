package com.careerspherex.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "user_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 20)
    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 150)
    private String location;

    @Column(length = 150)
    private String education;

    @Column(length = 150)
    private String degree;

    @Column(length = 200)
    private String college;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(name = "experience_years", precision = 4, scale = 1)
    @Builder.Default
    private BigDecimal experienceYears = BigDecimal.ZERO;

    @Column(name = "career_goal", length = 150)
    private String careerGoal;

    @Column(columnDefinition = "TEXT")
    private String interests;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "profile_photo", length = 500)
    private String profilePhoto;
}
