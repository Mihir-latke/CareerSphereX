package com.careerspherex.dto.skill;

import com.careerspherex.entity.Skill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter @Builder @AllArgsConstructor
public class SkillResponse {
    private Long skillId;
    private String skillName;
    private String category;
    private String description;

    public static SkillResponse fromEntity(Skill skill) {
        return SkillResponse.builder()
                .skillId(skill.getSkillId())
                .skillName(skill.getSkillName())
                .category(skill.getCategory())
                .description(skill.getDescription())
                .build();
    }
}
