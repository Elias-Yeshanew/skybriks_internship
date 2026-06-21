package com.garage.service;

import com.garage.dto.AuthResponse;
import com.garage.dto.LoginRequest;
import com.garage.entity.AppUser;
import com.garage.exception.ResourceConflictException;
import com.garage.repository.AppUserRepository;
import com.garage.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtUtil.generateToken(userDetails);
        AppUser user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }

    public AuthResponse register(String username, String password, String email, String role) {
        if (userRepository.existsByUsername(username))
            throw new ResourceConflictException("Username already taken: " + username);

        AppUser user = AppUser.builder()
            .username(username)
            .password(passwordEncoder.encode(password))
            .email(email)
            .role(role != null ? AppUser.Role.valueOf(role.toUpperCase()) : AppUser.Role.STAFF)
            .build();
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String token = jwtUtil.generateToken(userDetails);
        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }
}
