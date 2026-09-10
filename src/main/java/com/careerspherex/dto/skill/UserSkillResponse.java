package com.careerspherex.dto.skill;

import com.careerspherex.entity.UserSkill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter @Builder @AllArgsConstructor
public class UserSkillResponse {
    private Long userSkillId;
    private Long skillId;
    private String skillName;
    private String category;
    private String skillLevel;
    private BigDecimal yearsExperience;

    public static UserSkillResponse fromEntity(UserSkill us) {
        return UserSkillResponse.builder()
                .userSkillId(us.getUserSkillId())
                .skillId(us.getSkill().getSkillId())
                .skillName(us.getSkill().getSkillName())
                .category(us.getSkill().getCategory())
                .skillLevel(us.getSkillLevel().name())
                .yearsExperience(us.getYearsExperience())
                .build();
    }
}
