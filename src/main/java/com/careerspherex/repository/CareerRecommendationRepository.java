package com.careerspherex.repository;

import com.careerspherex.entity.CareerRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerRecommendationRepository extends JpaRepository<CareerRecommendation, Long> {
}
