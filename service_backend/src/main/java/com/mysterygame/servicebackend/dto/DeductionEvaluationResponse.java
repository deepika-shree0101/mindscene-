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
public class DeductionEvaluationResponse {
    private boolean isCorrect;
    private int score;
    private String title;
    private String evaluationSummary;
    private String trueCulpritName;
    private String trueMotive;
    private String trueSequenceOfEvents;
    private List<String> crucialCluesFound;
    private List<String> crucialCluesMissed;
    private int totalCluesDiscovered;
    private int totalCluesInCase;
    private long timeTakenSeconds;
    private String badgeAwarded;
}
