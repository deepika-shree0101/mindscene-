package com.mysterygame.servicebackend.service;

import com.mysterygame.servicebackend.dto.DeductionEvaluationResponse;
import com.mysterygame.servicebackend.dto.DeductionSubmitRequest;
import com.mysterygame.servicebackend.dto.UserProgressDto;
import com.mysterygame.servicebackend.model.Case;
import com.mysterygame.servicebackend.model.Clue;
import com.mysterygame.servicebackend.model.User;
import com.mysterygame.servicebackend.model.UserProgress;
import com.mysterygame.servicebackend.repository.CaseRepository;
import com.mysterygame.servicebackend.repository.UserProgressRepository;
import com.mysterygame.servicebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CaseService {
    private final CaseRepository caseRepository;
    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;

    public List<Case> getAllCases() {
        List<Case> cases = caseRepository.findAll();
        // Hide actual solution from public listing
        cases.forEach(c -> c.setSolution(null));
        return cases;
    }

    public Case getCaseById(String id) {
        Case c = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case dossier not found: " + id));
        // Strip out solution to prevent client-side inspection cheats
        c.setSolution(null);
        return c;
    }

    public UserProgressDto getUserProgress(String userId, String caseId) {
        UserProgress progress = userProgressRepository.findByUserIdAndCaseId(userId, caseId)
                .orElseGet(() -> UserProgress.builder()
                        .userId(userId)
                        .caseId(caseId)
                        .discoveredClueIds(new ArrayList<>())
                        .inspectedHotspotIds(new ArrayList<>())
                        .unlockedSceneIds(new ArrayList<>())
                        .connectedCluePairs(new ArrayList<>())
                        .isSolved(false)
                        .score(0)
                        .timeSpentSeconds(0)
                        .build());

        return UserProgressDto.builder()
                .caseId(progress.getCaseId())
                .discoveredClueIds(progress.getDiscoveredClueIds())
                .inspectedHotspotIds(progress.getInspectedHotspotIds())
                .unlockedSceneIds(progress.getUnlockedSceneIds())
                .connectedCluePairs(progress.getConnectedCluePairs())
                .isSolved(progress.isSolved())
                .score(progress.getScore())
                .timeSpentSeconds(progress.getTimeSpentSeconds())
                .build();
    }

    public UserProgress recordClueDiscovery(String userId, String caseId, String clueId, String hotspotId) {
        UserProgress progress = userProgressRepository.findByUserIdAndCaseId(userId, caseId)
                .orElse(UserProgress.builder()
                        .userId(userId)
                        .caseId(caseId)
                        .discoveredClueIds(new ArrayList<>())
                        .inspectedHotspotIds(new ArrayList<>())
                        .unlockedSceneIds(new ArrayList<>())
                        .connectedCluePairs(new ArrayList<>())
                        .isSolved(false)
                        .build());

        if (hotspotId != null && !progress.getInspectedHotspotIds().contains(hotspotId)) {
            progress.getInspectedHotspotIds().add(hotspotId);
        }
        if (clueId != null && !progress.getDiscoveredClueIds().contains(clueId)) {
            progress.getDiscoveredClueIds().add(clueId);
            progress.setScore(progress.getScore() + 100);
        }

        return userProgressRepository.save(progress);
    }

    public DeductionEvaluationResponse evaluateDeduction(String userId, String caseId, DeductionSubmitRequest request) {
        Case caseData = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found for deduction"));

        var solution = caseData.getSolution();
        if (solution == null) {
            throw new RuntimeException("Case solution is unconfigured");
        }

        boolean isCorrectCulprit = solution.getCulpritId().equalsIgnoreCase(request.getCulpritId());
        
        List<String> crucialFound = new ArrayList<>();
        List<String> crucialMissed = new ArrayList<>();
        
        for (String crucialId : solution.getCrucialClueIds()) {
            if (request.getSelectedEvidenceIds() != null && request.getSelectedEvidenceIds().contains(crucialId)) {
                crucialFound.add(crucialId);
            } else {
                crucialMissed.add(crucialId);
            }
        }

        int score = 0;
        if (isCorrectCulprit) score += 500;
        score += crucialFound.size() * 150;
        if (request.getTimeTakenSeconds() < 300) score += 200; // Speed bonus

        boolean solved = isCorrectCulprit && crucialFound.size() >= (solution.getCrucialClueIds().size() / 2);
        
        String badge = solved ? (score >= 900 ? "MASTER DETECTIVE" : "CLEARED INVESTIGATOR") : "INCONCLUSIVE LEAD";
        final int finalScore = score;

        // Update user progress & score in MongoDB
        if (userId != null && !userId.isBlank()) {
            Optional<UserProgress> progressOpt = userProgressRepository.findByUserIdAndCaseId(userId, caseId);
            if (progressOpt.isPresent()) {
                UserProgress p = progressOpt.get();
                p.setSolved(solved);
                p.setScore(Math.max(p.getScore(), finalScore));
                p.setTimeSpentSeconds(request.getTimeTakenSeconds());
                userProgressRepository.save(p);
            }

            if (solved) {
                userRepository.findById(userId).ifPresent(user -> {
                    if (!user.getCompletedCaseIds().contains(caseId)) {
                        user.getCompletedCaseIds().add(caseId);
                        user.setScore(user.getScore() + finalScore);
                        userRepository.save(user);
                    }
                });
            }
        }

        String summary = solved 
            ? "Exceptional deduction, Agent. Your evidence chain conclusively implicates " + solution.getCulpritName() + "."
            : "The evidence presented fails to form an airtight case. Review the crime scene and suspect motives.";

        return DeductionEvaluationResponse.builder()
                .isCorrect(solved)
                .score(score)
                .title(solved ? "CASE SOLVED 🔎" : "CASE UNSOLVED — TRY AGAIN")
                .evaluationSummary(summary)
                .trueCulpritName(solution.getCulpritName())
                .trueMotive(solution.getMotive())
                .trueSequenceOfEvents(solution.getTrueSequenceOfEvents())
                .crucialCluesFound(crucialFound)
                .crucialCluesMissed(crucialMissed)
                .totalCluesDiscovered(request.getSelectedEvidenceIds() != null ? request.getSelectedEvidenceIds().size() : 0)
                .totalCluesInCase(caseData.getClues().size())
                .timeTakenSeconds(request.getTimeTakenSeconds())
                .badgeAwarded(badge)
                .build();
    }
}
