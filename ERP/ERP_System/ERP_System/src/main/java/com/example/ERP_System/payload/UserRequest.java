package com.example.ERP_System.payload;

import lombok.Data;
import java.util.Set;

@Data
public class UserRequest{
    private String username;
    private String email;
    private String password;
    private Set<String> roles;
}