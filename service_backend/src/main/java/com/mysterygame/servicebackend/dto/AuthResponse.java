package com.mysterygame.servicebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private String id;
    private String username;
    private String email;
    private String badgeNumber;
    private String rank;
    private String clearanceLevel;
    private int score;
    private List<String> completedCaseIds;
}
