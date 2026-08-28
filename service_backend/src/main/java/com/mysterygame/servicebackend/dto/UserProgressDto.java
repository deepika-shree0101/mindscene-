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
public class UserProgressDto {
    private String caseId;
    private List<String> discoveredClueIds;
    private List<String> inspectedHotspotIds;
    private List<String> unlockedSceneIds;
    private List<String> connectedCluePairs;
    private boolean isSolved;
    private int score;
    private long timeSpentSeconds;
}
