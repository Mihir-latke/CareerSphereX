package com.careerspherex.dto.auth;

import com.careerspherex.dto.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter @Builder @AllArgsConstructor
public class LoginResponse {
    private String token;
    private UserResponse user;
}
