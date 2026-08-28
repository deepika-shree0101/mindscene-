package com.mysterygame.servicebackend.dto;

import lombok.Data;

@Data
public class ClueDiscoverRequest {
    private String hotspotId;
    private String clueId;
}
