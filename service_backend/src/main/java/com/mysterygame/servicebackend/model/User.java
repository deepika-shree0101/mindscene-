package com.mysterygame.servicebackend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    private String email;
    private String password;
    private String badgeNumber;
    private String rank; // e.g. "Cadet", "Lead Detective", "Forensic Specialist"
    private String clearanceLevel; // e.g. "LEVEL-1", "TOP-SECRET"
    
    @Builder.Default
    private List<String> completedCaseIds = new ArrayList<>();
    
    @Builder.Default
    private int score = 0;
    
    @Builder.Default
    private List<String> roles = List.of("ROLE_USER");
}
