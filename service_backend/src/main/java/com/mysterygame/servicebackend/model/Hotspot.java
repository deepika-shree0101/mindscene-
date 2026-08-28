package com.mysterygame.servicebackend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Hotspot {
    private String id;
    private String title;
    private String description;
    private double xPercent; // 0.0 to 100.0 position
    private double yPercent; // 0.0 to 100.0 position
    private String iconType; // magnifier, key, file, fingerprint, blood, camera, safe, laptop
    private String linkedClueId;
    private String inspectionDialogue;
}
