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
@Document(collection = "cases")
public class Case {
    @Id
    private String id;
    
    private String caseNumber; // e.g. "CASE-01"
    private String title;
    private String subtitle;
    private String synopsis;
    private String difficulty; // ROOKIE, DETECTIVE, MASTERMIND
    private String estimatedTime;
    private String crimeType; // Murder, Kidnapping, Theft, Disappearance
    private String timeOfCrime;
    private String location;
    private String victimName;
    private String victimStatus; // Missing, Deceased, Hospitalized
    private String briefingText;
    private String thumbnailTheme; // "manor", "vault", "gallery", "dock"
    
    @Builder.Default
    private List<CrimeScene> scenes = new ArrayList<>();
    
    @Builder.Default
    private List<Clue> clues = new ArrayList<>();
    
    @Builder.Default
    private List<Suspect> suspects = new ArrayList<>();
    
    private CaseSolution solution;
}
