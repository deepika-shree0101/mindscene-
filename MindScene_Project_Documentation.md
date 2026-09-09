# MINDSCENE: TACTICAL FORENSIC MYSTERY INVESTIGATION PLATFORM
## Comprehensive Architectural Blueprint, System Specification & Technical Documentation
**Document Version:** 2.4.0  
**Classification:** Confidential / Internal Engineering System Specification  
**Target Audience:** Senior Solutions Architects, Principal Full-Stack Engineers, Game Systems Designers, Security Auditors  
**Runtime Target:** Production Web-First Responsive Single Page Application (SPA) + Spring Boot Microservices  

---

## TABLE OF CONTENTS
- [1. PROJECT OVERVIEW](#1-project-overview)
  - [1.1 Project Name, One-Line Pitch & Elevator Description](#11-project-name-one-line-pitch--elevator-description)
  - [1.2 Problem Statement, Market Context & Target Audience](#12-problem-statement-market-context--target-audience)
  - [1.3 Platform Architecture & Hardware Form Factors](#13-platform-architecture--hardware-form-factors)
- [2. SCOPE OF THE PROJECT](#2-scope-of-the-project)
  - [2.1 In-Scope Features (Confirmed from Source Code)](#21-in-scope-features-confirmed-from-source-code)
  - [2.2 Out-of-Scope & Explicitly Excluded Architectural Boundaries](#22-out-of-scope--explicitly-excluded-architectural-boundaries)
  - [2.3 Phase Evolution: MVP Baseline vs. Production Release](#23-phase-evolution-mvp-baseline-vs-production-release)
- [3. TECH STACK](#3-tech-stack)
  - [3.1 Presentation Layer (Frontend Framework & Libraries)](#31-presentation-layer-frontend-framework--libraries)
  - [3.2 Languages, Type Systems & Compilers](#32-languages-type-systems--compilers)
  - [3.3 State Management & Reactive Data Flow](#33-state-management--reactive-data-flow)
  - [3.4 Navigation, Routing & Stage Pipeline Architecture](#34-navigation-routing--stage-pipeline-architecture)
  - [3.5 UI Component Styling, Shaders & Visual Engine](#35-ui-component-styling-shaders--visual-engine)
  - [3.6 Microservices Backend Architecture & API Gateways](#36-microservices-backend-architecture--api-gateways)
  - [3.7 Database, Object Document Mapping & Persistent Storage](#37-database-object-document-mapping--persistent-storage)
  - [3.8 Third-Party APIs, Browser Standards & Audio Synthesizers](#38-third-party-apis-browser-standards--audio-synthesizers)
  - [3.9 Build Tooling, Compilers, Bundlers & Dev Environments](#39-build-tooling-compilers-bundlers--dev-environments)
  - [3.10 Exhaustive End-to-End Dependency Inventory](#310-exhaustive-end-to-end-dependency-inventory)
- [4. FOLDER & FILE STRUCTURE](#4-folder--file-structure)
  - [4.1 Monorepo Top-Level Directory Topology](#41-monorepo-top-level-directory-topology)
  - [4.2 Client Frontend Directory Topology (Crime_Solver)](#42-client-frontend-directory-topology-crime_solver)
  - [4.3 Service Backend Directory Topology (service_backend)](#43-service-backend-directory-topology-service_backend)
  - [4.4 Architectural Patterns Applied](#44-architectural-patterns-applied)
  - [4.5 Configuration Files & Infrastructure Role Matrix](#45-configuration-files--infrastructure-role-matrix)
- [5. NAVIGATION MAP](#5-navigation-map)
  - [5.1 In-Memory Stage Pipeline Architecture](#51-in-memory-stage-pipeline-architecture)
  - [5.2 ASCII State Transition Flowchart](#52-ascii-state-transition-flowchart)
  - [5.3 Screen & Pipeline Route Specification Matrix](#53-screen--pipeline-route-specification-matrix)
  - [5.4 Deep Linking, Session Hydration & URL Tamper Resistance](#54-deep-linking-session-hydration--url-tamper-resistance)
- [6. SCREEN-BY-SCREEN BREAKDOWN](#6-screen-by-screen-breakdown)
  - [6.1 Holographic Terminal (Authentication & Agent Clearance)](#61-holographic-terminal-authentication--agent-clearance)
  - [6.2 Case Dashboard (Central Command & Dossier Catalog)](#62-case-dashboard-central-command--dossier-catalog)
  - [6.3 Case Briefing Dossier Modal](#63-case-briefing-dossier-modal)
  - [6.4 Crime Scene Explorer Engine (Multi-Room Orchestrator)](#64-crime-scene-explorer-engine-multi-room-orchestrator)
  - [6.5 ThreeSceneRoom (360° Spherical WebGL Environment)](#65-threesceneroom-360-spherical-webgl-environment)
  - [6.6 Evidence Inventory Vault (Evidence Storage & Status)](#66-evidence-inventory-vault-evidence-storage--status)
  - [6.7 Clue Inspect Modal & ThreeEvidenceViewer (3D Forensic Examination)](#67-clue-inspect-modal--threeevidenceviewer-3d-forensic-examination)
  - [6.8 AI Partner HUD (SPECTER Tactical Uplink)](#68-ai-partner-hud-specter-tactical-uplink)
  - [6.9 AI Interrogation Room & ThreeInterrogationCell (Suspect Confrontation)](#69-ai-interrogation-room--threeinterrogationcell-suspect-confrontation)
  - [6.10 Deduction Tribunal Modal (Case Indictment & Verdict)](#610-deduction-tribunal-modal-case-indictment--verdict)
  - [6.11 Atmosphere & Cinematic Engines (HorrorAmbience & ScaryVideoBackground)](#611-atmosphere--cinematic-engines-horrorambience--scaryvideobackground)
- [7. STATE MANAGEMENT DEEP DIVE](#7-state-management-deep-dive)
  - [7.1 Global Application State Architecture (AuthContext)](#71-global-application-state-architecture-authcontext)
  - [7.2 Reactive Data Flow Pipeline](#72-reactive-data-flow-pipeline)
  - [7.3 Local Persistence & Fault-Tolerant Mirroring](#73-local-persistence--fault-tolerant-mirroring)
  - [7.4 Data Caching, Optimistic UI & Sync Architecture](#74-data-caching-optimistic-ui--sync-architecture)
- [8. REUSABLE COMPONENTS LIBRARY](#8-reusable-components-library)
  - [8.1 UI & Utility Component Catalog](#81-ui--utility-component-catalog)
  - [8.2 Component Interface Contracts & Prop Definitions](#82-component-interface-contracts--prop-definitions)
- [9. DESIGN SYSTEM](#9-design-system)
  - [9.1 Visual Theme & Aesthetic Philosophy (Midnight Noir / Cyberpunk)](#91-visual-theme--aesthetic-philosophy-midnight-noir--cyberpunk)
  - [9.2 Color Palette Token Specification](#92-color-palette-token-specification)
  - [9.3 Typography Scale & Font Families](#93-typography-scale--font-families)
  - [9.4 Spatial System, Grids & Responsive Conventions](#94-spatial-system-grids--responsive-conventions)
  - [9.5 Iconography Catalog & Lucide Integration](#95-iconography-catalog--lucide-integration)
- [10. KEY USER FLOWS (END TO END)](#10-key-user-flows-end-to-end)
  - [10.1 Flow 1: Agent Authentication & Session Hydration](#101-flow-1-agent-authentication--session-hydration)
  - [10.2 Flow 2: Case Selection, Briefing & Sequential Multi-Room Exploration](#102-flow-2-case-selection-briefing--sequential-multi-room-exploration)
  - [10.3 Flow 3: Clue Discovery & 3D Interactive Inspection](#103-flow-3-clue-discovery--3d-interactive-inspection)
  - [10.4 Flow 4: Suspect Interrogation & Psychological Pressure Breakdown](#104-flow-4-suspect-interrogation--psychological-pressure-breakdown)
  - [10.5 Flow 5: Tribunal Deduction, Indictment Evaluation & Case Resolution](#105-flow-5-tribunal-deduction-indictment-evaluation--case-resolution)
- [11. PERMISSIONS & DEVICE FEATURES](#11-permissions--device-features)
  - [11.1 Web Standards & Hardware Acceleration Utilization](#111-web-standards--hardware-acceleration-utilization)
  - [11.2 Hardware Capabilities & API Interactions](#112-hardware-capabilities--api-interactions)
  - [11.3 Fallback Mechanics for Constrained Client Environments](#113-fallback-mechanics-for-constrained-client-environments)
- [12. BUILD & DEPLOYMENT](#12-build--deployment)
  - [12.1 Frontend Build Tooling & Optimization (vite.config.ts)](#121-frontend-build-tooling--optimization-viteconfigts)
  - [12.2 Backend Containerization & Multi-Stage Dockerfile](#122-backend-containerization--multi-stage-dockerfile)
  - [12.3 Reverse Proxy & API Gateway Routing (netlify.toml / _redirects)](#123-reverse-proxy--api-gateway-routing-netlifytoml--_redirects)
  - [12.4 Environment Variables & Secret Configuration Matrix](#124-environment-variables--secret-configuration-matrix)
  - [12.5 Production CI/CD Pipeline & Deployment Topology](#125-production-cicd-pipeline--deployment-topology)
- [13. KNOWN LIMITATIONS & TECH DEBT](#13-known-limitations--tech-debt)
  - [13.1 Hardcoded Values & Monolithic Mock Datasets](#131-hardcoded-values--monolithic-mock-datasets)
  - [13.2 WebGL & Rendering Performance Constraints](#132-webgl--rendering-performance-constraints)
  - [13.3 Security Considerations & Client-Side Verification](#133-security-considerations--client-side-verification)
  - [13.4 Accessibility (a11y) Considerations](#134-accessibility-a11y-considerations)
- [14. FUTURE ROADMAP](#14-future-roadmap)
  - [14.1 Phase I: Multiplayer Cooperative Investigation](#141-phase-i-multiplayer-cooperative-investigation)
  - [14.2 Phase II: Procedurally Generated Crime Scenes & LLM Synthesis](#142-phase-ii-procedurally-generated-crime-scenes--llm-synthesis)
  - [14.3 Phase III: Native Mobile Packaging & VR/WebXR Port](#143-phase-iii-native-mobile-packaging--vrwebxr-port)
- [15. APPENDIX](#15-appendix)
  - [15.1 Domain Glossary](#151-domain-glossary)
  - [15.2 External API & Library Reference Directory](#152-external-api--library-reference-directory)

---

# 1. PROJECT OVERVIEW

### 1.1 Project Name, One-Line Pitch & Elevator Description
- **Confirmed from code:** The system is officially named **MindScene** (identified across codebase repositories, configurations, and package structures as `Crime_Solver`, `service-backend`, and `CIB Tactical Forensic System`).
- **One-Line Pitch:** An immersive, web-based tactical forensic detective simulator integrating 3D WebGL spatial crime scene exploration, dynamic flashlight raycasting, psychological natural-language suspect interrogation, and deduction tribunal mechanics.
- **Elevator Description:** MindScene casts users into the role of a Central Intelligence Bureau (CIB) field detective deployed to investigate complex homicides spanning cybernetic corporate warfare, occult ritualistic murders, and clandestine biochemical assassinations. Investigators navigate multi-chambered crime scenes rendered through an interchangeable dual-engine viewport: an immersive 360-degree spherical 3D environment powered by Three.js and an atmospheric 2.5D planar raycast scanner. Utilizing simulated directional spotlights and UV blacklights, players search darkened environments for latent fingerprints, forensic residue, and hidden physical artifacts. Secured evidence is cataloged in a forensic vault, examined via an interactive 3D model viewer, cross-referenced during natural-language suspect interrogations with real-time psychological stress tracking, and evaluated alongside tactical advice from an AI partner (SPECTER) to formulate authoritative indictments before the Departmental Tribunal.

### 1.2 Problem Statement, Market Context & Target Audience
- **The Problem It Solves:** Digital mystery and puzzle games frequently suffer from two major flaws:
  1. *Lack of Spatial Agency:* Traditional detective titles often rely on static point-and-click pixel hunts or visual novel slides, disconnecting players from the physical geography of the crime scene.
  2. *Rigid Scripting:* Interrogations typically employ rigid multiple-choice dialogue trees that give away answers and fail to simulate true psychological pressure.
  3. *Cloud-Coupled Fragility:* Browser-based games that rely strictly on remote APIs crash or become completely unplayable if server cold-starts occur or if network connectivity falters.
- **MindScene's Architectural Solution:**
  - Integrates hardware-accelerated 3D WebGL panoramic exploration directly inside modern web browsers without external plugins or heavy runtime engines.
  - Implements an adaptive natural-language suspect dialogue engine (`suspectDialogueEngine.ts`) that extracts semantic intent, calculates emotional stress, and extracts confessions dynamically.
  - Implements an **Offline-First Fault-Tolerant Mirroring Architecture**: if cloud microservices are disconnected, the client seamlessly initializes bundled departmental dossiers (`defaultCases.ts`) and local user credentials, guaranteeing 100% operational uptime.
- **Target Audience:**
  - Forensic and investigative puzzle enthusiasts (fans of *Return of the Obra Dinn*, *Ace Attorney*, *Her Story*, *L.A. Noire*).
  - Academic institutions and cybersecurity cohorts seeking practical simulations of chain-of-custody protocols, inductive reasoning, and evidence synthesis.
  - Casual and hardcore gamers desiring dark, atmospheric cyberpunk/noir mystery experiences within an instant-load web application.

### 1.3 Platform Architecture & Hardware Form Factors
- **Confirmed from code:** MindScene is architected as an ultra-responsive, web-first Single Page Application (SPA) targeting modern HTML5/WebGL2 standards.
- **Platform Breakdown:**
  - **Desktop / Laptop Browsers (Primary Target):** Optimized for mouse-driven raycast flashlight beams, keyboard input hotkeys, hardware mouse dragging for 360° camera orbit, and high-fidelity Web Audio synthesis.
  - **Mobile & Tablet Web Browsers (Responsive Target):** Fully responsive touch-adapted layout using viewport percentage coordinate transformations (`clientX`/`clientY` vs `touchmove`), collapsible sidebars, dynamic full-screen toggling via HTML5 Fullscreen API, and touch-drag camera manipulation.
- **Platform Clarification:** *Inferred:* The codebase does not contain React Native, Expo, Flutter, or native Android/iOS compilation manifests. It is deliberately designed as a universal Web application that can be packaged into native mobile wrappers (e.g., Capacitor, Cordova, or Android WebView) without modification. Device hardware access (GPU, sound, display) is executed exclusively through W3C standard Web APIs: WebGL 2.0, Web Audio API, Fullscreen API, and Web Speech Synthesis API.

---

# 2. SCOPE OF THE PROJECT

### 2.1 In-Scope Features (Confirmed from Source Code)
The following capabilities are implemented, operational, and verified in the source code:

1. **Cyberpunk Noir Authentication Gateway (`HolographicTerminal.tsx`):**
   - Stateless JWT authentication backed by Spring Security 6 and BCrypt password encryption.
   - Dual-mode terminal interface supporting registered agent login and clearance request (registration).
   - Dynamic terminal boot animation with simulated memory diagnostics and phosphorescent text.
   - Instant Guest Agent Clearance bypassing backend cold-starts during offline demonstrations.

2. **CIB Command Headquarters & Case Selection Hub (`CaseDashboard.tsx`):**
   - Interactive incident dossier catalog displaying title, case number, difficulty classification, victim summary, estimated completion time, and room count.
   - Real-time agent badge displaying security clearance level, solved case count, and cumulative departmental investigation score.
   - Clearance stamps dynamically overlaid on previously resolved homicide files.

3. **Classified Operational Briefing Dossier (`CaseBriefingModal.tsx`):**
   - Deep tactical briefing modal displaying classified departmental dossiers, victim autopsy overview (time of death, cause of death), primary suspect profiles, and operational parameters before deployment.

4. **Dual-Engine Crime Scene Explorer (`CrimeSceneExplorer.tsx`):**
   - **3D WebGL Spherical Viewport (`ThreeSceneRoom.tsx`):** Panoramic 360° camera orbit inside an equirectangular environment with dynamic mouse-tracking spotlight and pulsing 3D spatial hotspot beacons.
   - **2.5D Planar Raycast Flashlight Scanner:** Euclidean distance calculation projecting a realistic flashlight cone from mouse/touch coordinates over dark rooms.
   - **Forensic UV Blacklight & Night Vision Modes:** Alternate visual spectrums exposing fluorescent bloodstains, chemical markers, and latent prints.
   - **Sequential Multi-Room Progression Gate:** Multi-chamber crime scenes locked behind room-clearance gates, requiring complete evidence discovery in preceding rooms before unlocking subsequent areas.
   - **Proximity Biometric Audio Feedback:** Real-time procedural heartbeat pulses synthesized via Web Audio API when approaching concealed evidence.

5. **3D Interactive Evidence Vault & Clue Inspection (`EvidenceInventory.tsx`, `ClueInspectModal.tsx`, `ThreeEvidenceViewer.tsx`):**
   - Slide-over evidence vault cataloging all secured clues with room origin tags and forensic classifications.
   - Real-time 3D WebGL mesh viewer rendering procedural geometries (weapons, cyber drives, chemical vials, burner phones, artifacts) with user-controlled orbital rotation and zoom.
   - Forensic laboratory dossier displaying chain of custody, chemical signatures, physical dimensions, and tactical deduction importance.

6. **Natural Language Suspect Interrogation Chamber (`AiInterrogationRoom.tsx`, `ThreeInterrogationCell.tsx`, `suspectDialogueEngine.ts`):**
   - Natural language dialogue interface accepting free-form text input without grammatical rigidity.
   - Multi-turn psychological stress engine tracking emotional state (Calm $\rightarrow$ Agitated $\rightarrow$ Defensive $\rightarrow$ Broken).
   - 3D WebGL cell rendering with tension-reactive volumetric lighting shifting from cyan to alarm crimson as stress escalates.
   - Speech synthesis integration reading suspect responses aloud in real-time.

7. **Tactical AI Partner Comms Link (`AiPartnerHUD.tsx`):**
   - Draggable, minimizable floating HUD terminal simulating encrypted comms with CIB Field Advisor AI "SPECTER".
   - Contextual hint generation analyzing remaining unfound clues and suspect contradictions.

8. **Departmental Tribunal Deduction Engine (`DeductionModal.tsx`):**
   - Formal multi-tier indictment questionnaire evaluating suspect identity, murder weapon, motive, and opportunity sequence.
   - Confetti celebratory particle explosions and score awards on successful case resolution.
   - Comprehensive tactical failure debriefs on incorrect indictments.

9. **Procedural Horror Ambience & Video Systems (`HorrorAmbience.tsx`, `ScaryVideoBackground.tsx`, `soundEngine.ts`):**
   - Web Audio API procedural sound synthesizer generating real-time scanner hums, camera shutter clicks, access denial buzzers, and keystroke audio without static audio files.
   - Sub-bass ambient drone oscillator and randomized lightning strobe screen flashes.
   - Seamless looping noir video background streams.

### 2.2 Out-of-Scope & Explicitly Excluded Architectural Boundaries
The following features are intentionally out-of-scope in the current codebase:
- **Synchronous Multiplayer / Collaborative Netcode:** No WebSocket multi-agent cursor syncing or shared lobby systems; gameplay is single-player client-authoritative.
- **Native Hardware Push Notifications:** No APNs or FCM push services.
- **In-Game Purchases & Monetization:** No microtransactions, ads, or paywalled cases.
- **WebXR / 6DoF Hardware VR Tracking:** Navigation is optimized for mouse/touch coordinates rather than VR spatial motion controllers.

### 2.3 Phase Evolution: MVP Baseline vs. Production Release
| System Dimension | MVP Architecture (v1.0.0) | Current Production Release (v2.4.0) |
| :--- | :--- | :--- |
| **Room Architecture** | Single static 2D image per case | 3 to 4 sequential rooms per case with lock gates |
| **Scene Viewport** | 2D Flashlight pointer overlay only | Interchangeable Dual-Engine: 3D 360° Spherical + 2D Planar |
| **Clue Inspection** | 2D PNG thumbnail popups | Interactive Three.js 3D WebGL rotating mesh models |
| **Interrogation** | 3 static pre-scripted radio buttons | Multi-turn NLP intent matcher with psychological stress meter |
| **Audio Engine** | Silent / Browser alert beeps | Procedural Web Audio synthesizer + sub-bass drone oscillator |
| **Backend Integration** | In-memory client arrays | Spring Boot 3 REST API + JWT + MongoDB + Offline Fallback |
| **Case Content** | 1 demo case (3 clues) | 5 extensive cases across 18 unique rooms and 25+ forensic clues |

---

# 3. TECH STACK

### 3.1 Presentation Layer (Frontend Framework & Libraries)
- **React (v19.2.8):** Modern functional component architecture utilizing standard hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `useContext`).
- **React DOM (v19.2.8):** Client-side rendering and DOM reconciliation.
- **Three.js (v0.185.1):** Hardware-accelerated 3D graphics engine powering spherical scene panoramas, volumetric lighting, and interactive evidence meshes.
- **Lucide React (v1.34.0):** Comprehensive SVG iconography suite providing scalable UI symbols.
- **Canvas-Confetti (v1.9.4):** High-performance 2D canvas particle animation engine utilized during case victory sequences.
- **Clsx (v2.1.1) & Tailwind Merge (v3.6.0):** Predictable utility-class composition preventing conflicting CSS cascade rules.

### 3.2 Languages, Type Systems & Compilers
- **TypeScript (v6.0.2):** Static typing across all components, interfaces, DTOs, and game mechanics.
- **Java (Version 17 LTS):** Strongly typed backend language utilizing records, switch pattern matching, and sealed classes.

### 3.3 State Management & Reactive Data Flow
- **React Context API (`AuthContext.tsx`):** Centralized global authentication state, token storage, and offline user profiling.
- **In-Memory Component State Machines:** `CrimeSceneExplorer` acts as a finite state orchestrator managing discovery lists, active room pointers, timers, and modal states.
- **Synchronous LocalStorage Driver:** Client persistence layer for tokens (`cib_token`), local user records (`cib_local_user`), and cleared case scores (`cib_local_scores`).

### 3.4 Navigation, Routing & Stage Pipeline Architecture
- **In-Memory Stage Router (`App.tsx`):** State-driven stage transitions (`HolographicTerminal` $\rightarrow$ `CaseDashboard` $\rightarrow$ `CaseBriefingModal` $\rightarrow$ `CrimeSceneExplorer`). Decoupled from URL parameters to prevent state tampering or spoiler exposure.

### 3.5 UI Component Styling, Shaders & Visual Engine
- **Tailwind CSS (v4.3.3) via `@tailwindcss/vite`:** Next-generation utility-first styling pipeline with zero runtime CSS extraction.
- **CSS3 Keyframe Animations (`index.css`):** Custom keyframe sequences for scanlines, CRT screen flicker, lightning strobes, and discovery flashes.
- **Google Fonts:** Embedded `Creepster` display typography paired with system monospace fonts.

### 3.6 Microservices Backend Architecture & API Gateways
- **Spring Boot (v4.1.1 Starter Parent):** Enterprise-grade REST microservice framework.
- **Spring Security (v6+):** Stateless filter chain, BCrypt password encryption, and role-based endpoint authorization.
- **Spring Data MongoDB:** Object-Document Mapping (ODM) repository layer providing CRUD abstractions and MongoDB Atlas cluster connectivity.
- **Spring Validation:** Jakarta Bean Validation on all incoming API request DTOs.

### 3.7 Database, Object Document Mapping & Persistent Storage
- **MongoDB Atlas (v7.0+ Compatible):** Cloud-hosted distributed NoSQL document database. Stores user credentials, case dossiers, room configurations, and investigator progression.

### 3.8 Third-Party APIs, Browser Standards & Audio Synthesizers
- **HTML5 Web Audio API:** In-browser procedural sound synthesis engine (`soundEngine.ts`) executing software oscillators, gain nodes, and biquad filters without audio asset loading overhead.
- **HTML5 Fullscreen API:** Display capture mode maximizing the game viewport.
- **HTML5 Web Speech API (`speechSynthesis`):** Browser speech synthesis engine delivering spoken voice audio for suspect interrogations.
- **WebGL 2.0:** Direct GPU hardware acceleration for Three.js rendering pipelines.

### 3.9 Build Tooling, Compilers, Bundlers & Dev Environments
- **Vite (v8.2.2):** High-speed frontend development server and Rollup production bundler.
- **Apache Maven (v3.9.6):** Java build lifecycle management and dependency compilation.
- **Docker:** Multi-stage container engine producing lightweight Alpine JRE 17 images.

---

### 3.10 Exhaustive End-to-End Dependency Inventory

#### Frontend Dependency Specification (`client_frontend/Crime_Solver/package.json`)
| Package Name | Version | Scope | Architectural Purpose |
| :--- | :--- | :--- | :--- |
| `react` | `^19.2.8` | Production | Component lifecycle, virtual DOM reconciliation, and core UI rendering |
| `react-dom` | `^19.2.8` | Production | Browser DOM mounting and portal rendering |
| `three` | `^0.185.1` | Production | WebGL 3D rendering for spherical rooms, 3D evidence meshes, and lighting |
| `lucide-react` | `^1.34.0` | Production | High-performance vector iconography library |
| `canvas-confetti` | `^1.9.4` | Production | Hardware-accelerated particle animation engine for case victories |
| `clsx` | `^2.1.1` | Production | Dynamic class name condition evaluator |
| `tailwind-merge` | `^3.6.0` | Production | Conflict-free Tailwind CSS class merging |
| `tailwindcss` | `^4.3.3` | Production | Utility-first CSS framework |
| `@tailwindcss/vite` | `^4.3.3` | Development | Vite compiler plugin for Tailwind CSS v4 |
| `vite` | `^8.2.2` | Development | Development server, HMR engine, and Rollup bundler |
| `typescript` | `~6.0.2` | Development | Static typing, interface contracts, and compilation |
| `@types/react` | `^19.2.18` | Development | TypeScript definitions for React 19 core |
| `@types/react-dom` | `^19.2.4` | Development | TypeScript definitions for React DOM |
| `@types/three` | `^0.185.4` | Development | TypeScript definitions for Three.js graphics library |
| `@types/canvas-confetti`| `^1.9.0` | Development | TypeScript definitions for Canvas Confetti |
| `@types/node` | `^24.13.3` | Development | TypeScript definitions for Node.js platform APIs |
| `eslint` | `^10.9.0` | Development | Code quality and architectural linting engine |
| `@eslint/js` | `^10.0.1` | Development | ESLint recommended JavaScript ruleset |
| `eslint-plugin-react-hooks` | `^7.1.1` | Development | Enforces React hook lifecycle correctness |
| `eslint-plugin-react-refresh` | `^0.5.4` | Development | Hot-reload integration for React components |
| `typescript-eslint` | `^8.67.0` | Development | TypeScript parser and ruleset for ESLint |
| `globals` | `^17.11.0` | Development | Standard global execution environment definitions |

#### Backend Dependency Specification (`service_backend/pom.xml`)
| Artifact ID | Version | Scope | Architectural Purpose |
| :--- | :--- | :--- | :--- |
| `spring-boot-starter-data-mongodb` | Inherited (4.1.1) | Compile | MongoDB document repository layer and reactive driver |
| `spring-boot-starter-security` | Inherited (4.1.1) | Compile | Authentication, authorization, filter chains, and BCrypt |
| `spring-boot-starter-validation` | Inherited (4.1.1) | Compile | Jakarta Bean Validation for incoming REST controller DTOs |
| `spring-boot-starter-webmvc` | Inherited (4.1.1) | Compile | Servlet-based Spring MVC REST controller dispatching |
| `jjwt-api` | `0.13.0` | Compile | JSON Web Token interface definitions |
| `jjwt-impl` | `0.13.0` | Runtime | JJWT cryptographic implementation library |
| `jjwt-gson` | `0.13.0` | Runtime | JSON serializer/deserializer mapping JWT claims via Gson |
| `spring-dotenv` | `4.0.0` | Compile | Automates loading `.env` environment variables into Spring context |
| `lombok` | Inherited (4.1.1) | Optional | Compile-time bytecode generation for getters, setters, constructors |
| `spring-boot-devtools` | Inherited (4.1.1) | Runtime | Live reloading and debugging support during development |
| `spring-boot-starter-data-mongodb-test`| Inherited (4.1.1)| Test | Testing utilities for MongoDB repositories |
| `spring-boot-starter-security-test`| Inherited (4.1.1)| Test | Testing framework for Spring Security authentication contexts |
| `spring-boot-starter-validation-test`| Inherited (4.1.1)| Test | Testing framework for Jakarta Bean Validation |
| `spring-boot-starter-webmvc-test`| Inherited (4.1.1)| Test | MockMvc testing suite for REST controller endpoints |

---

# 4. FOLDER & FILE STRUCTURE

### 4.1 Monorepo Top-Level Directory Topology
```
d:/AI_Crime_Solver/
├── .env                              # Environment variable configuration (MongoDB URI, JWT secret)
├── .gitignore                        # Git exclusion rules (node_modules, target, dist, logs)
├── Dockerfile                        # Multi-stage container manifest for backend service
├── netlify.toml                      # Netlify build, SPA rewrite, and reverse-proxy specification
├── README.md                         # Project summary and quickstart documentation
├── MindScene_Project_Documentation.md# Comprehensive 35-page technical specification document
├── client_frontend/                  # Client-side presentation layer workspace
│   └── Crime_Solver/                 # React 19 + TypeScript + Vite project root
└── service_backend/                  # Java 17 + Spring Boot 3 enterprise microservice
    ├── mvnw                          # Maven wrapper script for Unix
    ├── mvnw.cmd                      # Maven wrapper script for Windows
    ├── pom.xml                       # Maven Project Object Model manifest
    └── src/                          # Backend Java source tree
```

### 4.2 Client Frontend Directory Topology (`Crime_Solver`)
```
client_frontend/Crime_Solver/
├── index.html                        # HTML5 single-page root entry, viewport & meta tags
├── package.json                      # Frontend dependency and build scripts manifest
├── tsconfig.json                     # TypeScript compiler configuration (ESNext, Strict)
├── tsconfig.app.json                 # Client application TypeScript sub-configuration
├── tsconfig.node.json                # Node/Vite build tooling TypeScript configuration
├── vite.config.ts                    # Vite build pipeline & Tailwind v4 plugin configuration
├── public/                           # Static assets served directly at domain root
│   ├── _redirects                    # Netlify SPA fallback & API gateway proxy rules
│   └── favicon.ico                   # Application browser tab icon
└── src/                              # Source code directory
    ├── App.css                       # Component-level styling overrides
    ├── App.tsx                       # Root orchestrator & stage-based view pipeline
    ├── index.css                     # Master Tailwind v4 imports, keyframes & theme definitions
    ├── main.tsx                      # DOM root mount script with React.StrictMode
    ├── assets/                       # Static graphics, SVG emblems, and hero banners
    │   ├── hero.png                  # Noir detective promotional banner
    │   ├── react.svg                 # React brandmark
    │   └── vite.svg                  # Vite brandmark
    ├── components/                   # Modular UI & Game Component Architecture
    │   ├── AiInterrogationRoom.tsx   # Suspect cross-examination chamber with stress meter
    │   ├── AiPartnerHUD.tsx          # Floating draggable tactical AI assistant (SPECTER)
    │   ├── CaseBriefingModal.tsx     # Pre-deployment case briefing & dossier review modal
    │   ├── CaseDashboard.tsx         # Active case selection dashboard & agent status bar
    │   ├── ClueInspectModal.tsx      # Deep forensic examination modal with 3D model viewport
    │   ├── CrimeSceneExplorer.tsx    # Master investigation screen (Dual 2D/3D engine orchestrator)
    │   ├── DeductionModal.tsx        # Final tribunal indictment questionnaire & scoring
    │   ├── ErrorBoundary.tsx         # React component error boundary preventing catastrophic crashes
    │   ├── EvidenceInventory.tsx     # Slide-over evidence vault & collected clue inspector
    │   ├── FullscreenButton.tsx      # HTML5 Fullscreen API toggle control
    │   ├── HolographicTerminal.tsx   # Cyberpunk agent authentication & terminal login screen
    │   ├── HorrorAmbience.tsx        # Ambient sound synthesizer & visual lightning strobe
    │   ├── ScaryVideoBackground.tsx  # Dynamic looping atmospheric video/canvas background
    │   ├── ThreeEvidenceViewer.tsx   # Three.js 3D WebGL renderer for interactive evidence meshes
    │   ├── ThreeInterrogationCell.tsx# Three.js 3D WebGL cell rendering with dynamic tension lighting
    │   └── ThreeSceneRoom.tsx        # Three.js 360° spherical room with interactive hotspot beacons
    ├── context/                      # React Context providers
    │   └── AuthContext.tsx           # Global authentication state, JWT storage & offline fallback
    ├── data/                         # Hardcoded offline datasets & bundled cases
    │   └── defaultCases.ts           # 5 Comprehensive CIB case files spanning 18 unique rooms
    ├── types/                        # TypeScript domain interfaces & data contracts
    │   └── index.ts                  # Type definitions for Case, Scene, Clue, Hotspot, User
    └── utils/                        # Procedural engines & computational utilities
        ├── soundEngine.ts            # Web Audio API procedural sound synthesizer
        └── suspectDialogueEngine.ts  # NLP intent matcher, stress calculator & suspect response engine
```

### 4.3 Service Backend Directory Topology (`service_backend`)
```
service_backend/
├── pom.xml                           # Maven build manifest & dependency tree
└── src/
    ├── main/
    │   ├── java/com/mysterygame/servicebackend/
    │   │   ├── ServiceBackendApplication.java     # Spring Boot entrypoint & main method
    │   │   ├── config/                            # Framework & database configuration
    │   │   │   ├── DataSeeder.java                # Automatic MongoDB database initialization & seeder
    │   │   │   └── MongoConfig.java               # Custom MongoDB auditing & conversion rules
    │   │   ├── controller/                        # REST API Controller layer
    │   │   │   ├── AiController.java              # AI detective hint & interrogation endpoints
    │   │   │   ├── AuthController.java            # JWT registration & authentication endpoints
    │   │   │   └── CaseController.java            # Case dossier retrieval & deduction evaluation
    │   │   ├── dto/                               # Data Transfer Objects (Request/Response)
    │   │   │   ├── AiChatRequest.java             # Payload for AI partner consultations
    │   │   │   ├── AiChatResponse.java            # Formatted AI partner advice response
    │   │   │   ├── AuthResponse.java              # JWT token and user clearance response
    │   │   │   ├── ClueDiscoverRequest.java       # Hotspot click synchronization payload
    │   │   │   ├── DeductionEvaluationResponse.java # Tribunal verdict & score report
    │   │   │   ├── DeductionSubmitRequest.java    # Player's final case deduction submission
    │   │   │   ├── LoginRequest.java              # Agent username & password credentials
    │   │   │   ├── RegisterRequest.java           # Clearance request credentials payload
    │   │   │   └── UserProgressDto.java           # Case progress & solved status representation
    │   │   ├── model/                             # MongoDB Document Entity models
    │   │   │   ├── Case.java                      # Case schema with embedded scenes and clues
    │   │   │   ├── CaseSolution.java              # Authoritative answer key for deductions
    │   │   │   ├── Clue.java                      # Forensic evidence document model
    │   │   │   ├── CrimeScene.java                # Scene chamber model with hotspots
    │   │   │   ├── Hotspot.java                   # Interactive coordinate target model
    │   │   │   ├── Suspect.java                   # Suspect personality profile & testimony
    │   │   │   ├── User.java                      # User account document model with BCrypt hash
    │   │   │   └── UserProgress.java              # Player progression tracking entity
    │   │   ├── repository/                        # Spring Data MongoDB repositories
    │   │   │   ├── CaseRepository.java            # Case document query interface
    │   │   │   ├── UserProgressRepository.java    # User progress persistence interface
    │   │   │   └── UserRepository.java            # User credentials lookup interface
    │   │   ├── security/                          # Security filters & JWT handling
    │   │   │   ├── AuthEntryPointJwt.java         # 401 Unauthorized exception handler
    │   │   │   ├── AuthTokenFilter.java           # Per-request JWT Bearer token validator
    │   │   │   ├── JwtUtils.java                  # Cryptographic JWT signing & claims parsing
    │   │   │   ├── SecurityConfig.java            # Spring Security 6 filter chain & CORS config
    │   │   │   ├── UserDetailsImpl.java           # Principal implementation for Spring Security
    │   │   │   └── UserDetailsServiceImpl.java    # UserDetailsService loading users from Mongo
    │   │   └── service/                           # Business logic layer
    │   │       ├── AiDetectiveService.java        # Algorithmic hint generator & reasoning
    │   │       └── CaseService.java               # Case management, discovery & deduction scoring
    │   └── resources/
    │       └── application.properties             # Spring configuration (ports, Mongo URI, JWT)
    └── test/                                      # Unit & integration test suites
```

### 4.4 Architectural Patterns Applied
1. **Decoupled Client-Service Architecture:** Frontend and backend are completely decoupled. The frontend communicates with the backend exclusively via JSON REST over HTTPS.
2. **Layered Enterprise Architecture (Backend):** Controller $\rightarrow$ Service $\rightarrow$ Repository $\rightarrow$ Database.
3. **Finite State Machine / Stage Router (Frontend):** State-driven stage transitions (`App.tsx`) prevent direct route jumping and protect game integrity.
4. **Offline First / Fault-Tolerant Mirroring:** The frontend features automatic fallback mechanisms. If the backend microservice is offline, the client seamlessly hydrates bundled case dossiers and maintains local progression.

### 4.5 Configuration Files & Infrastructure Role Matrix
| File Path | Technology | Functional Role |
| :--- | :--- | :--- |
| `netlify.toml` | Netlify PaaS | Configures build directories, output targets, and SPA routing rewrites |
| `client_frontend/Crime_Solver/public/_redirects` | Netlify Proxy | Maps `/api/*` requests directly to Render backend while routing SPA paths to `index.html` |
| `vite.config.ts` | Vite Tooling | Configures React compilation, Tailwind CSS v4 pipeline, and local dev server port |
| `Dockerfile` | Docker Engine | Defines multi-stage build: Maven 3.9 build stage $\rightarrow$ Eclipse Temurin 17 JRE Alpine runtime |
| `application.properties` | Spring Boot | Configures server port, MongoDB connection URI, JWT secret, and CORS origins |

---

# 5. NAVIGATION MAP

### 5.1 In-Memory Stage Pipeline Architecture
Traditional web applications rely on browser URL routing (`react-router-dom`), exposing internal route paths (e.g. `/cases/case-01/room-3/deduction`). In an investigative forensic game, standard browser navigation presents severe architectural risks:
1. **Spoiler & Cheat Vulnerability:** Players can bypass evidentiary collection by directly manipulating the browser URL bar.
2. **State Decoupling:** Crime scene timers, active 3D camera matrices, ambient flashlight coordinates, and discovery arrays can easily desynchronize from remote URL parameters.
3. **Immersive Breakage:** Standard browser back/forward buttons trigger page reloads that destroy active WebGL contexts and AudioContext oscillators.

To resolve these challenges, MindScene implements an **In-Memory Sequential Stage Router** inside `App.tsx` and `CrimeSceneExplorer.tsx`. All state transitions are guarded by deterministic verification logic, ensuring that investigators cannot advance to subsequent stages without fulfilling strict forensic prerequisites.

### 5.2 ASCII State Transition Flowchart
```
                           +------------------------+
                           |  UNAUTHENTICATED USER  |
                           +------------------------+
                                       |
                                       | [Enter Credentials / Guest Mode]
                                       v
                           +------------------------+
                           |  HolographicTerminal   |
                           |  (Login / Register)    |
                           +------------------------+
                                       |
                                       | [JWT Issued / Local User Hydrated]
                                       v
                           +------------------------+
                           |     CaseDashboard      | <==========================+
                           |  (Select Case Dossier) |                            |
                           +------------------------+                            |
                                       |                                         |
                                       | [Click Case Card]                       |
                                       v                                         |
                           +------------------------+                            |
                           |   CaseBriefingModal    |                            |
                           |  (Review Dossier/Map)  |                            |
                           +------------------------+                            |
                                       |                                         |
                                       | [Initiate Investigation]                |
                                       v                                         |
          +==========================================================+           |
          |               CRIME SCENE EXPLORER ENGINE                |           |
          |                                                          |           |
          |  +----------------------------------------------------+  |           |
          |  |  STAGE 1: Crime Scene Navigation (3D or 2D)        |  |           |
          |  |  - ThreeSceneRoom (360° Spherical Mesh View)       |  |           |
          |  |  - 2D Raycast Flashlight & UV Spectrum Scanner     |  |           |
          |  +----------------------------------------------------+  |           |
          |               |                         |                |           |
          |  [Click Hotspot/Clue]        [All Room Clues Found]      |           |
          |               v                         v                |           |
          |  +-----------------------+  +-----------------------+    |           |
          |  | Clue Secured to Vault |  | Unlock Next Chamber   |    |           |
          |  +-----------------------+  +-----------------------+    |           |
          |               |                         |                |           |
          |               +------------+------------+                |           |
          |                            |                             |           |
          |       [All Rooms Cleared & All Clues Secured]            |           |
          |                            v                             |           |
          |  +----------------------------------------------------+  |           |
          |  |  STAGE 2: Evidence Vault & 3D Model Inspection     |  |           |
          |  |  - EvidenceInventory & ThreeEvidenceViewer         |  |           |
          |  +----------------------------------------------------+  |           |
          |                            |                             |           |
          |       [Open Interrogation Pipeline]                      |           |
          |                            v                             |           |
          |  +----------------------------------------------------+  |           |
          |  |  STAGE 3: Suspect Interrogation Chamber           |  |           |
          |  |  - AiInterrogationRoom & ThreeInterrogationCell   |  |           |
          |  |  - Stress Analysis & Natural Language Dialogue     |  |           |
          |  +----------------------------------------------------+  |           |
          |                            |                             |           |
          |       [Sufficient Testimony & Clues Gathered]            |           |
          |                            v                             |           |
          |  +----------------------------------------------------+  |           |
          |  |  STAGE 4: Formal Tribunal Deduction               |  |           |
          |  |  - DeductionModal (Multi-Tier Indictment)          |  |           |
          |  +----------------------------------------------------+  |           |
          |                            |                             |           |
          +============================|=============================+           |
                                       |                                         |
                                       | [Verdict Evaluated & Score Submitted]   |
                                       v                                         |
                           +------------------------+                            |
                           |  CASE RESOLUTION MODAL |                            |
                           |  - Confetti / Victory  |                            |
                           |  - Failure / Debrief   |                            |
                           +------------------------+                            |
                                       |                                         |
                                       +--- [Return to Case Headquarters] -------+
```

### 5.3 Screen & Pipeline Route Specification Matrix
| View / Component Name | Visual Mounting Mode | Security / Auth Level | Transition Entry Point | Exit / Dismissal Action |
| :--- | :--- | :--- | :--- | :--- |
| `HolographicTerminal` | Root Viewport Layer | None (Public Entry) | App launched with no valid JWT in `localStorage` | Successful login / Guest bypass |
| `CaseDashboard` | Root Viewport Layer | Authenticated (JWT or Guest) | Authentication context initialized | User initiates Logout |
| `CaseBriefingModal` | Modal Window Overlay | Authenticated | Investigator clicks a Case Dossier Card | Click "Close" or "Initiate Investigation" |
| `CrimeSceneExplorer` | Full Viewport Replacement | Authenticated | Investigator clicks "Initiate Investigation" | Investigator clicks "CASE FILES" |
| `ThreeSceneRoom` | Embedded WebGL Canvas | Authenticated | `viewMode === '3D'` | User clicks "2D SCAN" toggle |
| `EvidenceInventory` | Slide-Over Cyber Drawer | Authenticated | User clicks "Evidence Vault" ribbon button | Click "Close" or click outside drawer |
| `ClueInspectModal` | High-Priority Modal Overlay | Authenticated | User clicks "3D EXAMINE" on a clue card | Click "Return to Vault" |
| `AiPartnerHUD` | Draggable Floating HUD | Authenticated | User clicks "SPECTER" HUD icon | User clicks minimize / close icon |
| `AiInterrogationRoom`| High-Priority Modal Overlay | Authenticated | User clicks "Interrogation" ribbon button | Click "Return to Investigation" |
| `DeductionModal` | High-Priority Modal Overlay | Authenticated | User clicks "Deduction Tribunal" button | Click "Abort Indictment" or Submit |

### 5.4 Deep Linking, Session Hydration & URL Tamper Resistance
- **Confirmed from code:** Standard URL path routing (`/login`, `/dashboard`, `/investigation`) is deliberately excluded. The application lives at `/` (root), with Netlify SPA rewriting all sub-paths to `/index.html`.
- **Session Hydration Flow:**
  1. On mount, `AuthProvider` reads `localStorage.getItem('cib_token')` and `localStorage.getItem('cib_local_user')`.
  2. If credentials exist, `user` state is immediately hydrated.
  3. If the user refreshes their browser during an active investigation, the application safely resets to `CaseDashboard`. This design prevents corrupt in-memory states (e.g., partially discovered clues, missing Three.js WebGL contexts, or unsynced timers) from destabilizing gameplay.

---

# 6. SCREEN-BY-SCREEN BREAKDOWN

### 6.1 Holographic Terminal (Authentication & Agent Clearance)
- **File Path:** `client_frontend/Crime_Solver/src/components/HolographicTerminal.tsx`
- **Purpose & User Goal:** Acts as the high-security gateway into the CIB central database. Detectives must authenticate their identity or request clearance as a new field agent.
- **Key UI Components Rendered:**
  - CRT screen scanline overlay, horizontal phosphor jitter, and glowing cyber-red borders.
  - Form input elements for Agent Identifier (`username`) and Access Keycode (`password`).
  - Terminal mode switch button toggling between Login and Registration.
  - Emergency Quick Access button ("Instant Guest Agent Clearance") allowing immediate access without backend connectivity.
  - Integrated `FullscreenButton` to toggle browser fullscreen mode before entering operational zones.
- **State Variables:**
  - `isRegistering` (`boolean`): Controlled toggle between Login and Clearance Request modes.
  - `username` (`string`): Controlled input value for username.
  - `password` (`string`): Controlled input value for password.
  - `error` (`string | null`): Real-time validation and HTTP error response string.
  - `isLoading` (`boolean`): Disables form inputs and displays a pulsing loading indicator during network requests.
  - `bootLogs` (`string[]`): Array of simulated system diagnostic logs streamed to the terminal console upon component mount.
- **User Interactions & Events Handled:**
  - Text input triggers simulated mechanical keystroke audio (`sound.playKeyClick()`).
  - Form submission via Enter key or "Initialize Clearance" button.
  - Guest clearance button creates an ephemeral local guest account, bypassing remote server dependencies.
- **API Operations:**
  - `POST /api/auth/login`: Submits `{ username, password }` $ightarrow$ receives `{ token, username, score, clearedCases }`.
  - `POST /api/auth/register`: Submits `{ username, password }` $ightarrow$ registers user in MongoDB.
- **Error Handling & Edge Cases:**
  - Catches network timeouts, CORS errors, or `404 Not Found` responses (common when frontend is deployed without an active backend container) and presents an intuitive alert banner with an option to continue in offline guest mode.

### 6.2 Case Dashboard (Central Command & Dossier Catalog)
- **File Path:** `client_frontend/Crime_Solver/src/components/CaseDashboard.tsx`
- **Purpose & User Goal:** Central command hub where investigators review classified homicide files, inspect case difficulty ratings, check their career clearance score, and select their next investigation.
- **Key UI Components Rendered:**
  - Header with Agent Profile badge, cumulative clearance score, solved case count, and logout button.
  - Grid of tactical Case Dossier Cards displaying thumbnail, case number, title, difficulty tag (Recruit, Detective, Mastermind), estimated time, and room count.
  - Clearance stamp overlay for previously solved cases.
- **State Variables:**
  - `selectedDifficultyFilter` (`string`): Filters case list by difficulty rating.
- **User Interactions Handled:**
  - Clicking any Case Dossier Card triggers the briefing modal callback (`onSelectCase`).
  - Clicking the Logout button flushes `cib_token` and resets global auth state.
- **API Operations:**
  - Consumes the cases array provided by `App.tsx` (hydrated from `GET /api/cases` with fallback to `DEFAULT_CASES`).

### 6.3 Case Briefing Dossier Modal
- **File Path:** `client_frontend/Crime_Solver/src/components/CaseBriefingModal.tsx`
- **Purpose & User Goal:** Presents classified forensic intelligence regarding a selected homicide before deploying the agent to the physical crime scene.
- **Key UI Components Rendered:**
  - Red-bordered classified dossier window with caution tape styling and department stamps.
  - Incident dossier sections: Executive Summary, Victim Dossier (name, age, occupation, time of death, cause of death), Primary Suspect Roster, and Operational Objectives.
  - "Initiate Investigation" primary call to action button.
- **State Variables:** Controlled via parent props (`caseData: CaseData`, `onClose: () => void`, `onEnterInvestigation: () => void`).
- **User Interactions Handled:**
  - Backdrop click, Escape key press, or "Abort Briefing" button invokes `onClose()`.
  - "Initiate Investigation" button click triggers `onEnterInvestigation()` and plays tactical deployment sound.

### 6.4 Crime Scene Explorer Engine (Multi-Room Orchestrator)
- **File Path:** `client_frontend/Crime_Solver/src/components/CrimeSceneExplorer.tsx`
- **Purpose & User Goal:** The primary operational engine. Detectives navigate through multi-room crime scenes, locate hidden evidence under dynamic darkness, manage tactical tools, and coordinate with forensic systems.
- **Key UI Components Rendered:**
  - **Top Forensic Header:** Case title, active chamber name, elapsed mission timer, sequential room tabs with clearance status icons, 3D/2D toggle, UV light toggle, and room light toggle.
  - **Sequential Pipeline Ribbon:** Step 1 (Room Exploration), Step 2 (Evidence Vault with clue counter), Step 3 (Suspect Interrogation), Step 4 (Tribunal Deduction).
  - **Main Viewport:** Renders `ThreeSceneRoom` (when in 3D mode) or the 2D Raycast Flashlight Canvas (when in 2D mode).
  - **Floating Tactical Subsystems:** Draggable `AiPartnerHUD`, interactive alert toasts, and discovery flash screen effects.
- **State Variables:**
  - `activeSceneIndex` (`number`): Index of the current room within `caseData.scenes`.
  - `discoveredClueIds` (`string[]`): Array of secured clue IDs.
  - `inspectedHotspotIds` (`string[]`): Array of clicked hotspot IDs.
  - `inspectingClue` (`Clue | null`): Active clue under examination.
  - `isInventoryOpen`, `isInterrogationOpen`, `isDeductionOpen` (`boolean`): Modal viewport flags.
  - `timeSpentSeconds` (`number`): Active investigation timer.
  - `viewMode` (`'3D' | '2D'`): Active visual rendering engine.
  - `isNightVisionOn` (`boolean`): Ambient floodlight toggle.
  - `isUvMode` (`boolean`): Ultraviolet spectrum mode toggle.
  - `mousePos` (`{ x: number, y: number }`): Real-time coordinates of the flashlight beam.
- **User Interactions Handled:**
  - Pointer movement over 2D viewport updates `mousePos` and calculates Euclidean proximity to hotspots, triggering procedural heartbeat audio when nearing evidence.
  - Hotspot clicking plays scanner hum, adds linked clue to inventory, displays discovery banner, and syncs progress to backend.
  - Room tab switching checks lock state (`isRoomUnlocked`), denying entry if preceding rooms are not cleared of clues.
- **API Operations:**
  - `POST /api/cases/{caseId}/discover`: Transmits `{ clueId, hotspotId }` to sync player progress.

### 6.5 ThreeSceneRoom (360° Spherical WebGL Environment)
- **File Path:** `client_frontend/Crime_Solver/src/components/ThreeSceneRoom.tsx`
- **Purpose & User Goal:** Renders a fully immersive 360-degree interactive crime scene environment in WebGL, enabling investigators to pan, tilt, and discover evidence beacons in 3D space.
- **Key UI Components Rendered:**
  - Full-screen Three.js WebGL `<canvas>`.
  - Inverted panoramic sphere (`SphereGeometry(500, 60, 40)`) mapped with high-resolution photographic textures or procedural cyber-noir grid textures.
  - Procedural 3D Hotspot Beacons: Pulsing inner spheres, translucent outer glow shells, and animated orbital ring geometries.
  - Dynamic Follow Spotlight: Spotlight tracking mouse pointer position in 3D world space.
- **State Variables:**
  - Internal Three.js camera spherical angles (`lat`, `lon`, `phi`, `theta`).
  - Pointer drag tracking refs (`isUserInteracting`, `onMouseDownMouseX`, `onMouseDownMouseY`).
- **User Interactions Handled:**
  - Mouse drag / Touch drag: Smoothly pans and tilts the spherical camera view.
  - Mouse hover: Raycasts against hotspot meshes; if intersected, cursor shifts to pointer and beacon scale pulses.
  - Mouse click: Executes Three.js `Raycaster` against scene objects; triggers `onHotspotClick(hotspot)` when a beacon is clicked.

### 6.6 Evidence Inventory Vault (Evidence Storage & Status)
- **File Path:** `client_frontend/Crime_Solver/src/components/EvidenceInventory.tsx`
- **Purpose & User Goal:** Provides an organized evidence locker where investigators review all secured forensic items, verify room clearance, and launch 3D clue inspection.
- **Key UI Components Rendered:**
  - Slide-over cyber-glass drawer with backdrop blur.
  - Progress header indicating total case evidence collection ratio (`X / Y Secured`).
  - Evidence Item Cards: Title, room location tag, forensic icon, description preview, and "3D Examine" button.
- **State Variables:** Managed via parent props.
- **User Interactions Handled:**
  - Selecting an evidence card opens `ClueInspectModal` for deep analysis.
  - Drawer close button or backdrop click dismisses inventory.

### 6.7 Clue Inspect Modal & ThreeEvidenceViewer (3D Forensic Examination)
- **File Path:** `client_frontend/Crime_Solver/src/components/ClueInspectModal.tsx` & `ThreeEvidenceViewer.tsx`
- **Purpose & User Goal:** Delivers forensic-laboratory analysis of collected clues, allowing investigators to rotate and zoom 3D physical models of weapons, documents, and devices.
- **Key UI Components Rendered:**
  - Interactive Three.js WebGL viewport rendering procedurally generated 3D models (Dagger/Knife, Cyber Shard/USB, Chemical Vial, Burner Phone, Encrypted Relic) based on `clue.category`.
  - Forensic dossier panel: Evidence Classification, Discovery Timestamp, Physical Parameters, Chain of Custody, and Tactical Deduction Notes.
- **State Variables:**
  - `ThreeEvidenceViewer`: Orbit control rotational angles, mouse drag deltas, auto-rotation toggle.
- **User Interactions Handled:**
  - Dragging across the 3D model rotates it on X/Y axes; mouse wheel zooms camera distance.
  - Toggle button pauses/resumes automatic rotational showcase.

### 6.8 AI Partner HUD (SPECTER Tactical Uplink)
- **File Path:** `client_frontend/Crime_Solver/src/components/AiPartnerHUD.tsx`
- **Purpose & User Goal:** Simulates an encrypted tactical comms channel with CIB Artificial Intelligence "SPECTER", providing situational guidance, hint generation, and crime-scene analysis.
- **Key UI Components Rendered:**
  - Floating, draggable HUD window with minimize/expand controls.
  - Terminal message scrollback displaying dialogue between Detective and SPECTER.
  - Quick Tactical Query buttons: *"Where should I look next?"*, *"Analyze collected evidence"*, *"Suspect profile summary"*.
  - Natural language message input field with send button.
- **State Variables:**
  - `messages` (`Array<{ sender: 'user' | 'specter', text: string, timestamp: string }>`): Chat history.
  - `inputMessage` (`string`): Current query draft.
  - `isThinking` (`boolean`): Loading indicator simulating AI forensic processing.
  - `position` (`{ x: number, y: number }`): Viewport coordinates of the draggable window.
- **User Interactions Handled:**
  - Dragging the header moves the window across the screen.
  - Submitting a query sends the prompt to the backend or local rule engine, triggering simulated typing audio.
- **API Operations:**
  - `POST /api/ai/chat`: Submits `{ caseId, message, discoveredClueIds }` $ightarrow$ receives contextual hints.

### 6.9 AI Interrogation Room & ThreeInterrogationCell (Suspect Confrontation)
- **File Path:** `client_frontend/Crime_Solver/src/components/AiInterrogationRoom.tsx` & `ThreeInterrogationCell.tsx`
- **Purpose & User Goal:** Confront suspects in a high-security interrogation room. Investigators interrogate persons of interest, apply psychological pressure, detect contradictions, and extract confessions.
- **Key UI Components Rendered:**
  - **Left Panel:** Suspect bio, motive rating, alibi statement, and real-time **Psychological Stress Meter** (0% to 100% with Calm, Agitated, Defensive, and Breaking Down states).
  - **Center Viewport:** `ThreeInterrogationCell` rendering a 3D interrogation cell with security bars, overhead flickering interrogation lamp, and tension-reactive volumetric lighting.
  - **Right Panel:** Conversation transcript, quick interrogation topics, natural language question input, and Speech Synthesis audio toggle.
- **State Variables:**
  - `conversation` (`Array<{ speaker: string, text: string, stressImpact: number }>`): Dialogue transcript.
  - `suspectStress` (`number`): Active psychological stress value (0–100).
  - `questionInput` (`string`): Investigator's text input.
  - `isSuspectSpeaking` (`boolean`): Audio speech synthesis indicator.
- **User Interactions Handled:**
  - Submitting questions evaluates player text using `suspectDialogueEngine.ts`.
  - Suspect response is printed to transcript, adjusts the stress meter, changes ambient light color in the 3D cell, and triggers Web Speech API voice synthesis.
  - When stress reaches 85%+, the suspect breaks down, revealing crucial contradictory testimony.

### 6.10 Deduction Tribunal Modal (Case Indictment & Verdict)
- **File Path:** `client_frontend/Crime_Solver/src/components/DeductionModal.tsx`
- **Purpose & User Goal:** The culminating phase of each case. Investigators present formal charges to the CIB Tribunal by answering four critical questions: Primary Culprit, Murder Weapon, Core Motive, and Opportunity / Sequence.
- **Key UI Components Rendered:**
  - Multi-tier questionnaire with radio button selectors for Culprit, Weapon, and Motive.
  - Evidence linkage checklist requiring investigators to cite corroborating clues.
  - Verdict submission button with confirmation alert.
  - Case Resolution Screen: Confetti animation and score calculation on victory, or tactical failure debrief on incorrect deduction.
- **State Variables:**
  - `selectedSuspectId` (`string | null`), `selectedWeapon` (`string | null`), `selectedMotive` (`string | null`): Selected answers.
  - `isEvaluating` (`boolean`): Submission processing state.
  - `deductionResult` (`DeductionEvaluationResponse | null`): Result payload returned by scoring engine.
- **User Interactions Handled:**
  - Radio button selection plays tactile interface sounds.
  - Submitting deduction executes evaluation algorithm. If successful, `canvas-confetti` explodes across the screen and score points are synced to the player's profile.
- **API Operations:**
  - `POST /api/cases/{caseId}/deduction`: Submits `{ culpritId, weaponId, motive, citedClueIds }` $ightarrow$ receives `{ isCorrect, scoreAwarded, feedback }`.

### 6.11 Atmosphere & Cinematic Engines (HorrorAmbience & ScaryVideoBackground)
- **File Path:** `client_frontend/Crime_Solver/src/components/HorrorAmbience.tsx` & `ScaryVideoBackground.tsx`
- **Purpose & User Goal:** Provides non-intrusive, procedural psychological tension through dark sub-bass audio synthesis, randomized lightning strobe flashes, and looping atmospheric video backgrounds.
- **Mechanics:**
  - `HorrorAmbience`: Initializes a low-frequency oscillator (35Hz–55Hz) through a lowpass biquad filter on user interaction. Periodically triggers subtle screen-wide lightning flashes with randomized timing (15–45 second intervals).
  - `ScaryVideoBackground`: Renders a low-opacity, high-contrast atmospheric video stream behind application views with radial vignette gradients.

---

# 7. STATE MANAGEMENT DEEP DIVE

### 7.1 Global Application State Architecture (AuthContext)
Global user session and profile state is managed via React Context (`AuthContext`), providing user session identity and persistence across the entire component tree.

```
                  +-----------------------------------+
                  |        AuthProvider (Root)        |
                  +-----------------------------------+
                                    |
          +-------------------------+-------------------------+
          |                                                   |
          v                                                   v
+-----------------------+                           +-----------------------+
|   cib_token (JWT)     |                           |   cib_local_user      |
|   Stored in storage   |                           |   Profile & Score     |
+-----------------------+                           +-----------------------+
          |                                                   |
          +------------------------+--------------------------+
                                   |
                                   v
             +-------------------------------------------+
             |   useAuth() Hook Available to All Views   |
             |   - user: UserProfile | null              |
             |   - token: string | null                  |
             |   - login(credentials): Promise<void>     |
             |   - register(credentials): Promise<void>  |
             |   - logout(): void                        |
             |   - updateUserScore(score, caseId): void  |
             +-------------------------------------------+
```

### 7.2 Reactive Data Flow Pipeline
1. **App Mount:** `AuthProvider` checks `localStorage.getItem('cib_token')` and `localStorage.getItem('cib_local_user')`.
2. **Token Validation:** If present, state initializes immediately with cached credentials while asynchronously validating against the backend.
3. **Investigation Orchestration:** When an investigator selects a case, `App.tsx` passes the `CaseData` object down to `CrimeSceneExplorer`.
4. **Local Discovery Accumulation:** As the player searches rooms, discovered clue IDs accumulate in `discoveredClueIds` array state.
5. **Score Synchronization:** Upon successful deduction, `updateUserScore` updates global user state and persists the new score to both the backend database and local storage.

### 7.3 Local Persistence & Fault-Tolerant Mirroring
MindScene employs a robust persistence strategy to ensure seamless gameplay even in environments with intermittent connectivity or static-only deployments:
- `cib_token`: Stores the raw JWT authentication token issued by Spring Security.
- `cib_local_user`: Stores the JSON-serialized user profile:
  ```json
  {
    "id": "agent-7429",
    "username": "Agent_Vance",
    "score": 4850,
    "clearedCases": ["case-01", "case-02"]
  }
  ```
- `cib_local_scores`: Stores key-value completion records (`{ "case-01": 2400 }`) preventing duplicate reward exploits.

### 7.4 Data Caching, Optimistic UI & Sync Architecture
- **Case Dossiers:** `App.tsx` queries `GET /api/cases`. If the response is valid JSON, backend cases overwrite client defaults. If the network call fails or returns 404, the application smoothly falls back to the bundled `DEFAULT_CASES` dataset without throwing unhandled exceptions.
- **Evidence Discovery:** Hotspot clicks issue an optimistic local state update immediately for instantaneous UI feedback, then fire an asynchronous `POST /api/cases/{caseId}/discover` request in the background.

---

# 8. REUSABLE COMPONENTS LIBRARY

### 8.1 UI & Utility Component Catalog
The MindScene frontend leverages modular, reusable UI components built with TypeScript and Tailwind CSS. Each component adheres to strict single-responsibility principles and exposes clearly typed prop interfaces.

### 8.2 Component Interface Contracts & Prop Definitions

#### 1. `FullscreenButton` (`src/components/FullscreenButton.tsx`)
- **Visual Description:** A tactical rounded icon button that toggles browser-level fullscreen mode. Displays an expanding box icon (`Maximize2`) when windowed and a collapsing box icon (`Minimize2`) when fullscreen.
- **Props Accepted:**
  ```typescript
  interface FullscreenButtonProps {
    showLabel?: boolean; // Controls whether text "FULLSCREEN" is displayed (default: true)
    className?: string;  // Additional Tailwind CSS utility classes
  }
  ```
- **Internal Behavior:** Attaches event listeners to `document.onfullscreenchange`. Directly calls `document.documentElement.requestFullscreen()` or `document.exitFullscreen()`. Handles vendor prefixes gracefully for WebKit/Mozilla engines.

#### 2. `ThreeEvidenceViewer` (`src/components/ThreeEvidenceViewer.tsx`)
- **Visual Description:** An interactive 3D WebGL viewport contained within a high-tech holographic scanning bracket. Renders a procedural 3D model corresponding to the clue's forensic category.
- **Props Accepted:**
  ```typescript
  interface ThreeEvidenceViewerProps {
    category: 'weapon' | 'document' | 'device' | 'chemical' | 'relic' | string;
    clueTitle: string;
  }
  ```
- **Internal Behavior:**
  - Instantiates `THREE.Scene`, `THREE.PerspectiveCamera`, and `THREE.WebGLRenderer` with `alpha: true` and `antialias: true`.
  - Dynamically synthesizes 3D procedural geometries based on category:
    - `weapon`: Composite steel dagger with hilt, crossguard, and blood-tinted double-edged blade.
    - `device`: Matte-black cyber-drive / smartphone with illuminated LED circuitry.
    - `chemical`: Translucent glass cylinder vial containing glowing neon toxic fluid.
    - `document`: Rolled parchment / encrypted data tablet with holographic scanlines.
  - Implements mouse-drag orbital rotation controls with smooth inertia damping and auto-rotation toggle.
  - Cleans up GPU buffers, geometries, materials, and requestAnimationFrame loops upon unmounting.

#### 3. `ThreeInterrogationCell` (`src/components/ThreeInterrogationCell.tsx`)
- **Visual Description:** A 3D WebGL viewport rendering a high-security detention chamber. Features textured concrete perimeter walls, steel vertical bars, and an overhead swinging interrogation lamp.
- **Props Accepted:**
  ```typescript
  interface ThreeInterrogationCellProps {
    stressLevel: number; // 0 to 100 percentage
    isSpeaking: boolean; // Pulsing voice indicator
  }
  ```
- **Internal Behavior:**
  - Smoothly interpolates the overhead spotlight's color from cold cyan (`#00f0ff`) at low stress to warning amber (`#f59e0b`) at moderate stress, and deep alarm crimson (`#ef4444`) when the suspect's stress exceeds 85%.
  - Renders dynamic volumetric shadow casting on cell bars.

#### 4. `ErrorBoundary` (`src/components/ErrorBoundary.tsx`)
- **Visual Description:** A full-screen fallback terminal displaying a "CRITICAL SYSTEM RECOVERY" readout with diagnostic stack traces and an "Emergency Reboot" recovery button.
- **Props Accepted:**
  ```typescript
  interface ErrorBoundaryProps {
    children: React.ReactNode;
  }
  ```
- **Internal Behavior:** React class component implementing `componentDidCatch(error, errorInfo)` and `getDerivedStateFromError`. Catches uncaught WebGL context loss, failed audio node allocations, or corrupt JSON payloads without crashing the browser tab.

#### 5. `ScaryVideoBackground` (`src/components/ScaryVideoBackground.tsx`)
- **Visual Description:** A full-screen background component that renders an atmospheric video stream behind application views with radial vignette gradients and color grading.
- **Props Accepted:**
  ```typescript
  interface ScaryVideoBackgroundProps {
    variant?: 'menu' | 'scene'; // Selects between dark ambient drone video or crime scene fog
  }
  ```

---

# 9. DESIGN SYSTEM

### 9.1 Visual Theme & Aesthetic Philosophy (Midnight Noir / Cyberpunk)
MindScene's design system—codenamed **"Midnight Noir"**—unites the psychological tension of classic crime thrillers with the high-tech visual language of a futuristic intelligence terminal.
- **Atmospheric Contrast:** Views are enveloped in near-absolute darkness (`#040101`), forcing the user's attention onto focused spotlight cones, laser sights, and illuminated forensic evidence.
- **Holographic Glassmorphism:** Modals and HUD elements employ semi-transparent dark obsidian acrylics (`bg-black/90`, `backdrop-blur-md`) encased within crisp 1px borders of blood crimson (`border-red-900/60`).
- **Tactile Feedback:** Every click, keystroke, scan, and error generates synchronized procedural sound and visual micro-animations (phosphor flashes, CRT scanline jitters, camera shutter flares).

### 9.2 Color Palette Token Specification
| Color Token Name | Hex Value | Semantic / UI Role in System |
| :--- | :--- | :--- |
| **Abyssal Void** | `#040101` / `#050000` | Global canvas background; ensures absolute contrast |
| **Terminal Obsidian** | `#0d0202` | Card backgrounds, slide-over panels, modal containers |
| **Crime Scene Crimson** | `#991b1b` / `#dc2626` | Primary action buttons, active navigation tabs, alert borders |
| **Bio-Hazard Amber** | `#d97706` / `#f59e0b` | Hotspot markers, uninspected evidence tags, stress indicators |
| **Cyber Forensic Cyan** | `#06b6d4` / `#22d3ee` | SPECTER AI comms, 3D WebGL beacons, biometric scans |
| **Forensic UV Purple** | `#9333ea` / `#a855f7` | UV blacklight scanner mode, hidden chemical markers |
| **Cleared Emerald** | `#059669` / `#10b981` | Room cleared checkmarks, correct deduction banners |
| **Phosphor Body** | `#fee2e2` / `#fecaca` | High-contrast readable typography for body copy |
| **Muted Slate** | `#64748b` / `#475569` | Secondary metadata, locked room tabs, inactive controls |

### 9.3 Typography Scale & Font Families
- **Display / Case Gothic Font:** `Creepster`, cursive display font. Used exclusively for case numbers, major crime headlines, tribunal verdicts, and classified stamps.
- **Terminal / Monospace Font:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`. Used for system telemetries, timers, evidence IDs, coordinates, and SPECTER dialogue.
- **Interface Body Font:** `Inter, system-ui, -apple-system, sans-serif`. Used for witness testimonies, clue forensic dossiers, autopsy reports, and interactive form controls.

### 9.4 Spatial System, Grids & Responsive Conventions
- **Base Grid Unit:** 4px baseline rhythm. Common spatial increments: `gap-1` (4px), `p-1.5` (6px), `p-3` (12px), `p-4` (16px), `p-6` (24px).
- **Border Radius Hierarchy:**
  - `rounded-lg` (8px): Interactive buttons, tabs, input fields.
  - `rounded-xl` / `rounded-2xl` (12px–16px): Content cards, modal windows, floating HUDs.
  - `rounded-full`: Circular hotspot beacons, avatar badges, status indicators.
- **Responsive Layout Strategy:**
  - **Desktop ($\ge$ 1024px):** Fixed top forensic header (`h-14`), floating draggable HUD windows, side-by-side interrogation chamber.
  - **Tablet (768px - 1023px):** Collapsible HUDs, stacked interrogation cell and transcript panels.
  - **Mobile (< 768px):** Fullscreen modal takeovers, touch-friendly tap targets (`min-h-[44px]`), simplified single-column dossier lists.

### 9.5 Iconography Catalog & Lucide Integration
The application uses `lucide-react` icons to reinforce tactical forensic paradigms:
- `Flashlight`: Flashlight raycasting mode.
- `Zap`: UV forensic blacklight spectrum toggle.
- `Globe`: 3D 360° spherical room engine switch.
- `Scan`: 2D planar raycast scanner switch.
- `Key`, `Fingerprint`, `FlaskConical`, `Folder`: Hotspot type markers.
- `BrainCircuit`: Tribunal deduction mode.
- `MessageSquareQuote`: Suspect interrogation chamber.

---

# 10. KEY USER FLOWS (END TO END)

### 10.1 Flow 1: Agent Authentication & Session Hydration
| Step | User Action | System Response | State Change | API Call Made |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Navigates to application URL | Renders `HolographicTerminal` with CRT boot sequence | `user = null` | None |
| **2** | Enters username & password, clicks "Initialize Clearance" | Plays terminal keystroke sounds; verifies credentials | `isLoading = true` | `POST /api/auth/login` |
| **3** | Server returns signed JWT & user profile | Saves token to `localStorage`; transitions to dashboard | `user = { ... }`, `token = "..."` | None |
| **4** | *(Alternative)* Clicks "Guest Clearance" | Synthesizes local guest clearance record immediately | `user = { username: 'Agent_Guest' }` | None (Offline Mode) |

### 10.2 Flow 2: Case Selection, Briefing & Sequential Multi-Room Exploration
| Step | User Action | System Response | State Change | API Call Made |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Clicks a Case Dossier Card in `CaseDashboard` | Opens `CaseBriefingModal` displaying victim dossier and suspects | `selectedCase = caseData`, `showBriefing = true` | None |
| **2** | Clicks "Initiate Investigation" button | Closes briefing; transitions to `CrimeSceneExplorer` in Room 1 | `isInInvestigation = true`, `activeSceneIndex = 0` | None |
| **3** | Moves mouse across dark crime scene in 2D or 3D | Flashlight beam tracks mouse; heartbeat sounds near evidence | `mousePos = { x, y }` | None |
| **4** | Attempts to click Room 2 tab before clearing Room 1 | Denies access with buzzer sound; displays "Clear Room 1 First" | None (Gate Rejected) | None |

### 10.3 Flow 3: Clue Discovery & 3D Interactive Inspection
| Step | User Action | System Response | State Change | API Call Made |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Clicks illuminated evidence hotspot | Plays discovery sting, flashes screen white, displays confirmation | `discoveredClueIds += [clueId]` | `POST /api/cases/{id}/discover` |
| **2** | All room clues collected | Shows "Room Cleared" toast; unlocks Room 2 tab | Sequential room gate opens | None |
| **3** | Clicks "Evidence Vault" in pipeline ribbon | Slides open `EvidenceInventory` showing all collected items | `isInventoryOpen = true` | None |
| **4** | Clicks "3D Examine" on a clue card | Opens `ClueInspectModal` with interactive Three.js 3D mesh | `inspectingClue = clue` | None |
| **5** | Drags mouse on 3D model | Model rotates smoothly on X/Y axes in real time | Mesh rotation updated in WebGL loop | None |

### 10.4 Flow 4: Suspect Interrogation & Psychological Pressure Breakdown
| Step | User Action | System Response | State Change | API Call Made |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Clicks "Interrogation" in pipeline ribbon | Launches `AiInterrogationRoom` with 3D interrogation cell | `isInterrogationOpen = true` | None |
| **2** | Types question into interrogation prompt | Parses intent via NLP engine; calculates stress impact | `questionInput = ""` | None (or `POST /api/ai/chat`) |
| **3** | Suspect responds | Prints testimony to transcript; speaks via Web Speech API | `suspectStress += delta` | None |
| **4** | Stress exceeds 85% threshold | 3D cell light turns deep red; suspect breaks down and confesses | Suspect state $\rightarrow$ Broken | None |

### 10.5 Flow 5: Tribunal Deduction, Indictment Evaluation & Case Resolution
| Step | User Action | System Response | State Change | API Call Made |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Clicks "Deduction Tribunal" button | Launches `DeductionModal` indictment questionnaire | `isDeductionOpen = true` | None |
| **2** | Selects Culprit, Weapon, and Motive radio options | Highlights choices with amber border and click audio | Form state updated | None |
| **3** | Clicks "Submit Indictment" | Evaluates deduction answers against authoritative solution | `isEvaluating = true` | `POST /api/cases/{id}/deduction` |
| **4** | Verdict evaluated as Correct | Explodes celebratory confetti; awards score; unlocks cleared badge | `user.score += awardedPoints` | Score synced to backend |
| **5** | Clicks "Return to Headquarters" | Closes investigation; refreshes dashboard with solved status | Returns to `CaseDashboard` | None |

---

# 11. PERMISSIONS & DEVICE FEATURES

### 11.1 Web Standards & Hardware Acceleration Utilization
MindScene utilizes modern W3C standard browser capabilities without requiring native binary installation:
- **WebGL 2.0 via Three.js:** Leverages the client's GPU hardware to render 3D spherical rooms, lighting models, and procedural 3D evidence meshes.
- **HTML5 Web Audio API:** Employs an `AudioContext` with software oscillators, biquad filters, and gain nodes for real-time procedural audio synthesis.
- **HTML5 Fullscreen API:** Requests full hardware display capture via `element.requestFullscreen()`.
- **HTML5 Web Speech API (`SpeechSynthesis`):** Utilizes browser-native speech synthesis engines to voice suspect dialogue.

### 11.2 Hardware Capabilities & API Interactions
| Browser Standard API | Target Hardware | Usage in MindScene | Fallback if Denied / Unsupported |
| :--- | :--- | :--- | :--- |
| `requestFullscreen` | Display Viewport | Maximizes game window for total immersion | Stays in standard browser viewport |
| `AudioContext` | Audio DAC / Speakers | Procedural heartbeat, scanner hum, drone | Silent operation; visual toasts replace sound |
| `WebGLRenderingContext` | Dedicated / Integrated GPU | 360° spherical room & 3D clue inspection | Automatically falls back to 2D Planar Scan |
| `speechSynthesis` | Audio Output | Real-time text-to-speech for suspect dialogue | Silent operation; text displayed in transcript |

### 11.3 Fallback Mechanics for Constrained Client Environments
If a user's browser or device restricts WebGL or audio:
- **WebGL Failure:** `ErrorBoundary` catches rendering errors; investigators can switch to `2D SCAN` mode with zero graphical penalty.
- **Audio Autoplay Restrictions:** Audio nodes remain suspended until the first user click interaction, in accordance with modern browser autoplay security policies.

---

# 12. BUILD & DEPLOYMENT

### 12.1 Frontend Build Tooling & Optimization (vite.config.ts)
The client frontend application is compiled and bundled using Vite with modern ES module tree-shaking and asset compression.
```typescript
// client_frontend/Crime_Solver/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  }
});
```

### 12.2 Backend Containerization & Multi-Stage Dockerfile
The backend microservice utilizes a multi-stage Docker build producing an optimized runtime container:
```dockerfile
# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies (this layer will be cached)
RUN mvn dependency:go-offline -B

COPY src ./src
# Build the application, skipping tests to speed up the process
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 12.3 Reverse Proxy & API Gateway Routing (netlify.toml / _redirects)
To eliminate Cross-Origin Resource Sharing (CORS) complications on production platforms like Netlify, the client provides proxy routing rules:
- **`netlify.toml`:**
  ```toml
  [build]
    base = "client_frontend/Crime_Solver"
    command = "npm run build"
    publish = "dist"

  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```
- **`client_frontend/Crime_Solver/public/_redirects`:** Provides an optional API Gateway rewrite forwarding `/api/*` requests directly to the hosted backend container (e.g., on Render).

### 12.4 Environment Variables & Secret Configuration Matrix
| Variable Name | Environment Scope | Default Value / Template | Functional Purpose |
| :--- | :--- | :--- | :--- |
| `MONGODB_URI` | Backend (Render / Local) | Empty (System Env) | Connection string for MongoDB Atlas cluster |
| `MONGODB_DATABASE` | Backend (Render / Local) | `crime_solver_db` | Primary database name for storing cases and users |
| `JWT_SECRET` | Backend (Render / Local) | 256-bit fallback key | Cryptographic secret for signing and verifying tokens |
| `JWT_EXPIRATION` | Backend (Render / Local) | `86400000` (24 Hours) | Lifespan of issued JSON Web Tokens in milliseconds |
| `CORS_ALLOWED_ORIGINS`| Backend (Render / Local) | `localhost:5173,netlify.app` | Comma-delimited list of whitelisted web origins |

### 12.5 Production CI/CD Pipeline & Deployment Topology
```
           +------------------------------------------------------+
           |                   GIT REPOSITORY                     |
           +------------------------------------------------------+
                         |                          |
       [Push to main]    |                          |    [Push to main]
                         v                          v
          +-----------------------+   +---------------------------+
          |  NETLIFY BUILD ENGINE |   |   RENDER DOCKER PIPELINE  |
          |  - Base: client...    |   |   - Multi-stage Dockerfile|
          |  - npm run build      |   |   - Maven compilation     |
          |  - Static Edge CDN    |   |   - Alpine JRE 17 runtime |
          +-----------------------+   +---------------------------+
                         |                          |
                         v                          v
          +-----------------------+   +---------------------------+
          | Frontend Web App      |   | Java Spring Boot Service  |
          | (React 19 SPA)        |   | (Port 8080)               |
          +-----------------------+   +---------------------------+
                         |                          |
                         +------------+-------------+
                                      |
                                      v
                        +----------------------------+
                        |     MongoDB Atlas Cloud    |
                        |     (Encrypted Cluster)    |
                        +----------------------------+
```

---

# 13. KNOWN LIMITATIONS & TECH DEBT

### 13.1 Hardcoded Values & Monolithic Mock Datasets
- **Confirmed from code:** `defaultCases.ts` contains 5 comprehensive cases embedded directly in client-side TypeScript code.
- *Technical Debt:* While this guarantees fault tolerance when the backend is offline, case files should ideally be fetched dynamically from a Content Management System (CMS) or MongoDB database to facilitate adding new cases without rebuilding the frontend bundle.

### 13.2 WebGL & Rendering Performance Constraints
- **Spherical Canvas Memory:** Instantiating multiple Three.js WebGL contexts (`ThreeSceneRoom`, `ThreeEvidenceViewer`, `ThreeInterrogationCell`) on lower-end mobile devices can cause WebGL context loss if previous contexts are not cleanly disposed.
- *Mitigation in Code:* Components implement explicit cleanup in `useEffect` return blocks, calling `renderer.dispose()`, removing DOM canvases, and purging geometries and materials from GPU memory.

### 13.3 Security Considerations & Client-Side Verification
- **Client-Side Deductions in Offline Fallback:** When running in offline guest mode, deduction answers are verified against bundled client objects. Knowledgeable users could inspect JavaScript bundles to extract solutions.
- *Remediation:* Authoritative deduction evaluation is handled on the Spring Boot backend (`CaseController.java`), which withholds answer keys from client payloads.

### 13.4 Accessibility (a11y) Considerations
- **Color Contrast & Raycasting:** The application’s core mechanic—searching for hidden evidence in pitch-black rooms using a flashlight beam—is intentionally low-contrast by design.
- *Accessibility Features Added:* Night Vision mode provides an ambient illumination toggle for visually impaired investigators, alongside descriptive textual labels and aria-compliant modal dialogues.

---

# 14. FUTURE ROADMAP

### 14.1 Phase I: Multiplayer Cooperative Investigation
- Introduce a real-time WebSocket communication layer (`STOMP` over SockJS in Spring Boot).
- Enable multi-agent crime scene sessions where partner detectives share a synchronized flashlight view, trade physical evidence, and conduct joint interrogations.

### 14.2 Phase II: Procedurally Generated Crime Scenes & LLM Synthesis
- Integrate Large Language Models (e.g. Google Gemini 2.0 / OpenAI) into the backend `AiDetectiveService` to procedurally generate dynamic suspect testimonies, alibis, and unexpected narrative twists based on player input.
- Procedural generation of 3D crime scene room layouts and evidence placements.

### 14.3 Phase III: Native Mobile Packaging & VR/WebXR Port
- Package the responsive frontend into native iOS and Android binaries via Capacitor.
- Port `ThreeSceneRoom` to WebXR, allowing players to explore crime scenes using Meta Quest or Apple Vision Pro headsets with 6DoF head tracking and virtual flashlight controllers.

---

# 15. APPENDIX

### 15.1 Domain Glossary
- **CIB:** Central Intelligence Bureau, the fictional federal forensic intelligence agency within the MindScene universe.
- **Hotspot:** An interactive coordinate-bounded region within a crime scene that triggers forensic inspection or clue acquisition.
- **Raycasting:** The mathematical projection of a 2D pointer coordinate into a 3D WebGL scene or planar Euclidean field to determine object intersection.
- **Equirectangular Projection:** A 2:1 panoramic image format mapped onto the interior of a Three.js spherical geometry to create a seamless 360° visual room.
- **UV Blacklight Mode:** A secondary visual spectrum filter that exposes fluorescent chemical, biological, and latent fingerprint residue.
- **SPECTER:** Tactical Synthetic Partner for Evidentiary Collection and Tactical Evaluation Readout, the investigator’s AI advisor.
- **Tribunal Deduction:** The formal final questionnaire where investigators present their hypothesis to indict the culprit.

### 15.2 External API & Library Reference Directory
1. **React 19 Documentation:** https://react.dev
2. **Three.js WebGL Graphics Library:** https://threejs.org/docs/
3. **Spring Boot Framework Documentation:** https://spring.io/projects/spring-boot
4. **Spring Security Architecture:** https://spring.io/projects/spring-security
5. **MongoDB Java Driver & Atlas Reference:** https://www.mongodb.com/docs/drivers/java/sync/current/
6. **Web Audio API Specification (W3C):** https://www.w3.org/TR/webaudio/
7. **HTML5 Fullscreen API Specification:** https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
8. **Tailwind CSS v4 Documentation:** https://tailwindcss.com/docs
