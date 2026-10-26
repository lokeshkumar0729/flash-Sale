package com.lokesh.flashsale.controller;

import com.lokesh.flashsale.dto.*;
import com.lokesh.flashsale.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest http) {
        return authService.login(request, http.getRemoteAddr());
    }

    @GetMapping("/me")
    public UserDto me(Authentication auth) {
        return authService.currentUser(auth.getName());
    }

    @PutMapping("/me")
    public UserDto updateProfile(@Valid @RequestBody UpdateProfileRequest request, Authentication auth) {
        return authService.updateProfile(auth.getName(), request);
    }

    @PutMapping("/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@Valid @RequestBody ChangePasswordRequest request, Authentication auth) {
        authService.changePassword(auth.getName(), request);
    }
}
