package com.mysterygame.servicebackend.controller;

import com.mysterygame.servicebackend.dto.AiChatRequest;
import com.mysterygame.servicebackend.dto.AiChatResponse;
import com.mysterygame.servicebackend.service.AiDetectiveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {
    private final AiDetectiveService aiDetectiveService;

    @PostMapping("/consult")
    public ResponseEntity<AiChatResponse> consultAi(@RequestBody AiChatRequest request) {
        return ResponseEntity.ok(aiDetectiveService.processDetectiveConsultation(request));
    }

    @PostMapping("/interrogate")
    public ResponseEntity<AiChatResponse> interrogateSuspect(@RequestBody AiChatRequest request) {
        return ResponseEntity.ok(aiDetectiveService.processInterrogation(request));
    }
}
