package com.example.ERP_System.controllers;

import com.example.ERP_System.models.User;
import com.example.ERP_System.payload.UserRequest;
import com.example.ERP_System.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class UserController {
    @Autowired UserService userService;

    @GetMapping
    public List<User> listUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    public User register(@RequestBody UserRequest request) {
        return userService.registerNewUser(request);
    }
}
