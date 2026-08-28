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
public class AiChatRequest {
    private String caseId;
    private String userMessage;
    private List<String> discoveredClueIds;
    private String focusedSubject; // e.g. suspect name or clue title
    private String sceneId;
}
