package com.careerspherex.service;

import com.careerspherex.dto.user.UserResponse;
import com.careerspherex.entity.User;
import com.careerspherex.exception.ResourceNotFoundException;
import com.careerspherex.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getCurrentUser(String email) {
        User user = findOrThrow(email);
        return UserResponse.fromEntity(user);
    }

    public Long getCurrentUserId(String email) {
        return findOrThrow(email).getUserId();
    }

    @Transactional
    public UserResponse switchRole(String email, String roleStr) {
        User user = findOrThrow(email);
        User.Role role;
        try {
            role = User.Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + roleStr);
        }
        // Only allow switching between USER and RECRUITER (not ADMIN)
        if (role == User.Role.ADMIN) {
            throw new IllegalArgumentException("Cannot self-assign ADMIN role");
        }
        user.setRole(role);
        return UserResponse.fromEntity(userRepository.save(user));
    }

    private User findOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
