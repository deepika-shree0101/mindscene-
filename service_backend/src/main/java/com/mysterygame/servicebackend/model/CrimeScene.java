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
public class CrimeScene {
    private String id;
    private String name;
    private String subtitle;
    private String description;
    private String visualTheme; // "manor-study", "rainy-balcony", "vault-room", "penthouse"
    private String ambientType; // "rain", "thunder", "night_city", "silent_study"
    
    @Builder.Default
    private List<Hotspot> hotspots = new ArrayList<>();
}
