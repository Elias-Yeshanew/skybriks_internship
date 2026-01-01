package com.example.bookstore.security;

import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;
import io.jsonwebtoken.Claims;

import io.jsonwebtoken.Jwts;
import java.util.Date;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.JwtException;
import java.nio.charset.StandardCharsets;
import java.security.Key;

@Component
public class JwtUtil {

    private final long jwtExpirationMs = 86400000;
    private static final String SECRET_KEY =
            "mySecretKey12345mySecretKey12345"; // must be >= 32 bytes for HS256

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationMs);
        // Instant now = Instant.now();

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean validateToken( String Token, UserDetails userDetails){
        return extractUsername(Token).equals(userDetails.getUsername()) && isTokenValid(Token);
    }

    public Boolean isTokenExpired(String Token){
        return extractAllClaims(Token)
            .getExpiration()
            .before(new Date());
    }

    private Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}