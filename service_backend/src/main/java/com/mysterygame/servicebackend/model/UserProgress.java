package com.mysterygame.servicebackend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_progress")
public class UserProgress {
    @Id
    private String id;
    
    private String userId;
    private String caseId;
    
    @Builder.Default
    private List<String> discoveredClueIds = new ArrayList<>();
    
    @Builder.Default
    private List<String> inspectedHotspotIds = new ArrayList<>();
    
    @Builder.Default
    private List<String> unlockedSceneIds = new ArrayList<>();
    
    @Builder.Default
    private List<String> connectedCluePairs = new ArrayList<>(); // e.g. "clue1:clue2"
    
    private boolean isSolved;
    private int score;
    private long timeSpentSeconds;
    private String userDeduction;
    private String aiFeedback;
}
