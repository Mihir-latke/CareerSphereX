package com.careerspherex.controller;

import com.careerspherex.dto.profile.ProfileRequest;
import com.careerspherex.dto.profile.ProfileResponse;
import com.careerspherex.service.ProfileService;
import com.careerspherex.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final UserService userService;

    @GetMapping
    public ProfileResponse getMyProfile(Authentication authentication) {
        Long userId = userService.getCurrentUserId(authentication.getName());
        return profileService.getProfile(userId);
    }

    @PutMapping
    public ProfileResponse updateMyProfile(Authentication authentication, @RequestBody ProfileRequest request) {
        Long userId = userService.getCurrentUserId(authentication.getName());
        return profileService.upsertProfile(userId, request);
    }
}
