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

        // Advanced Contextual Dialogue Engine with Slang Normalization and Suspect Personas
        if (aiResponse.isEmpty()) {
            String lowerQuery = userQuery.toLowerCase().trim()
                    .replace("u ", "you ").replace(" u", " you")
                    .replace("ur ", "your ").replace(" wat ", " what ")
                    .replace(" y ", " why ").replace(" bc ", " because ")
                    .replace("didnt", "didn't").replace("dont", "don't")
                    .replace("bro", "").replace("cuz", "because");

            boolean isVance = suspectName.contains("VANCE");
            boolean isEvelyn = suspectName.contains("EVELYN");
            boolean isGraves = suspectName.contains("GRAVES");

            if (lowerQuery.contains("kill") || lowerQuery.contains("murder") || lowerQuery.contains("you did it") || lowerQuery.contains("guilty")) {
                if (isVance) {
                    aiResponse = suspectName + ": (Voice shaking with anger) Mind your tongue, Detective! I spent twenty years keeping Lord Blackwood alive! Accusing his personal physician of murder without a warrant is outrageous slander!";
                    mood = "HOSTILE";
                } else if (isEvelyn) {
                    aiResponse = suspectName + ": (Furious) Are you insane?! He was my father! We fought like family, but I didn't murder him! Go interrogate Dr. Vance!";
                    mood = "HOSTILE";
                } else if (isGraves) {
                    aiResponse = suspectName + ": Detective, I have served the Blackwood family faithfully for thirty-two years. To suggest I would commit violence against his Lordship is an unspeakable dishonor.";
                    mood = "DEFENSIVE";
                } else {
                    aiResponse = suspectName + ": Murder?! You have no right to throw reckless accusations like that without definitive forensic proof!";
                    mood = "HOSTILE";
                }
            } else if (lowerQuery.contains("wine") || lowerQuery.contains("goblet") || lowerQuery.contains("poison") || lowerQuery.contains("tranquilizer") || lowerQuery.contains("doxylamine") || lowerQuery.contains("drink")) {
                if (isVance) {
                    aiResponse = suspectName + ": (Tugging at collar) The goblet?! Lord Blackwood suffered from debilitating insomnia; he frequently took mild sedatives with herbal infusions! If there was foreign tranquilizer in his wine, someone else must have poured it!";
                    mood = "CRACKING";
                } else if (isEvelyn) {
                    aiResponse = suspectName + ": I despise dry wine. Dr. Vance was the only one allowed to touch Father's evening drinks to mix his medication. Ask Vance!";
                    mood = "DEFENSIVE";
                } else {
                    aiResponse = suspectName + ": I decanted the wine earlier that evening, but Dr. Vance personally took the goblet into his clinic quarters before serving his Lordship.";
                    mood = "DEFENSIVE";
                }
            } else if (lowerQuery.contains("note") || lowerQuery.contains("prescription") || lowerQuery.contains("dosage") || lowerQuery.contains("paper")) {
                if (isVance) {
                    aiResponse = suspectName + ": (Sweat forming on brow) That prescription note under the paperweight?! That was an exploratory calculation for his sleep disorders! You're taking routine clinical notes completely out of context!";
                    mood = "CRACKING";
                } else if (isEvelyn) {
                    aiResponse = suspectName + ": That handwriting on the note is unmistakably Dr. Vance's script. He was prescribing dangerous paralytics behind everyone's back!";
                    mood = "DEFENSIVE";
                } else {
                    aiResponse = suspectName + ": His Lordship had an urgent conference with Dr. Vance regarding medical notes earlier that morning.";
                    mood = "DEFENSIVE";
                }
            } else if (lowerQuery.contains("shoe") || lowerQuery.contains("boot") || lowerQuery.contains("footprint") || lowerQuery.contains("tread") || lowerQuery.contains("balcony")) {
                if (isVance) {
                    aiResponse = suspectName + ": (Defensively) Orthopedic shoe prints?! Millions of practitioners wear orthopedic footwear for lumbar support! That does not prove my boots were out in that storm!";
                    mood = "DEFENSIVE";
                } else {
                    aiResponse = suspectName + ": I wear designer footwear, detective. Dr. Vance is the only person on this estate who wears heavy orthopedic shoes.";
                    mood = "DEFENSIVE";
                }
            } else if (lowerQuery.contains("alibi") || lowerQuery.contains("where were you") || lowerQuery.contains("where was you") || lowerQuery.contains("time") || lowerQuery.contains("23:45")) {
                if (isVance) {
                    aiResponse = suspectName + ": From 22:30 until the alarms activated at 23:45, I was sequestered in the west-wing guest clinic updating medical charts. I have stated this repeatedly.";
                    mood = "DEFENSIVE";
                } else if (isEvelyn) {
                    aiResponse = suspectName + ": I was on the stone terrace having a cigarette from 23:25 until 23:50. Butler Graves saw me through the pantry window.";
                    mood = "CALM";
                } else {
                    aiResponse = suspectName + ": At 23:25 I was inspecting the front perimeter security gates due to the thunderstorm. The private security officers can confirm my presence.";
                    mood = "CALM";
                }
            } else if (lowerQuery.contains("money") || lowerQuery.contains("debt") || lowerQuery.contains("will") || lowerQuery.contains("inherit") || lowerQuery.contains("cash")) {
                if (isVance) {
                    aiResponse = suspectName + ": My personal investment holdings are completely private! Yes, the market dipped, but that is hardly a motive to abduct my wealthiest benefactor!";
                    mood = "NERVOUS";
                } else if (isEvelyn) {
                    aiResponse = suspectName + ": Yes, my father disinherited me two months ago. I was furious! But I make my own living through my art galleries. I didn't need his fortune.";
                    mood = "DEFENSIVE";
                } else {
                    aiResponse = suspectName + ": I have no financial interest in his Lordship's testamentary affairs; my lifetime pension was already secured thirty years ago.";
                    mood = "CALM";
                }
            } else if (lowerQuery.contains("secret") || lowerQuery.contains("passage") || lowerQuery.contains("bookshelf") || lowerQuery.contains("dock") || lowerQuery.contains("door")) {
                if (isVance) {
                    aiResponse = suspectName + ": (Eyes widening) Secret bookshelf mechanism?! Blackwood Manor is an eighteenth-century estate full of old servant passages. I am a physician, not the architect!";
                    mood = "CRACKING";
                } else {
                    aiResponse = suspectName + ": I saw someone moving towards the cliffside boathouse right before midnight carrying heavy luggage.";
                    mood = "ALERT";
                }
            } else if (lowerQuery.contains("lie") || lowerQuery.contains("liar") || lowerQuery.contains("truth") || lowerQuery.contains("honest")) {
                aiResponse = suspectName + ": Every word I have given you is verifiable truth! If you have actual physical evidence, present it instead of playing psychological games!";
                mood = "DEFENSIVE";
            } else {
                java.util.List<String> dynamicAnswers = java.util.List.of(
                    "You're asking questions in circles, Detective. Look at the forensic evidence in the study instead of badgering me.",
                    "My statement hasn't changed. Check the estate surveillance cameras and you'll see I'm telling the truth.",
                    "I understand you have a homicide investigation to run, but throwing blind accusations won't find the real culprit.",
                    "Review the timeline at 23:45. That is where the key to this mystery lies."
                );
                aiResponse = suspectName + ": " + dynamicAnswers.get(new java.util.Random().nextInt(dynamicAnswers.size()));
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
