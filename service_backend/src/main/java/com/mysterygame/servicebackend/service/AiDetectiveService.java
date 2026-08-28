package com.mysterygame.servicebackend.service;

import com.mysterygame.servicebackend.dto.AiChatRequest;
import com.mysterygame.servicebackend.dto.AiChatResponse;
import com.mysterygame.servicebackend.model.Case;
import com.mysterygame.servicebackend.model.Clue;
import com.mysterygame.servicebackend.model.Suspect;
import com.mysterygame.servicebackend.repository.CaseRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiDetectiveService {
    private static final Logger logger = LoggerFactory.getLogger(AiDetectiveService.class);

    private final CaseRepository caseRepository;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    public AiChatResponse processDetectiveConsultation(AiChatRequest request) {
        Optional<Case> caseOpt = caseRepository.findById(request.getCaseId());
        if (caseOpt.isEmpty()) {
            return AiChatResponse.builder()
                    .response("SPECTER AI: Transmission degraded. Case archive not found in active memory.")
                    .suggestedQuestion("What is the primary objective?")
                    .unlockedClueHints(List.of())
                    .mood("ALERT")
                    .build();
        }

        Case c = caseOpt.get();
        List<Clue> discoveredClues = c.getClues().stream()
                .filter(clue -> request.getDiscoveredClueIds() != null && request.getDiscoveredClueIds().contains(clue.getId()))
                .collect(Collectors.toList());

        String userQuery = request.getUserMessage().toLowerCase().trim();

        // Built-in intelligent detective logic
        String aiResponse;
        String suggestedQuestion;
        String mood = "ANALYTICAL";
        List<String> hints = new ArrayList<>();

        if (userQuery.contains("photo") || userQuery.contains("picture") || userQuery.contains("image")) {
            aiResponse = "SPECTER: Analyzing photographic evidence... Notice the lighting and shadows in the background. Does the timestamp align with the alibi given by the suspects?";
            suggestedQuestion = "Check the suspect alibis against the crime time";
            mood = "ANALYTICAL";
        } else if (userQuery.contains("who") || userQuery.contains("culprit") || userQuery.contains("suspect") || userQuery.contains("killer")) {
            aiResponse = "SPECTER: I cannot make the final accusation for you, Agent. However, cross-reference who had access to the master key and who stood to gain financially from the incident.";
            suggestedQuestion = "Examine the financial documents in the study";
            mood = "SKEPTICAL";
            hints.add("Review who had exclusive access to the restricted areas.");
        } else if (userQuery.contains("safe") || userQuery.contains("code") || userQuery.contains("lock")) {
            aiResponse = "SPECTER: The locking mechanism shows zero signs of forced entry. This implies the person either knew the combination or used a duplicate keycard.";
            suggestedQuestion = "Who had access to the safe codes?";
            mood = "ALERT";
        } else if (userQuery.contains("hint") || userQuery.contains("help") || userQuery.contains("stuck")) {
            if (discoveredClues.size() < 3) {
                aiResponse = "SPECTER: You have only surveyed a small portion of the scene. Shine your scanner around the desk and balcony for overlooked traces.";
                suggestedQuestion = "Scan the dark corners of the scene";
                mood = "ENCOURAGING";
            } else {
                aiResponse = "SPECTER: You have gathered " + discoveredClues.size() + " crucial pieces of evidence. Look for contradictions between what the suspects claim and what the physical documents state.";
                suggestedQuestion = "Connect the torn note with the phone records";
                mood = "ANALYTICAL";
            }
        } else if (userQuery.contains("motive") || userQuery.contains("why")) {
            aiResponse = "SPECTER: Follow the money and the grudges. In cases of this nature, unresolved debts or hidden wills are often the primary catalyst.";
            suggestedQuestion = "Look into recent financial transactions";
            mood = "ANALYTICAL";
        } else {
            if (!discoveredClues.isEmpty()) {
                Clue latestClue = discoveredClues.get(discoveredClues.size() - 1);
                aiResponse = "SPECTER: Correlating your query with our latest discovery: '" + latestClue.getTitle() + "'. " 
                        + latestClue.getForensicAnalysis() + " What connection do you see with the victim's last known movement?";
                suggestedQuestion = "How does " + latestClue.getTitle() + " relate to the suspect's alibi?";
            } else {
                aiResponse = "SPECTER: Systems active. Point your forensic scanner at the environment. Every object in this crime scene tells a silent story.";
                suggestedQuestion = "Where should we begin scanning?";
            }
        }

        return AiChatResponse.builder()
                .response(aiResponse)
                .suggestedQuestion(suggestedQuestion)
                .unlockedClueHints(hints)
                .mood(mood)
                .build();
    }
}
