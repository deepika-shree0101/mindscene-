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

    public AiChatResponse processInterrogation(AiChatRequest request) {
        String suspectName = request.getFocusedSubject() != null ? request.getFocusedSubject().toUpperCase() : "UNKNOWN SUSPECT";
        String userQuery = request.getUserMessage();
        String aiResponse = "";
        String mood = "DEFENSIVE";

        // Try to use real Gemini API if key is present
        if (geminiApiKey != null && !geminiApiKey.isEmpty() && !geminiApiKey.equals("your_super_secret_key_needs_to_be_long_enough")) {
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                String prompt = "You are a murder suspect named " + suspectName + ". You are being interrogated by a detective. " +
                        "The detective says: '" + userQuery + "'. " +
                        "Respond defensively, in character, in 1 to 2 short sentences. Do not break character. Do not say you are an AI.";
                
                String requestBody = "{\"contents\":[{\"parts\":[{\"text\":\"" + prompt.replace("\"", "\\\"") + "\"}]}]}";
                
                java.net.http.HttpRequest httpRequest = java.net.http.HttpRequest.newBuilder()
                        .uri(java.net.URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey))
                        .header("Content-Type", "application/json")
                        .POST(java.net.http.HttpRequest.BodyPublishers.ofString(requestBody))
                        .build();

                java.net.http.HttpResponse<String> response = client.send(httpRequest, java.net.http.HttpResponse.BodyHandlers.ofString());
                
                if (response.statusCode() == 200) {
                    // Quick JSON parse (avoiding heavy Jackson tree for simplicity)
                    String body = response.body();
                    int textIndex = body.indexOf("\"text\": \"");
                    if (textIndex != -1) {
                        int endIndex = body.indexOf("\"", textIndex + 9);
                        String extracted = body.substring(textIndex + 9, endIndex).replace("\\n", " ").replace("\\\"", "\"");
                        aiResponse = suspectName + ": " + extracted;
                    }
                }
            } catch (Exception e) {
                logger.error("Gemini API call failed", e);
            }
        }

        // Advanced Fallback if API fails or is not configured
        if (aiResponse.isEmpty()) {
            String lowerQuery = userQuery.toLowerCase().trim();
            java.util.List<String> deflections = java.util.List.of(
                "I don't have to listen to these wild accusations.",
                "You're twisting my words, detective. I'm done talking.",
                "Is this a joke? Because I'm not laughing.",
                "I want to speak to my lawyer before I say another word.",
                "You have absolutely zero proof of that."
            );

            if (lowerQuery.contains("alibi") || lowerQuery.contains("where were you")) {
                aiResponse = suspectName + ": Like I told the officers, I was completely alone that night. No, I don't have witnesses.";
            } else if (lowerQuery.contains("blood") || lowerQuery.contains("weapon") || lowerQuery.contains("kill") || lowerQuery.contains("murder")) {
                aiResponse = suspectName + ": Are you accusing me?! I've never seen that weapon in my life! This is harassment!";
                mood = "HOSTILE";
            } else if (lowerQuery.contains("money") || lowerQuery.contains("debt") || lowerQuery.contains("bank") || lowerQuery.contains("pay")) {
                aiResponse = suspectName + ": Look, we all have financial troubles. It's none of your business anyway.";
                mood = "NERVOUS";
            } else if (request.getDiscoveredClueIds() != null && request.getDiscoveredClueIds().size() > 2 && lowerQuery.contains("evidence")) {
                aiResponse = suspectName + ": Okay, okay... maybe I was near the scene. But I didn't do it! Someone is setting me up!";
                mood = "CRACKING";
            } else {
                aiResponse = suspectName + ": " + deflections.get(new java.util.Random().nextInt(deflections.size()));
                mood = "DEFENSIVE";
            }
        }

        return AiChatResponse.builder()
                .response(aiResponse)
                .suggestedQuestion("Press them harder on the timeline")
                .unlockedClueHints(java.util.List.of())
                .mood(mood)
                .build();
    }
}
