package com.example.CRM.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
    private String fullName; // Used only for registration
    private String role;     // Used only for registration
}