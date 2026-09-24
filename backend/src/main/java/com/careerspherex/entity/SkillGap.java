package com.careerspherex.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skill_gaps")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SkillGap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gap_id")
    private Long gapId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "career_id", nullable = false)
    private Career career;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_level", nullable = false)
    @Builder.Default
    private CurrentLevel currentLevel = CurrentLevel.NONE;

    @Enumerated(EnumType.STRING)
    @Column(name = "required_level", nullable = false)
    private UserSkill.Level requiredLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "gap_status")
    @Builder.Default
    private GapStatus gapStatus = GapStatus.MISSING;

    public enum CurrentLevel { NONE, BEGINNER, INTERMEDIATE, ADVANCED, EXPERT }
    public enum GapStatus { MISSING, NEEDS_IMPROVEMENT, COMPLETED }
}
