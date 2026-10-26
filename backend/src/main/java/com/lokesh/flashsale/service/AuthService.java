package com.lokesh.flashsale.service;

import com.lokesh.flashsale.dto.*;
import com.lokesh.flashsale.exception.ApiException;
import com.lokesh.flashsale.model.Role;
import com.lokesh.flashsale.model.User;
import com.lokesh.flashsale.repository.UserRepository;
import com.lokesh.flashsale.security.JwtService;
import com.lokesh.flashsale.security.LoginRateLimiter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final LoginRateLimiter limiter;
    /** Compared against when the email is unknown so response time does not reveal which emails exist. */
    private final String dummyHash;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt, LoginRateLimiter limiter) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
        this.limiter = limiter;
        this.dummyHash = encoder.encode("not-a-real-password");
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) {
            throw ApiException.conflict("An account with this email already exists");
        }
        User user = users.save(new User(request.name().trim(), email, blankToNull(request.phone()),
                encoder.encode(request.password()), Role.CUSTOMER));
        return new AuthResponse(jwt.generateToken(user.getEmail(), user.getRole()), UserDto.from(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request, String clientIp) {
        String key = request.email().trim().toLowerCase() + "|" + clientIp;
        limiter.checkAllowed(key);

        User user = users.findByEmailIgnoreCase(request.email().trim()).orElse(null);
        boolean matches = encoder.matches(request.password(), user != null ? user.getPasswordHash() : dummyHash);
        if (user == null || !matches) {
            limiter.recordFailure(key);
            throw ApiException.unauthorized("Invalid email or password");
        }
        limiter.reset(key);
        return new AuthResponse(jwt.generateToken(user.getEmail(), user.getRole()), UserDto.from(user));
    }

    @Transactional(readOnly = true)
    public UserDto currentUser(String email) {
        return UserDto.from(requireUser(email));
    }

    @Transactional
    public UserDto updateProfile(String email, UpdateProfileRequest request) {
        User user = requireUser(email);
        user.setName(request.name().trim());
        user.setPhone(blankToNull(request.phone()));
        return UserDto.from(user);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = requireUser(email);
        if (!encoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw ApiException.badRequest("Your current password is incorrect");
        }
        user.setPasswordHash(encoder.encode(request.newPassword()));
    }

    private User requireUser(String email) {
        return users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> ApiException.unauthorized("Account no longer exists"));
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
