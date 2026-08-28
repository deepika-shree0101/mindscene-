package com.mysterygame.servicebackend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Suspect {
    private String id;
    private String name;
    private String role;
    private int age;
    private String relationship;
    private String motive;
    private String alibi;
    private String avatarIcon; // e.g. "butler", "heiress", "business", "doctor"
    private boolean isCulprit;
    
    @Builder.Default
    private List<String> initialStatements = new ArrayList<>();
    
    @Builder.Default
    private List<String> unlockedStatements = new ArrayList<>();
}
