# 🏛️ .NET 10 Web API Architecture Guide

A quick-reference architectural guide for the **Timeline** backend built with **.NET 10** (`net10.0`).

---

## 📐 Clean Architecture Pattern

The backend is structured into clear layers to keep code maintainable, testable, and loosely coupled:

```
Controllers (HTTP / Routing)
      │
      ▼
   Services (Business Logic / File IO)
      │
      ▼
Domain Models & DTOs (Data Shapes & Contracts)
```

### 1. Domain Models vs Data Transfer Objects (DTOs)
* **Domain Models** (`backend/Models/`): Represent internal domain entities (e.g. `Memory.cs`, `FriendshipStats.cs`). They contain internal system fields such as database keys, creation timestamps, and internal flags.
* **DTOs** (`backend/DTOs/`): Define the contract for client requests (e.g. `CreateMemoryDto.cs`, `UpdateMemoryDto.cs`). They enforce validation rules using data annotations like `[Required]` before any business logic executes.

---

## 💉 Dependency Injection (DI) Lifetimes in .NET 10

ASP.NET Core provides three service lifetimes in `Program.cs`:

| Lifetime | Method | Usage |
|---|---|---|
| **Singleton** | `builder.Services.AddSingleton<TInterface, TImpl>()` | Created once per application lifecycle. Perfect for in-memory stores, caching, and state managers. |
| **Scoped** | `builder.Services.AddScoped<TInterface, TImpl>()` | Created once per HTTP request. Standard for database contexts (e.g. Entity Framework Core). |
| **Transient** | `builder.Services.AddTransient<TInterface, TImpl>()` | Created every time it is requested. Best for lightweight, stateless utilities. |

In this project, `IMemoryService` is registered as a **Singleton** to safely coordinate file I/O with `SemaphoreSlim` across asynchronous HTTP requests.

---

## 🌐 CamelCase Serialization for Frontend Interop

C# properties follow `PascalCase` (`IsCoreMemory`), whereas React and Angular expect `camelCase` (`isCoreMemory`). 
In .NET 10 `Program.cs`, we enforce automatic JSON conversion:

```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
```

---

## 🔒 Cross-Origin Resource Sharing (CORS)

Configured to allow the React client (`localhost:3000`) and future Angular client (`localhost:4200`) to access API endpoints:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontends", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```
