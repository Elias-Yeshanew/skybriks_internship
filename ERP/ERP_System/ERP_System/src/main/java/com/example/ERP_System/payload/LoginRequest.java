package com.example.ERP_System.payload;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
