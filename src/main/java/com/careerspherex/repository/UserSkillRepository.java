package com.careerspherex.repository;

import com.careerspherex.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUser_UserId(Long userId);
    Optional<UserSkill> findByUser_UserIdAndSkill_SkillId(Long userId, Long skillId);
    boolean existsByUser_UserIdAndSkill_SkillId(Long userId, Long skillId);
}
