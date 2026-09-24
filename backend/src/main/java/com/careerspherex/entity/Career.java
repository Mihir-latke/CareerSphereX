package com.careerspherex.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "careers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Career {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "career_id")
    private Long careerId;

    @Column(name = "career_name", length = 150, nullable = false, unique = true)
    private String careerName;

    @Column(length = 100, nullable = false)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "demand_level")
    @Builder.Default
    private DemandLevel demandLevel = DemandLevel.MEDIUM;

    @Column(name = "average_salary", precision = 12, scale = 2)
    private BigDecimal averageSalary;

    @Column(name = "required_experience", length = 100)
    private String requiredExperience;

    public enum DemandLevel { LOW, MEDIUM, HIGH, VERY_HIGH }
}
