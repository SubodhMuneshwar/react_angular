---
name: scaffold-vertical-slice
description: Scaffold an end-to-end full-stack feature slice across the .NET 10 backend (Model, DTO, Service, Controller, HTTP test) and React 19 frontend (Custom Hook, Component, UI state) with verification.
---

# Scaffold Full-Stack Vertical Slice

Use this skill when introducing a new domain feature or entity to the **Timeline** application. This checklist ensures consistency across the .NET 10 Web API backend and the React 19 frontend while adhering to Clean Architecture and end-to-end encryption boundaries.

---

## 1. Pre-Flight Diagnostics
Before adding files, verify that the active toolchains are operational:

1. **Verify .NET 10 SDK**:
   ```powershell
   dotnet --version
   # Expected output: 10.x
   ```
2. **Verify Node & npm**:
   ```powershell
   node -v; npm.cmd -v
   # Expected: Node 24.x, npm 11.x
   ```
3. **Verify Git Working Tree**:
   ```powershell
   git status
   ```

---

## 2. Phase 1: Backend Vertical Slice (.NET 10)

For a target entity `<Entity>` (e.g., `Memory`, `Tag`, `Album`):

### 1. Create Domain Entity
* **Location**: `@backend/Models/<Entity>.cs`
* **Rules**: 
  - Define namespace `backend.Models`.
  - Include unique `string Id`, audit timestamps (`DateTime CreatedAt`, `DateTime? UpdatedAt`).
  - Use PascalCase property naming.

### 2. Create Data Transfer Objects (DTOs)
* **Location**: `@backend/DTOs/Create<Entity>Dto.cs` and `@backend/DTOs/Update<Entity>Dto.cs`
* **Rules**:
  - Define namespace `backend.DTOs`.
  - Add `[Required]`, `[MaxLength]`, or range validation data annotations from `System.ComponentModel.DataAnnotations`.
  - Exclude system-generated fields (like `Id` and `CreatedAt`).
  - **E2EE Payload Contract**: For sensitive entries or media, DTOs must accept only ciphertext streams/base64 strings, Initialization Vector (`Iv`), and auth tag/metadata. Never accept plaintext data or raw encryption keys.

### 3. Define Service Contract & Implementation
* **Interface**: `@backend/Services/I<Entity>Service.cs`
* **Implementation**: `@backend/Services/<Entity>Service.cs`
* **Rules**:
  - Define asynchronous methods: `GetAsync`, `GetByIdAsync`, `CreateAsync`, `UpdateAsync`, `DeleteAsync`.
  - Inject `ILogger<EntityService>` and storage dependencies (`IStorageProvider`) via constructor.
  - Wrap shared resource I/O in thread-safe locks (`SemaphoreSlim`).

### 4. Register in Dependency Injection Container
* **Location**: `@backend/Program.cs`
* **Rules**:
  - Explicitly register the service contract and implementation in the DI container before `builder.Build()`:
    ```csharp
    builder.Services.AddScoped<I<Entity>Service, <Entity>Service>();
    ```

### 5. Create API Controller
* **Location**: `@backend/Controllers/<Entity>sController.cs`
* **Rules**:
  - Decorate with `[ApiController]` and `[Route("api/[controller]")]`.
  - Injects `I<Entity>Service` via constructor.
  - Return typed `ActionResult<T>` with appropriate HTTP status codes:
    - `200 Ok()`
    - `201 CreatedAtAction()`
    - `400 BadRequest(ModelState)`
    - `404 NotFound()`

### 6. Add HTTP Integration Test Requests
* **Location**: `@backend/backend.http`
* **Action**: Append sample `GET`, `POST`, `PUT`, `DELETE` requests to quickly verify the new slice using the REST client.

---

## 3. Phase 2: Frontend Vertical Slice (React 19)

### 1. Create Custom Hook
* **Location**: `@react/src/hooks/use<Entity>s.js`
* **Rules**:
  - Encapsulate `useState` (`items`, `isLoading`, `error`) and `useEffect` data fetching.
  - Provide action handlers (`addItem`, `updateItem`, `deleteItem`) with optimistic UI updates.
  - **Client-Side E2EE Encryption**: If the slice handles user media (photos, videos, audio, docs) or sensitive timeline entries, `use<Entity>s.js` must pass data through the client-side Web Crypto AES-256-GCM encryption layer (`crypto.subtle`) before sending payloads to the API. Payloads sent to the backend must strictly contain ciphertext, IV, and metadata only.
  - Export the hook from `@react/src/hooks/index.js`.

### 2. Create UI Component(s)
* **Location**: `@react/src/components/<Entity>Card.jsx` and `@react/src/components/<Entity>Modal.jsx`
* **Rules**:
  - Pure functional components with destructured props.
  - Form inputs must be controlled (`value` + `onChange`).
  - Form submission must call `e.preventDefault()`.
  - Trigger feedback via `<Toast />` component upon mutation.

### 3. Connect to Main Application
* **Location**: `@react/src/App.jsx`
* **Action**: Import custom hook and render the new component into the layout.

---

## 4. Phase 3: Verification Protocol

Execute the verification protocol before committing changes:

```powershell
# 1. Compile backend
dotnet build backend

# 2. Check React syntax & hook rules
npm.cmd --prefix react run lint

# 3. Test React production bundle
npm.cmd --prefix react run build
```

---

## 5. Safe Rollback Protocol (Targeted Revert)

> [!WARNING]
> Never run global destructive commands such as `git clean -fd` or `git restore .`, as they can permanently delete unrelated uncommitted work across the repository.

If verification fails and issues cannot be immediately resolved, revert **only** the specific `<Entity>` files created or touched during this slice run:

```powershell
# 1. Review status of modified and untracked files
git status

# 2. Revert modified shared files touched during this slice
git restore backend/Program.cs react/src/App.jsx

# 3. Remove only new entity-specific files created during this run
Remove-Item -Force backend/Models/<Entity>.cs -ErrorAction SilentlyContinue
Remove-Item -Force backend/DTOs/Create<Entity>Dto.cs, backend/DTOs/Update<Entity>Dto.cs -ErrorAction SilentlyContinue
Remove-Item -Force backend/Services/I<Entity>Service.cs, backend/Services/<Entity>Service.cs -ErrorAction SilentlyContinue
Remove-Item -Force backend/Controllers/<Entity>sController.cs -ErrorAction SilentlyContinue
Remove-Item -Force react/src/hooks/use<Entity>s.js -ErrorAction SilentlyContinue
Remove-Item -Force react/src/components/<Entity>Card.jsx, react/src/components/<Entity>Modal.jsx -ErrorAction SilentlyContinue

# 4. Verify working tree status
git status
```
