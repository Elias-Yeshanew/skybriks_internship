package com.example.ERP_System.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ERP_System.models.*;
import com.example.ERP_System.payload.UserRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.ERP_System.repository.*;

import java.util.*;

@Service
public class UserService {
    @Autowired UserRepository userRepository;
    @Autowired RoleRepository roleRepository;
    @Autowired PasswordEncoder encoder;

    public User registerNewUser(UserRequest request){
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));

        Set<Role> roles = new HashSet<>();
        request.getRoles().forEach(roleStr -> {
            ERole eRole = switch (roleStr.toLowerCase()){
                case "admin" -> ERole.ROLE_ADMIN;
                case "sales" -> ERole.ROlE_SALES_EXECUTIVE;
                case "purchase" -> ERole.ROLE_PURCHASE_MANAGER;
                case "inventory" -> ERole.ROLE_INVENTORY_MANAGER;
                case "accountant" -> ERole.ROLE_ACCOUNTANT;
                default -> throw new RuntimeException("Role not found: " + roleStr);
            };
            Role role = roleRepository.findByName(eRole)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(role);
        });
        user.setRoles(roles);
        return userRepository.save(user);
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
}
