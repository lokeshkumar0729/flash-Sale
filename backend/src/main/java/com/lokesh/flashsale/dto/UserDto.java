package com.lokesh.flashsale.dto;

import com.lokesh.flashsale.model.Role;
import com.lokesh.flashsale.model.User;

public record UserDto(Long id, String name, String email, String phone, Role role) {

    public static UserDto from(User u) {
        return new UserDto(u.getId(), u.getName(), u.getEmail(), u.getPhone(), u.getRole());
    }
}
