package com.careerspherex.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_id")
    private Long skillId;

    @Column(name = "skill_name", length = 100, nullable = false, unique = true)
    private String skillName;

    @Column(length = 100, nullable = false)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;
}
