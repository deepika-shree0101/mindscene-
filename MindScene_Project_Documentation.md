# MindScene: Tactical Mystery Investigation
## Final Year Project Documentation

---

### 1. Abstract & Introduction
**MindScene** is a full-stack, interactive crime-solving web application. It combines forensic logic puzzles with modern web technologies to simulate a digital detective environment. Users act as investigators who explore dark crime scenes using interactive UI mechanics, collect evidence, consult with an AI assistant (SPECTER), and formulate deductions to solve complex cases.

---

### 2. Technology Stack (End-to-End)
The project is built using a modern decoupled architecture inside a Monorepo.

#### 2.1. Frontend (Client-Side)
- **React 18**: Core UI library.
- **Vite**: Next-generation build tool for fast development and bundling.
- **TypeScript**: Adds static typing to JavaScript for robust component architecture.
- **TailwindCSS**: Utility-first CSS framework used for the "Midnight Noir" styling.
- **Lucide React**: Iconography library.
- **HTML5 Fullscreen API**: Used for immersive gameplay.

#### 2.2. Backend (Server-Side)
- **Java 17**: Core backend programming language.
- **Spring Boot 3**: Framework for REST API development.
- **Spring Security**: Handles stateless authentication.
- **JWT (JSON Web Tokens)**: Secures API endpoints and manages user sessions.
- **Maven**: Dependency management and build automation.

#### 2.3. Database & Hosting
- **MongoDB Atlas**: Cloud NoSQL database storing user credentials, case files, and discovered evidence.
- **Render (Docker)**: Hosts the backend Java service using a multi-stage Docker build.
- **Netlify**: Hosts the frontend React application, utilizing `_redirects` as an API Gateway to prevent CORS issues.

---

### 3. Screen & Component Architecture
The frontend is heavily componentized. Below is the breakdown of components used across the main screens.

#### 3.1. Authentication Screen (`HolographicTerminal.tsx`)
- **Purpose**: The entry point of the application.
- **Key Mechanics**: Toggles between Login and Register modes.
- **Components Used**: 
  - `FullscreenButton`: Allows the user to enter immersive mode before logging in.
  - Native form inputs mapped to `AuthContext` for JWT retrieval.

#### 3.2. Main Menu (`CaseDashboard.tsx`)
- **Purpose**: The central hub where investigators choose which case to solve.
- **Components Used**:
  - `CaseBriefingModal`: A popup component that displays the backstory, victim details, and objectives of a selected case before launching it.

#### 3.3. Active Investigation Screen (`CrimeSceneExplorer.tsx`)
- **Purpose**: The core gameplay loop where users search for clues.
- **Key Mechanics (The Flashlight)**: Utilizes Pythagorean distance tracking against the mouse `(clientX, clientY)` coordinates. Clues are rendered invisible (`opacity-0`) until the mouse hovers directly over their specific bounding boxes, simulating a flashlight in the dark.
- **Components Used**:
  - `AiPartnerHUD`: A floating, draggable interface where players can "chat" with the AI assistant SPECTER for hints.
  - `EvidenceInventory`: A sidebar tracking all physical clues the user has successfully clicked and collected.
  - `ClueInspectModal`: A detailed view that pops up when a clue is found, showing forensic data and high-res images.
  - `DeductionModal`: The final test screen where users answer questions based on their evidence to win the case.

---

### 4. User Manual (How to Use the App)

#### Step 1: Login & Registration
1. Open the application URL (e.g., the Netlify link).
2. Click the **Fullscreen** icon in the top right for the best experience.
3. If you are a new agent, click **"Request Clearance"** to switch to the Registration screen. Enter a username and password.
4. If you already have an account, enter your credentials in the **Terminal Login** to receive your JWT access token.

#### Step 2: Selecting a Case
1. Upon logging in, you will be taken to the **Case Dashboard**.
2. Browse the available "Incident Files" (e.g., *The Neon Syndicate*).
3. Click on a case to open the **Briefing Modal**. Read the background information and click **"Initiate Investigation"**.

#### Step 3: Exploring the Crime Scene
1. The screen will turn dark (Midnight Noir theme). 
2. **Move your mouse around the screen**. Your mouse acts as a flashlight. 
3. When the beam crosses a hidden clue, it will light up.
4. **Click the clue** to collect it. It will open the `ClueInspectModal` so you can read the forensic details.
5. Collected clues are permanently added to your **Evidence Inventory** on the side of the screen.

#### Step 4: Consulting the AI Partner
1. If you get stuck, click the **SPECTER AI** button on your HUD.
2. Type a question (e.g., *"What does the chemical residue on the glass mean?"*).
3. The AI will provide tactical hints based on the context of the case.

#### Step 5: Solving the Case
1. Once you have collected enough evidence, click the **"Make Deduction"** button.
2. The `DeductionModal` will appear, asking you multiple-choice questions about the killer's identity, motive, and weapon.
3. Use the knowledge you gathered from the Evidence Inventory to answer.
4. If correct, you solve the case and are returned to the Dashboard!

---

### 5. Deployment Architecture (Data Flow)
1. **Client Action**: User clicks "Login" on Netlify Frontend.
2. **Proxy Routing**: The browser sends a `POST` to `/api/auth/login`. Netlify intercepts this via the `_redirects` file and forwards it to `https://mindscene-backend.onrender.com/api/auth/login`.
3. **Backend Processing**: The Spring Boot Docker container on Render receives the request. `SecurityConfig.java` validates the CORS origin.
4. **Database Query**: Spring Data queries MongoDB Atlas to verify the password hash via `BCrypt`.
5. **Response**: A signed JWT is generated and passed back through Render -> Netlify -> Browser, granting access to the system.
