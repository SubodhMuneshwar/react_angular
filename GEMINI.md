# GEMINI.md: Workspace Rules & Architecture Guide

Welcome to the **Timeline** repository. This document defines the architectural invariants, directory mapping, coding standards, and verification protocols for pair-programming and autonomous agent operations in this workspace.

---

## 🛠️ Detected Technology Stack & Versions

| Layer | Technology | Exact Version | Key Responsibilities |
|---|---|---|---|
| **Frontend (Primary)** | **React** | `19.3.1` | User interface, client-side encryption, reactive state |
| **Tooling & Linter** | **Vite / ESLint** | `vite@8.3.5`, `eslint@10.13.0` | Development server, bundling, ESLint hooks rules |
| **Backend API** | **.NET / C#** | `net10.0` (SDK `10.0.402`) | ASP.NET Core Web API, Controllers, storage orchestration |
| **API Documentation** | **OpenAPI / Swagger** | `Microsoft.AspNetCore.OpenApi 10.x` | Native endpoint documentation |
| **Frontend (Phase 2)** | **Angular** | `22.2.x` | Secondary frontend implementation for concept comparison |
| **Security & Privacy** | **Web Crypto API** | Native Browser (AES-256-GCM) | Client-side End-to-End Encryption (E2EE) |
| **Storage Provider** | **Google Drive API** | v3 via Backend Proxy (`IStorageProvider`) | Encrypted media storage (5 TB capacity plan) |

---

## 📁 Core Directory Map

Use canonical workspace-relative `@path` references when discussing or modifying code in these subsystems:

* `@root`: `./` — Workspace root
* `@react/`: `react/` — React 19 frontend application
  * `@react/src/`: Component hierarchy, custom hooks, and styles
  * `@react/src/components/`: UI components (`Header`, `MemoryCard`, `MemoryModal`, etc.)
  * `@react/src/hooks/`: Custom hooks encapsulating state & API logic (`useMemories`, `useDebounce`)
* `@backend/`: `backend/` — .NET 10 ASP.NET Core Web API
  * `@backend/Controllers/`: API route handlers with attribute routing
  * `@backend/Models/`: Domain entities (`Memory.cs`, `FriendshipStats.cs`)
  * `@backend/DTOs/`: Data transfer objects with validation annotations
  * `@backend/Services/`: Business logic, thread safety, and persistence contracts
  * `@backend/Middleware/`: Global exception handling & security middleware
* `@angular/`: `angular/` — Angular 22 frontend (Phase 2)
* `@docs/`: `docs/` — Architectural guides & translation cheatsheets
* `@agents/`: `.agents/` — Custom Antigravity skills & workspace MCP configs

---

## 🔒 Strict Coding Invariants

### 1. End-to-End Encryption (E2EE) Security Boundary
* **Client-Side Only**: All photo, video, audio, and document payloads **must be encrypted in the client browser** using AES-256-GCM before network transmission.
* **Ciphertext-Only Ingestion**: Backend DTOs and `IStorageProvider` (Google Drive) **only ever receive and store encrypted ciphertext streams/blobs, Initialization Vectors (IVs), and non-sensitive metadata—never plaintext media or raw cryptographic keys under any circumstance**.
* **Key Isolation**: Master encryption keys are derived on-device (PBKDF2/Argon2 + AES-GCM) from user credentials and **must never be sent to the backend server, Google Drive, or any external service**.

### 2. .NET 10 Backend Invariants
* **Clean Architecture & Separation of Concerns**: Controllers must remain thin. Controllers only handle HTTP status codes, routing, and model state validation. All data I/O and calculations must live in `Services/`.
* **DTO vs Model Separation**: Never bind domain entities (`Models/`) directly to incoming request bodies. Always bind via typed DTOs (`DTOs/`) with validation attributes (`[Required]`, `[MaxLength]`).
* **Async All the Way**: All I/O operations must use asynchronous signatures (`async Task<T>`) and support cancellation tokens where applicable.
* **JSON Serialization**: Enforce `JsonNamingPolicy.CamelCase` in `Program.cs` so C# PascalCase properties map seamlessly to frontend camelCase expectations.
* **Thread Safety**: File-based and in-memory persistence stores must be guarded by synchronization primitives (e.g., `SemaphoreSlim`).

### 3. React 19 Frontend Invariants
* **Functional Components & Explicit Props**: All components are pure functional components. Props must be explicitly destructured and typed.
* **Rules of Hooks**: Strict compliance with `eslint-plugin-react-hooks`. Never call hooks inside loops, conditions, or nested functions. All variables used inside `useEffect` must be declared in its dependency array or encapsulated in custom hooks.
* **Separation of Logic & UI**: Do not embed raw `fetch()` calls or complex state logic inside UI components. Extract reusable state operations into custom hooks (`@react/src/hooks/`).
* **State Immutability**: Never mutate state directly (e.g. `array.push()`). Always create new references (`[...prev, item]`, `prev.map(...)`, `prev.filter(...)`).
* **Controlled Inputs**: All input fields in forms must be controlled via React state (`value` + `onChange`).

### 4. Secrets & Environment Handling
* **No Hardcoded Secrets**: Passwords, tokens, API keys, and connection strings must use environment variables (`${ENV_VAR}`) or `.env` files (which must be git-ignored).

---

## 🧪 Verification Protocol

Before committing or completing any task, execute the corresponding verification steps:

### Backend (.NET 10)
```powershell
# 1. Build backend with zero warnings/errors
dotnet build backend

# 2. Run automated tests (when test project is present)
dotnet test backend

# 3. Test API Health Endpoint
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```

### Frontend (React 19)
```powershell
# 1. Run ESLint checks (ensures React Hooks rules and syntax compliance)
npm.cmd --prefix react run lint

# 2. Verify production bundle build
npm.cmd --prefix react run build
```
