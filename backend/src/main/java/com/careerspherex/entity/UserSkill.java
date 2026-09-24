package com.careerspherex.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "user_skills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_skill_id")
    private Long userSkillId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "skill_level", nullable = false)
    @Builder.Default
    private Level skillLevel = Level.BEGINNER;

    @Column(name = "years_experience", precision = 4, scale = 1)
    @Builder.Default
    private BigDecimal yearsExperience = BigDecimal.ZERO;

    public enum Level { BEGINNER, INTERMEDIATE, ADVANCED, EXPERT }
}
