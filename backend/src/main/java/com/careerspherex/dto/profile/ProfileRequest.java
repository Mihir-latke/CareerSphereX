package com.careerspherex.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProfileRequest {
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
}
