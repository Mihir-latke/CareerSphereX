package com.careerspherex.controller;

import com.careerspherex.dto.skill.SkillRequest;
import com.careerspherex.dto.skill.SkillResponse;
import com.careerspherex.dto.skill.UserSkillRequest;
import com.careerspherex.dto.skill.UserSkillResponse;
import com.careerspherex.service.SkillService;
import com.careerspherex.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;
    private final UserService userService;

    // ---------- Skill catalog — readable by any authenticated user ----------

    @GetMapping("/api/skills")
    public List<SkillResponse> getAllSkills() {
        return skillService.getAllSkills();
    }

    @GetMapping("/api/skills/{id}")
    public SkillResponse getSkill(@PathVariable("id") Long skillId) {
        return skillService.getSkillById(skillId);
    }

    // ---------- Skill catalog — admin-managed (see SecurityConfig: /api/admin/**) ----------

    @PostMapping("/api/admin/skills")
    public ResponseEntity<SkillResponse> createSkill(@Valid @RequestBody SkillRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(skillService.createSkill(request));
    }

    @PutMapping("/api/admin/skills/{id}")
    public SkillResponse updateSkill(@PathVariable("id") Long skillId, @Valid @RequestBody SkillRequest request) {
        return skillService.updateSkill(skillId, request);
    }

    @DeleteMapping("/api/admin/skills/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable("id") Long skillId) {
        skillService.deleteSkill(skillId);
        return ResponseEntity.noContent().build();
    }

    // ---------- The current user's own skills ----------

    @GetMapping("/api/users/me/skills")
    public List<UserSkillResponse> getMySkills(Authentication authentication) {
        Long userId = userService.getCurrentUserId(authentication.getName());
        return skillService.getUserSkills(userId);
    }

    @PostMapping("/api/users/me/skills")
    public ResponseEntity<UserSkillResponse> addMySkill(
            Authentication authentication, @Valid @RequestBody UserSkillRequest request) {
        Long userId = userService.getCurrentUserId(authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(skillService.addUserSkill(userId, request));
    }

    @PutMapping("/api/users/me/skills/{userSkillId}")
    public UserSkillResponse updateMySkill(
            Authentication authentication,
            @PathVariable Long userSkillId,
            @Valid @RequestBody UserSkillRequest request) {
        Long userId = userService.getCurrentUserId(authentication.getName());
        return skillService.updateUserSkill(userId, userSkillId, request);
    }

    @DeleteMapping("/api/users/me/skills/{userSkillId}")
    public ResponseEntity<Void> removeMySkill(Authentication authentication, @PathVariable Long userSkillId) {
        Long userId = userService.getCurrentUserId(authentication.getName());
        skillService.removeUserSkill(userId, userSkillId);
        return ResponseEntity.noContent().build();
    }
}
