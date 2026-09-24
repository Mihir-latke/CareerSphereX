package com.careerspherex.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "career_skills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CareerSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "career_skill_id")
    private Long careerSkillId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "career_id", nullable = false)
    private Career career;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "required_level", nullable = false)
    private UserSkill.Level requiredLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "importance")
    @Builder.Default
    private Importance importance = Importance.MEDIUM;

    public enum Importance { LOW, MEDIUM, HIGH, CRITICAL }
}
