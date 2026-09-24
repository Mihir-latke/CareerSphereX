package com.careerspherex.dto.skill;

import com.careerspherex.entity.UserSkill;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UserSkillRequest {

    @NotNull(message = "skillId is required")
    private Long skillId;

    @NotNull(message = "skillLevel is required")
    private UserSkill.Level skillLevel;

    private BigDecimal yearsExperience;
}
