package com.careerspherex.service;

import com.careerspherex.dto.skill.SkillRequest;
import com.careerspherex.dto.skill.SkillResponse;
import com.careerspherex.dto.skill.UserSkillRequest;
import com.careerspherex.dto.skill.UserSkillResponse;
import com.careerspherex.entity.Skill;
import com.careerspherex.entity.User;
import com.careerspherex.entity.UserSkill;
import com.careerspherex.exception.DuplicateResourceException;
import com.careerspherex.exception.ResourceNotFoundException;
import com.careerspherex.repository.SkillRepository;
import com.careerspherex.repository.UserRepository;
import com.careerspherex.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;

    // ---------- Skill catalog (admin-managed reference data) ----------

    public List<SkillResponse> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(SkillResponse::fromEntity)
                .toList();
    }

    public SkillResponse getSkillById(Long skillId) {
        return SkillResponse.fromEntity(findSkillOrThrow(skillId));
    }

    @Transactional
    public SkillResponse createSkill(SkillRequest request) {
        if (skillRepository.existsBySkillNameIgnoreCase(request.getSkillName())) {
            throw new DuplicateResourceException("A skill named '" + request.getSkillName() + "' already exists");
        }
        Skill skill = Skill.builder()
                .skillName(request.getSkillName())
                .category(request.getCategory())
                .description(request.getDescription())
                .build();
        return SkillResponse.fromEntity(skillRepository.save(skill));
    }

    @Transactional
    public SkillResponse updateSkill(Long skillId, SkillRequest request) {
        Skill skill = findSkillOrThrow(skillId);
        skill.setSkillName(request.getSkillName());
        skill.setCategory(request.getCategory());
        skill.setDescription(request.getDescription());
        return SkillResponse.fromEntity(skillRepository.save(skill));
    }

    @Transactional
    public void deleteSkill(Long skillId) {
        Skill skill = findSkillOrThrow(skillId);
        skillRepository.delete(skill);
    }

    private Skill findSkillOrThrow(Long skillId) {
        return skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + skillId));
    }

    // ---------- A user's own skills ----------

    public List<UserSkillResponse> getUserSkills(Long userId) {
        return userSkillRepository.findByUser_UserId(userId).stream()
                .map(UserSkillResponse::fromEntity)
                .toList();
    }

    @Transactional
    public UserSkillResponse addUserSkill(Long userId, UserSkillRequest request) {
        if (userSkillRepository.existsByUser_UserIdAndSkill_SkillId(userId, request.getSkillId())) {
            throw new DuplicateResourceException("This skill is already on your profile — try updating it instead");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Skill skill = findSkillOrThrow(request.getSkillId());

        UserSkill userSkill = UserSkill.builder()
                .user(user)
                .skill(skill)
                .skillLevel(request.getSkillLevel())
                .yearsExperience(request.getYearsExperience())
                .build();

        return UserSkillResponse.fromEntity(userSkillRepository.save(userSkill));
    }

    @Transactional
    public UserSkillResponse updateUserSkill(Long userId, Long userSkillId, UserSkillRequest request) {
        UserSkill userSkill = userSkillRepository.findById(userSkillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill entry not found: " + userSkillId));

        if (!userSkill.getUser().getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Skill entry not found: " + userSkillId);
        }

        if (request.getSkillLevel() != null) userSkill.setSkillLevel(request.getSkillLevel());
        if (request.getYearsExperience() != null) userSkill.setYearsExperience(request.getYearsExperience());

        return UserSkillResponse.fromEntity(userSkillRepository.save(userSkill));
    }

    @Transactional
    public void removeUserSkill(Long userId, Long userSkillId) {
        UserSkill userSkill = userSkillRepository.findById(userSkillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill entry not found: " + userSkillId));

        if (!userSkill.getUser().getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Skill entry not found: " + userSkillId);
        }

        userSkillRepository.delete(userSkill);
    }
}
