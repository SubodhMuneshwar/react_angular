# ✨ Timeline: Moments with My Best Friend

A full-stack, hands-on learning project to master **React** and **Angular** from **Beginner to Advanced**, comparing both frameworks side-by-side using the same shared, pure backend.

---

## 📖 About The Project

**Timeline** is a personal digital scrapbook and chronological story keeper that captures memories, milestones, adventures, and inside jokes shared with a best friend.

### 🌟 Key Features:
- 🌊 **Timeline River View**: Vertical chronological stream with a glowing timeline spine and alternating memory cards.
- 📸 **Scrapbook Grid View**: Polaroid-style photo gallery mode.
- ❤️ **Core Memories**: Special moments starred with glowing highlights and quick filtering.
- 😂 **Inside Jokes**: Highlighted quote callouts with handwritten styling.
- ⚡ **Friendship Milestones**: Live calculation of "Days of Friendship" from the earliest memory, plus adventure counters.
- 🎲 **Nostalgia Time Machine ("Surprise Me!")**: Randomly surfaces and scrolls to a forgotten memory.
- 📝 **Capture Moment Modal**: Controlled form to log new memories with photos, dates, locations, vibes, and stories.

---

## 📁 Repository Structure

```
react_angular/
├── backend/                  # .NET 10 ASP.NET Core Web API
│   ├── Controllers/          # API Controllers (MemoriesController, StatsController)
│   ├── Models/               # Domain Models (Memory.cs, FriendshipStats.cs)
│   ├── DTOs/                 # Data Transfer Objects (CreateMemoryDto.cs)
│   ├── Services/             # Business Logic & Persistence (IMemoryService, MemoryService)
│   ├── Data/                 # Persistent storage (memories.json)
│   ├── Program.cs            # Dependency Injection, Middleware & CORS
│   └── backend.csproj        # Targets net10.0
│
├── react-app/                # React 19 Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Friendship branding & live counters
│   │   │   ├── MilestonesRibbon.jsx # Days of friendship, moments, core stats
│   │   │   ├── MemoryCard.jsx       # Photo, location, mood, inside joke, core star
│   │   │   ├── MemoryModal.jsx      # Controlled modal form with presets
│   │   │   └── LearningBanner.jsx   # In-app React concept guide
│   │   ├── App.jsx                  # State management, views & backend sync
│   │   ├── App.css                  # River & Scrapbook layouts
│   │   └── index.css                # Nostalgic dark-mode design system
│   └── vite.config.js               # Dev proxy to backend
│
└── angular-app/              # Angular Frontend (Bridging phase)
    └── README.md             # React -> Angular translation guide
```

---

## 🚀 Quick Start Guide

### 1. Run the .NET 10 Backend API
```bash
cd backend
dotnet build
dotnet bin/Debug/net10.0/backend.dll
# API Server: http://localhost:5000 (OpenAPI / Health at /api/health)
```

### 2. Run the React Frontend

```bash
cd react-app
npm install
npm run dev
# App: http://localhost:3000
```

---

## 🗺️ Progressive Curriculum

### 🟢 Phase 1: React Mastery
- [x] **Step 1: Foundations & Architecture**
  - Mental model: Components, JSX syntax, props passing, and lifting state up.
  - State management: `useState` for search, mood filters, view modes, and form controls.
  - Immutability: Adding, toggling, and deleting memories immutably.
  - Derived State: Calculating "Days of Friendship" dynamically from dates without redundant state.
  - Backend integration: REST API synchronization (`GET`, `POST`, `PUT`, `DELETE`).
- [ ] **Step 2: Intermediate React (Hooks & UX Polish)**
  - Custom Hooks: `useMemories` and `useDebounce` to decouple logic from presentation.
  - Optimistic UI updates (instant heart toggle before server responds).
  - Search debouncing.
- [ ] **Step 3: Advanced React (Architecture & Context)**
  - Global State Management with React Context API.
  - Memoization with `useMemo` and `useCallback`.
  - Ambient nostalgic music player or audio toggle.

---

### 🔴 Phase 2: Angular Mastery (The Bridge)
- [ ] Standalone Components & Directives
- [ ] Angular Signals (`signal()`, `computed()`) vs `useState`
- [ ] Reactive Forms vs React Controlled Forms
- [ ] Injectable Services (`HttpClient`) vs React Custom Hooks

---

*All code changes are committed and pushed to [GitHub](https://github.com/SubodhMuneshwar/react_angular.git).*
