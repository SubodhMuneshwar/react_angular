using System.Text.Json;
using backend.DTOs;
using backend.Models;

namespace backend.Services;

public class MemoryService : IMemoryService
{
    private readonly string _filePath;
    private readonly ILogger<MemoryService> _logger;
    private readonly SemaphoreSlim _lock = new(1, 1);
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    };

    public MemoryService(IWebHostEnvironment env, ILogger<MemoryService> logger)
    {
        _logger = logger;
        _filePath = Path.Combine(env.ContentRootPath, "Data", "memories.json");
    }

    private async Task<List<Memory>> ReadFromFileAsync()
    {
        if (!File.Exists(_filePath))
        {
            return [];
        }

        try
        {
            await using var stream = File.OpenRead(_filePath);
            var memories = await JsonSerializer.DeserializeAsync<List<Memory>>(stream, _jsonOptions);
            return memories ?? [];
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reading memories from {FilePath}", _filePath);
            return [];
        }
    }

    private async Task SaveToFileAsync(List<Memory> memories)
    {
        try
        {
            var dir = Path.GetDirectoryName(_filePath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            await using var stream = File.Create(_filePath);
            await JsonSerializer.SerializeAsync(stream, memories, _jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error writing memories to {FilePath}", _filePath);
            throw;
        }
    }

    public async Task<IEnumerable<Memory>> GetMemoriesAsync(string? search, string? mood, string? year, bool? coreOnly)
    {
        await _lock.WaitAsync();
        try
        {
            var memories = await ReadFromFileAsync();

            var query = memories.AsEnumerable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                query = query.Where(m =>
                    m.Title.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                    m.Story.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                    m.Location.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                    (!string.IsNullOrEmpty(m.InsideJoke) && m.InsideJoke.Contains(term, StringComparison.OrdinalIgnoreCase)));
            }

            if (!string.IsNullOrWhiteSpace(mood) && !mood.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(m => m.Mood.Equals(mood, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrWhiteSpace(year) && !year.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(m =>
                {
                    if (DateTime.TryParse(m.Date, out var d))
                    {
                        return d.Year.ToString() == year;
                    }
                    return false;
                });
            }

            if (coreOnly == true)
            {
                query = query.Where(m => m.IsCoreMemory);
            }

            // Sort chronologically (newest first)
            return query
                .OrderByDescending(m => DateTime.TryParse(m.Date, out var d) ? d : DateTime.MinValue)
                .ToList();
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<Memory?> GetMemoryByIdAsync(string id)
    {
        await _lock.WaitAsync();
        try
        {
            var memories = await ReadFromFileAsync();
            return memories.FirstOrDefault(m => m.Id == id);
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<Memory> CreateMemoryAsync(CreateMemoryDto dto)
    {
        await _lock.WaitAsync();
        try
        {
            var memories = await ReadFromFileAsync();

            var newMemory = new Memory
            {
                Id = $"mem-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
                Title = dto.Title.Trim(),
                Date = !string.IsNullOrWhiteSpace(dto.Date) ? dto.Date : DateTime.UtcNow.ToString("yyyy-MM-dd"),
                Location = !string.IsNullOrWhiteSpace(dto.Location) ? dto.Location.Trim() : "Unknown Place",
                Mood = !string.IsNullOrWhiteSpace(dto.Mood) ? dto.Mood : "Laughter",
                Story = dto.Story?.Trim() ?? string.Empty,
                InsideJoke = string.IsNullOrWhiteSpace(dto.InsideJoke) ? null : dto.InsideJoke.Trim(),
                IsCoreMemory = dto.IsCoreMemory,
                ImageUrl = !string.IsNullOrWhiteSpace(dto.ImageUrl) ? dto.ImageUrl.Trim() : "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
                CreatedAt = DateTime.UtcNow
            };

            memories.Add(newMemory);
            await SaveToFileAsync(memories);
            return newMemory;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<Memory?> UpdateMemoryAsync(string id, UpdateMemoryDto dto)
    {
        await _lock.WaitAsync();
        try
        {
            var memories = await ReadFromFileAsync();
            var existing = memories.FirstOrDefault(m => m.Id == id);
            if (existing is null)
            {
                return null;
            }

            if (!string.IsNullOrWhiteSpace(dto.Title)) existing.Title = dto.Title.Trim();
            if (!string.IsNullOrWhiteSpace(dto.Date)) existing.Date = dto.Date;
            if (!string.IsNullOrWhiteSpace(dto.Location)) existing.Location = dto.Location.Trim();
            if (!string.IsNullOrWhiteSpace(dto.Mood)) existing.Mood = dto.Mood;
            if (dto.Story is not null) existing.Story = dto.Story.Trim();
            if (dto.InsideJoke is not null) existing.InsideJoke = string.IsNullOrWhiteSpace(dto.InsideJoke) ? null : dto.InsideJoke.Trim();
            if (dto.IsCoreMemory.HasValue) existing.IsCoreMemory = dto.IsCoreMemory.Value;
            if (!string.IsNullOrWhiteSpace(dto.ImageUrl)) existing.ImageUrl = dto.ImageUrl.Trim();

            existing.UpdatedAt = DateTime.UtcNow;

            await SaveToFileAsync(memories);
            return existing;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<bool> DeleteMemoryAsync(string id)
    {
        await _lock.WaitAsync();
        try
        {
            var memories = await ReadFromFileAsync();
            var item = memories.FirstOrDefault(m => m.Id == id);
            if (item is null)
            {
                return false;
            }

            memories.Remove(item);
            await SaveToFileAsync(memories);
            return true;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<FriendshipStats> GetFriendshipStatsAsync()
    {
        await _lock.WaitAsync();
        try
        {
            var memories = await ReadFromFileAsync();
            if (memories.Count == 0)
            {
                return new FriendshipStats();
            }

            var validDates = memories
                .Select(m => DateTime.TryParse(m.Date, out var d) ? d : (DateTime?)null)
                .Where(d => d.HasValue)
                .Select(d => d!.Value)
                .ToList();

            var days = 0;
            if (validDates.Count > 0)
            {
                var earliest = validDates.Min();
                days = Math.Max(1, (int)Math.Ceiling((DateTime.UtcNow - earliest).TotalDays));
            }

            return new FriendshipStats
            {
                DaysOfFriendship = days,
                TotalMemories = memories.Count,
                CoreMemories = memories.Count(m => m.IsCoreMemory),
                Adventures = memories.Count(m => m.Mood.Equals("Adventure", StringComparison.OrdinalIgnoreCase))
            };
        }
        finally
        {
            _lock.Release();
        }
    }
}
