# MindScene — Tactical Mystery Investigation

MindScene is an interactive, web-based crime-solving application. Players take on the role of a tactical investigator exploring crime scenes, discovering hidden physical clues using dynamic UI mechanics (like a flashlight reveal), examining forensic reports, and consulting with an AI assistant to solve complex cases.

---

## 🏗️ Tech Stack

This project utilizes a modern, decoupled architecture inside a single **Monorepo**.

### Frontend (Client)
- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Key Mechanics:** Custom React hooks for mouse-tracking (flashlight reveal), HTML5 Fullscreen API integration.
- **Routing/Proxy:** Vite proxy (local) / Netlify `_redirects` (production).
- **Hosting:** [Netlify](https://netlify.com)

### Backend (Service)
- **Framework:** Java 17 + Spring Boot 3
- **Security:** Spring Security with JWT (JSON Web Token) stateless authentication.
- **Data Access:** Spring Data MongoDB.
- **Build Tool:** Maven.
- **Hosting:** [Render](https://render.com) (via Multi-stage Docker container).

### Database
- **Platform:** MongoDB Atlas (Cloud).
- **Security:** Network access configured to allow Render's dynamic IP pool (`0.0.0.0/0`).

---

## 📂 Project Structure

```text
AI_Crime_Solver/
├── client_frontend/Crime_Solver/    # Vite + React Frontend
│   ├── public/
│   │   └── _redirects               # Netlify proxy rules for production
│   ├── src/
│   │   ├── components/              # UI components (HolographicTerminal, CaseDashboard)
│   │   ├── context/                 # React Context (AuthContext)
│   │   └── main.tsx                 # React entry point
│   ├── package.json
│   ├── vercel.json                  # Vercel proxy configuration (alternative hosting)
│   └── vite.config.ts               # Local development proxy to backend
│
└── service_backend/                 # Spring Boot Backend
    ├── src/main/java/com/.../
    │   ├── config/                  # MongoDB and App Configuration
    │   ├── security/                # JWT filters, CorsConfig, SecurityFilterChain
    │   └── ServiceBackendApplication.java
    ├── src/main/resources/
    │   └── application.properties   # Spring Boot settings
    ├── .dockerignore                # Optimizes Docker builds
    ├── Dockerfile                   # Multi-stage Maven+Java 17 build
    └── pom.xml                      # Maven dependencies
```

---

## 🚀 Local Development Setup

To run the application locally on your machine, you need **Node.js** and **Java 17+** installed.

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd service_backend
   ```
2. Create a `.env` file in the `service_backend` root and add your secrets:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster...
   MONGODB_DATABASE=crime_solver_db
   JWT_SECRET=your_super_secret_key_needs_to_be_long_enough
   JWT_EXPIRATION=86400000
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will start on `http://localhost:8080`.*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd client_frontend/Crime_Solver
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will start on `http://localhost:5173`.*

> **Note on Local API Routing:** In development, the frontend calls `fetch('/api/...')`. The `vite.config.ts` file automatically proxies these requests to `http://localhost:8080` to bypass CORS issues.

---

## 🌍 Production Deployment Guide

The application is deployed across two different free-tier services.

### Backend (Render)
The backend is deployed as a Dockerized Web Service on Render.
- **Root Directory:** `service_backend`
- **Build Method:** Docker (Using the `Dockerfile` provided in the repo).
- **Environment Variables:** `MONGODB_URI`, `JWT_SECRET`, and `JWT_EXPIRATION` are securely set in the Render Dashboard.
- **CORS Configuration:** `SecurityConfig.java` is explicitly configured to accept requests from the live frontend URL (`https://delicate-sfogliatella-21e199.netlify.app`).

### Frontend (Netlify)
The frontend is built and deployed as a static Single Page Application (SPA).
- **Build Command:** `npm run build`
- **Routing & Proxy:** Because the production frontend doesn't have a Vite server, it relies on the `public/_redirects` file.
  ```text
  /api/*  https://mindscene-backend.onrender.com/api/:splat  200
  /*      /index.html  200
  ```
  This tells Netlify to act as an API Gateway, securely forwarding any `/api` requests to the Render backend, entirely bypassing browser CORS limitations and keeping the frontend code clean.

---

## 🎨 Key Application Features

1. **Midnight Noir Theme:** Deep obsidian backgrounds (`bg-[#07090e]`), contrasting cyan/amber accents, and high-readability sans-serif typography (`Orbitron` and `Inter` fonts).
2. **Flashlight Clue Reveal:** The `CrimeSceneExplorer` component uses complex mathematics (Pythagorean theorem) against the mouse coordinate state to dynamically calculate beam collision. Clues remain invisible in the DOM until the "flashlight beam" intersects their bounding box.
3. **Immersive Fullscreen:** A native `FullscreenButton` uses the browser's Document API to remove browser chrome, deeply increasing the immersive feeling of a real detective terminal.
4. **Stateless JWT Auth:** The entire system relies on secure, stateless JSON Web Tokens passed in the HTTP Authorization headers.
