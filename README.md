# ⚡ react_angular: Full-Stack Learning Journey

A hands-on, progressive masterclass from **Beginner to Advanced**, comparing **React** and **Angular** side-by-side using the same application (**PulseTask**) powered by a shared, pure backend.

---

## 📁 Repository Structure

```
react_angular/
├── backend/          # Shared pure Node.js + Express REST API
│   ├── data/tasks.json # Persistent JSON data file
│   └── server.js     # REST API (GET, POST, PUT, DELETE, /api/stats)
│
├── react-app/        # React 19 Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # Functional components & props
│   │   │   ├── StatsRibbon.jsx    # Analytics metrics & mapping
│   │   │   ├── TaskCard.jsx       # Event handlers & dynamic styling
│   │   │   ├── TaskModal.jsx      # Controlled forms & validation
│   │   │   └── LearningBanner.jsx # In-app concept cheat sheet
│   │   ├── App.jsx                # State management (useState, useEffect)
│   │   ├── App.css
│   │   └── index.css              # Custom dark-mode design system
│   └── vite.config.js             # Dev proxy forwarding /api to backend
│
└── angular-app/      # Angular Frontend (Bridging phase)
    └── README.md     # Concept translation dictionary (React -> Angular)
```

---

## 🚀 Quick Start Guide

### 1. Run the Shared Backend API
```bash
cd backend
npm install
npm start
# Server runs on: http://localhost:5000
```

### 2. Run the React Frontend
```bash
cd react-app
npm install
npm run dev
# App runs on: http://localhost:3000
```

---

## 🗺️ Progressive Curriculum

### 🟢 Phase 1: React Mastery
- [x] **Step 1: Foundations & Architecture**
  - Mental model: Virtual DOM, declarative UI vs imperative DOM manipulation.
  - Anatomy: `index.html` ➔ `main.jsx` (`createRoot`) ➔ `App.jsx`.
  - JSX principles: `className`, `{}` expressions, single root element.
  - Component breakdown: Pure functions, props passing, and lifting state up.
  - State fundamentals: `useState` hook, immutability rules (`[...prev]`, `.map()`, `.filter()`).
  - Controlled Forms: two-way data sync via `value` and `onChange`.
  - Backend synchronization: `fetch()` integration with Express REST endpoints.
- [ ] **Step 2: Intermediate React (Hooks & UX Polish)**
  - Custom Hooks: Extracting reusable logic (`useTasks`, `useDebounce`).
  - Optimistic UI updates (updating the UI before the network responds for instant feedback).
  - Advanced filtering & search debouncing.
  - Error boundaries & resilient loading states.
- [ ] **Step 3: Advanced React (Architecture, Context & Performance)**
  - Global State Management with Context API or Zustand.
  - Performance optimization: `useMemo`, `useCallback`, and `React.memo`.
  - Kanban Board drag-and-drop or column-based workflow view.

---

### 🔴 Phase 2: Angular Mastery (The Bridge)
- [ ] **Angular CLI Scaffolding & Standalone Components**
- [ ] **Template Syntax vs JSX (`*ngFor` / `@for`, `*ngIf` / `@if`)**
- [ ] **Two-Way Binding & Reactive Forms vs React Controlled Inputs**
- [ ] **Angular Signals (`signal()`, `computed()`, `effect()`) vs React `useState` & `useEffect`**
- [ ] **Dependency Injection & Services (`HttpClient`) vs React Custom Hooks**
- [ ] **Angular Router & Guards**

---

*All code changes are automatically committed and pushed to [GitHub](https://github.com/SubodhMuneshwar/react_angular.git).*
