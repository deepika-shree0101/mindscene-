package com.mysterygame.servicebackend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Clue {
    private String id;
    private String title;
    private String type; // OBJECT, DOCUMENT, PHOTO, STATEMENT, FORENSIC
    private String description;
    private String visualIcon; // e.g. "key", "file-text", "camera", "flask-conical", "smartphone"
    private String locationFound;
    private String forensicAnalysis;
    private boolean isCrucial;
}
