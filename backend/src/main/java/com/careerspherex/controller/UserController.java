package com.careerspherex.controller;

import com.careerspherex.dto.user.UserResponse;
import com.careerspherex.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {
        return userService.getCurrentUser(authentication.getName());
    }

    /** Lets the current user switch between USER and RECRUITER roles.
     *  Accepted values: "USER", "RECRUITER" */
    @PatchMapping("/me/role")
    public UserResponse switchRole(Authentication auth, @RequestBody Map<String, String> body) {
        return userService.switchRole(auth.getName(), body.get("role"));
    }
}
