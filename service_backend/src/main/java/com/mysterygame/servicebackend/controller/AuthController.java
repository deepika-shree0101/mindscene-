package com.mysterygame.servicebackend.controller;

import com.mysterygame.servicebackend.dto.AuthResponse;
import com.mysterygame.servicebackend.dto.LoginRequest;
import com.mysterygame.servicebackend.dto.RegisterRequest;
import com.mysterygame.servicebackend.model.User;
import com.mysterygame.servicebackend.repository.UserRepository;
import com.mysterygame.servicebackend.security.JwtUtils;
import com.mysterygame.servicebackend.security.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Random;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwt)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .badgeNumber(user.getBadgeNumber())
                .rank(user.getRank())
                .clearanceLevel(user.getClearanceLevel())
                .score(user.getScore())
                .completedCaseIds(user.getCompletedCaseIds())
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("{\"error\": \"Agent callsign is already assigned to active personnel.\"}");
        }

        String badge = signUpRequest.getBadgeNumber();
        if (badge == null || badge.isBlank()) {
            badge = "CIB-" + (1000 + new Random().nextInt(9000));
        }

        String rank = signUpRequest.getRank() != null ? signUpRequest.getRank() : "Lead Investigator";
        String clearance = signUpRequest.getClearanceLevel() != null ? signUpRequest.getClearanceLevel() : "LEVEL-3 CONFIDENTIAL";

        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .badgeNumber(badge)
                .rank(rank)
                .clearanceLevel(clearance)
                .completedCaseIds(new ArrayList<>())
                .score(0)
                .build();

        userRepository.save(user);

        // Auto login upon registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signUpRequest.getUsername(), signUpRequest.getPassword()));

        String jwt = jwtUtils.generateJwtToken(authentication);

        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwt)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .badgeNumber(user.getBadgeNumber())
                .rank(user.getRank())
                .clearanceLevel(user.getClearanceLevel())
                .score(user.getScore())
                .completedCaseIds(user.getCompletedCaseIds())
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("{\"error\": \"Unauthorized\"}");
        }

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User record not found"));

        return ResponseEntity.ok(AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .badgeNumber(user.getBadgeNumber())
                .rank(user.getRank())
                .clearanceLevel(user.getClearanceLevel())
                .score(user.getScore())
                .completedCaseIds(user.getCompletedCaseIds())
                .build());
    }
}
