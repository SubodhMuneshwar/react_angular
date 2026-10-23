using System.Text.Json;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Services & Dependency Injection (DI)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Enforce camelCase JSON naming so C# PascalCase properties match React/Angular expectations
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// 2. Register Business Logic Service as Singleton (in-memory lock across requests)
builder.Services.AddSingleton<IMemoryService, MemoryService>();

// 3. Configure OpenAPI / Swagger documentation
builder.Services.AddOpenApi();

// 4. Configure Cross-Origin Resource Sharing (CORS) for React (3000) and Angular (4200)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontends", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:4200", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline (Middleware)
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontends");

// Optional: Quick Health Check endpoint
app.MapGet("/api/health", () => Results.Ok(new
{
    status = "ok",
    framework = ".NET 10",
    app = "Timeline Backend",
    timestamp = DateTime.UtcNow
}));

app.MapControllers();

app.Run();
