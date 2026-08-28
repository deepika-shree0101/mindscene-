package com.mysterygame.servicebackend.config;

import com.mysterygame.servicebackend.model.*;
import com.mysterygame.servicebackend.repository.CaseRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);
    private final CaseRepository caseRepository;

    @Override
    public void run(String... args) {
        if (caseRepository.count() == 0) {
            logger.info("Initializing Criminal Investigation Database with Seed Cases...");
            seedCases();
        } else {
            logger.info("Case database already populated ({} active cases).", caseRepository.count());
        }
    }

    private void seedCases() {
        // CASE 01
        Case case1 = Case.builder()
                .caseNumber("CASE-01")
                .title("The Vanishing at Blackwood Manor")
                .subtitle("A stormy night, a locked study, and a billionaire who ceased to exist.")
                .synopsis("Lord Arthur Blackwood disappeared from his locked study at 23:45 during a heavy rainstorm. No signs of struggle, but the balcony lock was tampered with and a glass of vintage wine remains half-drunk.")
                .difficulty("DETECTIVE")
                .estimatedTime("15-20 Mins")
                .crimeType("High-Profile Kidnapping / Disappearance")
                .timeOfCrime("23:45 EST — Oct 14")
                .location("Blackwood Estate, Cliffside Heights")
                .victimName("Lord Arthur Blackwood")
                .victimStatus("Missing")
                .briefingText("Agents: At 23:45 hours, the estate alarm triggered. Security arrived within 90 seconds. The mahogany study doors were locked from the inside. Inside, Lord Blackwood was nowhere to be found. Inspect every document, examine the vintage wine glass, and interrogate the inner circle.")
                .thumbnailTheme("manor")
                .scenes(List.of(
                        CrimeScene.builder()
                                .id("scene-study")
                                .name("The Lord's Study")
                                .subtitle("Primary crime scene — Mahogany desk, crackling fireplace, shattered glass")
                                .description("Dimly lit private study with rain drumming against high gothic windows.")
                                .visualTheme("manor-study")
                                .ambientType("rain")
                                .hotspots(List.of(
                                        Hotspot.builder()
                                                .id("hs-desk-letter")
                                                .title("Torn Medical Note")
                                                .description("A half-burnt handwritten letter under a bronze paperweight.")
                                                .xPercent(32.5)
                                                .yPercent(64.0)
                                                .iconType("file")
                                                .linkedClueId("clue-med-note")
                                                .inspectionDialogue("The note reads: '...dosage increase will induce temporary paralysis without cardiac trace... Dr. V.'")
                                                .build(),
                                        Hotspot.builder()
                                                .id("hs-wine-glass")
                                                .title("Crystal Wine Goblet")
                                                .description("A crystal goblet with faint white residue near the rim.")
                                                .xPercent(48.0)
                                                .yPercent(58.0)
                                                .iconType("flask-conical")
                                                .linkedClueId("clue-sedative-goblet")
                                                .inspectionDialogue("Forensic scanner detects concentrated Doxylamine tranquilizer. The wine was spiked.")
                                                .build(),
                                        Hotspot.builder()
                                                .id("hs-bookshelf-scratch")
                                                .title("Concealed Wall Mechanism")
                                                .description("Faint scratches on the hardwood floor leading to a hidden door behind the bookshelf.")
                                                .xPercent(78.0)
                                                .yPercent(42.0)
                                                .iconType("key")
                                                .linkedClueId("clue-secret-passage")
                                                .inspectionDialogue("The bookshelf pivots smoothly! A secret corridor connects directly to the lower cliffside dock.")
                                                .build()
                                ))
                                .build(),
                        CrimeScene.builder()
                                .id("scene-balcony")
                                .name("Rain-Swept Balcony")
                                .subtitle("Secondary scene — Overlooking the stormy cliff")
                                .description("Cold wind howls over the stone balustrade. Wet footprints lead in an unusual direction.")
                                .visualTheme("rainy-balcony")
                                .ambientType("thunder")
                                .hotspots(List.of(
                                        Hotspot.builder()
                                                .id("hs-muddy-footprint")
                                                .title("Size 10 Orthopedic Bootprints")
                                                .description("Tread marks made by specialized non-slip orthopedic footwear.")
                                                .xPercent(25.0)
                                                .yPercent(75.0)
                                                .iconType("fingerprint")
                                                .linkedClueId("clue-orthopedic-shoe")
                                                .inspectionDialogue("Matches the custom orthopedic shoes worn by Dr. Vance, the personal physician.")
                                                .build(),
                                        Hotspot.builder()
                                                .id("hs-broken-latch")
                                                .title("Staged Balcony Lock")
                                                .description("The lock was cut with pliers from the INSIDE, not pried from outside.")
                                                .xPercent(70.0)
                                                .yPercent(52.0)
                                                .iconType("key")
                                                .linkedClueId("clue-staged-lock")
                                                .inspectionDialogue("Filing marks indicate this was staged to look like an external break-in.")
                                                .build()
                                ))
                                .build()
                ))
                .clues(List.of(
                        Clue.builder()
                                .id("clue-med-note")
                                .title("Torn Dosage Prescription")
                                .type("DOCUMENT")
                                .description("Prescription fragment instructing a paralyzing dosage increase signed by 'Dr. V.'")
                                .visualIcon("file-text")
                                .locationFound("Mahogany Desk, Study")
                                .forensicAnalysis("Ink chemical chromatography matches Dr. Vance's fountain pen.")
                                .isCrucial(true)
                                .build(),
                        Clue.builder()
                                .id("clue-sedative-goblet")
                                .title("Spiked Wine Goblet")
                                .type("FORENSIC")
                                .description("Traces of fast-acting sedative that rendered Lord Blackwood unable to cry out.")
                                .visualIcon("flask-conical")
                                .locationFound("Study Coffee Table")
                                .forensicAnalysis("Sedative is medical-grade, strictly restricted to licensed physicians.")
                                .isCrucial(true)
                                .build(),
                        Clue.builder()
                                .id("clue-secret-passage")
                                .title("Hidden Cliff Passage")
                                .type("OBJECT")
                                .description("A private tunnel leading straight to the private marina dock.")
                                .visualIcon("key")
                                .locationFound("Behind Bookshelf, Study")
                                .forensicAnalysis("Dust displacement indicates it was used within the last 4 hours.")
                                .isCrucial(false)
                                .build(),
                        Clue.builder()
                                .id("clue-orthopedic-shoe")
                                .title("Orthopedic Bootprint")
                                .type("PHOTO")
                                .description("High-definition forensic snapshot of distinctive tread impressions.")
                                .visualIcon("camera")
                                .locationFound("Rain-Swept Balcony")
                                .forensicAnalysis("Tread wear pattern matches Dr. Vance's right-foot limp.")
                                .isCrucial(true)
                                .build(),
                        Clue.builder()
                                .id("clue-staged-lock")
                                .title("Internally Cut Balcony Latch")
                                .type("OBJECT")
                                .description("Metal latch cut with wire cutters from within the room to fabricate an intruder narrative.")
                                .visualIcon("shield-alert")
                                .locationFound("Balcony French Doors")
                                .forensicAnalysis("No exterior tool marks or forced jimmy marks present.")
                                .isCrucial(true)
                                .build()
                ))
                .suspects(List.of(
                        Suspect.builder()
                                .id("suspect-dr-vance")
                                .name("Dr. Julian Vance")
                                .role("Personal Physician")
                                .age(54)
                                .relationship("Attending physician and executor of health estate")
                                .motive("Massive debt in offshore investments; Lord Blackwood planned to dismiss him next week.")
                                .alibi("Claims he was in the downstairs guest clinic reviewing patient charts all night.")
                                .avatarIcon("doctor")
                                .isCulprit(true)
                                .initialStatements(List.of(
                                        "I only prescribed Lord Blackwood mild herbal tea for his insomnia. I was in the west wing all night.",
                                        "Arthur was paranoid about burglars. Someone must have scaled the cliff!"
                                ))
                                .build(),
                        Suspect.builder()
                                .id("suspect-evelyn")
                                .name("Evelyn Blackwood")
                                .role("Estranged Heiress")
                                .age(28)
                                .relationship("Daughter")
                                .motive("Cut out of the family will two months ago in favor of an animal sanctuary.")
                                .alibi("Was seen by the butler on the patio smoking at 23:30.")
                                .avatarIcon("heiress")
                                .isCulprit(false)
                                .initialStatements(List.of(
                                        "My father and I had disagreements, but I would never harm him.",
                                        "I saw Dr. Vance carrying a heavy duffel bag down towards the boathouse before midnight."
                                ))
                                .build(),
                        Suspect.builder()
                                .id("suspect-butler-graves")
                                .name("Thomas Graves")
                                .role("Head Butler")
                                .age(61)
                                .relationship("Butler of 30 years")
                                .motive("None discovered; devoted to the Blackwood lineage.")
                                .alibi("Was securing the front perimeter gate with private security.")
                                .avatarIcon("butler")
                                .isCulprit(false)
                                .initialStatements(List.of(
                                        "Lord Blackwood explicitly asked for Dr. Vance to bring up his evening medication at 23:15.",
                                        "The study key was in my pocket the entire evening, sir."
                                ))
                                .build()
                ))
                .solution(CaseSolution.builder()
                        .culpritId("suspect-dr-vance")
                        .culpritName("Dr. Julian Vance")
                        .motive("Lord Blackwood had discovered Dr. Vance was embezzling funds from the estate medical foundation and was preparing to report him.")
                        .trueSequenceOfEvents("Dr. Vance served Lord Blackwood wine laced with medical tranquilizers. Once unconscious, Vance cut the balcony lock from inside to stage a burglary, then moved the victim through the secret bookshelf passage to a awaiting private vessel at the cliff dock.")
                        .crucialClueIds(List.of("clue-med-note", "clue-sedative-goblet", "clue-orthopedic-shoe", "clue-staged-lock"))
                        .confessionSnippet("Dr. Vance: 'He was going to ruin me over mere rounding errors! He wouldn't listen to reason!'")
                        .build())
                .build();

        // CASE 02
        Case case2 = Case.builder()
                .caseNumber("CASE-02")
                .title("The Midnight Penthouse Vault")
                .subtitle("A 50th-floor impenetrable safe, zero alarms triggered, and a $20M diamond gone.")
                .synopsis("The 'Heart of Kronos' diamond vanished from a biometric pressure-sensitive vault inside a luxury high-rise penthouse. The laser grid remained active, and the safe was opened using legitimate authorized credentials.")
                .difficulty("MASTERMIND")
                .estimatedTime("20-25 Mins")
                .crimeType("Grand Larceny & Cyber Sabotage")
                .timeOfCrime("03:12 AM — Nov 02")
                .location("Aegis Tower Penthouse, Suite 5000")
                .victimName("Marcus Sterling (Tech Tycoon)")
                .victimStatus("Unharmed")
                .briefingText("Detective: The security company swears the system was never breached from outside. Only three people held cryptographic keys to the vault. Analyze the terminal logs, thermal security tapes, and security bypass hardware.")
                .thumbnailTheme("vault")
                .scenes(List.of(
                        CrimeScene.builder()
                                .id("scene-penthouse-vault")
                                .name("The Laser Vault")
                                .subtitle("High-security reinforced chamber with active infrared beams")
                                .description("A gleaming titanium vault with a glass display pedestal standing empty in the center.")
                                .visualTheme("vault-room")
                                .ambientType("night_city")
                                .hotspots(List.of(
                                        Hotspot.builder()
                                                .id("hs-vault-pedestal")
                                                .title("Pressure-Plate Pedestal")
                                                .description("The pressure sensor was spoofed using an exact 3D-printed tungsten replica weight.")
                                                .xPercent(50.0)
                                                .yPercent(55.0)
                                                .iconType("safe")
                                                .linkedClueId("clue-tungsten-weight")
                                                .inspectionDialogue("A 3D-printed tungsten slug matches the exact weight of the diamond down to 0.01 grams.")
                                                .build(),
                                        Hotspot.builder()
                                                .id("hs-terminal-usb")
                                                .title("Sub-net Hardware Implant")
                                                .description("A miniature rogue Raspberry Pi microcontroller plugged behind the server rack.")
                                                .xPercent(82.0)
                                                .yPercent(68.0)
                                                .iconType("laptop")
                                                .linkedClueId("clue-rogue-device")
                                                .inspectionDialogue("Hardware device running a camera loop firmware script compiled by user 'CyberLead_K'.")
                                                .build()
                                ))
                                .build()
                ))
                .clues(List.of(
                        Clue.builder()
                                .id("clue-tungsten-weight")
                                .title("Calibrated Tungsten Counterweight")
                                .type("OBJECT")
                                .description("High-density 3D printed slug used to fool the pressure plate.")
                                .visualIcon("safe")
                                .locationFound("Vault Pedestal")
                                .forensicAnalysis("Manufactured using the high-precision 3D printer in the Chief Security Officer's lab.")
                                .isCrucial(true)
                                .build(),
                        Clue.builder()
                                .id("clue-rogue-device")
                                .title("Rogue Network Transceiver")
                                .type("OBJECT")
                                .description("Hardware interceptor that looped the CCTV video feed for 7 minutes.")
                                .visualIcon("laptop")
                                .locationFound("Server Rack")
                                .forensicAnalysis("Digital signature matches the private SSH key of Kira Vance, Chief Security Engineer.")
                                .isCrucial(true)
                                .build()
                ))
                .suspects(List.of(
                        Suspect.builder()
                                .id("suspect-kira")
                                .name("Kira Mercer")
                                .role("Chief Cybersecurity Architect")
                                .age(31)
                                .relationship("Head of building defense systems")
                                .motive("Recruited by an international syndicate with an offshore bounty.")
                                .alibi("Claims she was monitoring telemetry from the ground security office.")
                                .avatarIcon("business")
                                .isCulprit(true)
                                .initialStatements(List.of(
                                        "No one could have cracked my firewall. It's mathematically impossible unless someone stole my cryptographic key.",
                                        "I noticed a 3-second glitch in camera 4, but dismissed it as an auxiliary power fluctuation."
                                ))
                                .build()
                ))
                .solution(CaseSolution.builder()
                        .culpritId("suspect-kira")
                        .culpritName("Kira Mercer")
                        .motive("Kira used her insider privileges to plant the loop transceiver and swap the gem with a calibrated weight.")
                        .trueSequenceOfEvents("At 03:10 AM, Kira activated the rogue transceiver to broadcast a static loop to the control room. She walked into the vault using master admin credentials, swapped the diamond with the 3D-printed tungsten weight, and exited undetected.")
                        .crucialClueIds(List.of("clue-tungsten-weight", "clue-rogue-device"))
                        .confessionSnippet("Kira: 'The system was flawless. You just happened to look at the physical server rack.'")
                        .build())
                .build();

        caseRepository.saveAll(List.of(case1, case2));
        logger.info("Successfully seeded 2 detailed cold cases into MongoDB Atlas!");
    }
}
