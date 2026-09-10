package com.careerspherex.service;

import com.careerspherex.dto.user.UserResponse;
import com.careerspherex.entity.User;
import com.careerspherex.exception.ResourceNotFoundException;
import com.careerspherex.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.fromEntity(user);
    }

    /** Resolves the numeric user_id behind the JWT subject (email) — used by
     *  controllers that need the current user's ID for ownership checks. */
    public Long getCurrentUserId(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
    }
}
