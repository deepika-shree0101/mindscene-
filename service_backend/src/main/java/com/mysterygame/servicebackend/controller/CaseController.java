package com.mysterygame.servicebackend.controller;

import com.mysterygame.servicebackend.dto.ClueDiscoverRequest;
import com.mysterygame.servicebackend.dto.DeductionEvaluationResponse;
import com.mysterygame.servicebackend.dto.DeductionSubmitRequest;
import com.mysterygame.servicebackend.dto.UserProgressDto;
import com.mysterygame.servicebackend.model.Case;
import com.mysterygame.servicebackend.model.UserProgress;
import com.mysterygame.servicebackend.security.UserDetailsImpl;
import com.mysterygame.servicebackend.service.CaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {
    private final CaseService caseService;

    @GetMapping
    public ResponseEntity<List<Case>> getAllCases() {
        return ResponseEntity.ok(caseService.getAllCases());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Case> getCaseById(@PathVariable String id) {
        return ResponseEntity.ok(caseService.getCaseById(id));
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<UserProgressDto> getUserProgress(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String userId = userDetails != null ? userDetails.getId() : "anonymous";
        return ResponseEntity.ok(caseService.getUserProgress(userId, id));
    }

    @PostMapping("/{id}/discover")
    public ResponseEntity<UserProgress> discoverClue(
            @PathVariable String id,
            @RequestBody ClueDiscoverRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String userId = userDetails != null ? userDetails.getId() : "anonymous";
        return ResponseEntity.ok(caseService.recordClueDiscovery(userId, id, request.getClueId(), request.getHotspotId()));
    }

    @PostMapping("/{id}/deduce")
    public ResponseEntity<DeductionEvaluationResponse> submitDeduction(
            @PathVariable String id,
            @RequestBody DeductionSubmitRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String userId = userDetails != null ? userDetails.getId() : "anonymous";
        return ResponseEntity.ok(caseService.evaluateDeduction(userId, id, request));
    }
}
