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
public class AiChatResponse {
    private String response;
    private String suggestedQuestion;
    private List<String> unlockedClueHints;
    private String mood; // "ANALYTICAL", "ALERT", "ENCOURAGING", "SKEPTICAL"
}
