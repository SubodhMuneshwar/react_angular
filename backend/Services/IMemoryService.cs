using backend.DTOs;
using backend.Models;

namespace backend.Services;

public interface IMemoryService
{
    Task<IEnumerable<Memory>> GetMemoriesAsync(string? search, string? mood, string? year, bool? coreOnly);
    Task<Memory?> GetMemoryByIdAsync(string id);
    Task<Memory> CreateMemoryAsync(CreateMemoryDto dto);
    Task<Memory?> UpdateMemoryAsync(string id, UpdateMemoryDto dto);
    Task<bool> DeleteMemoryAsync(string id);
    Task<FriendshipStats> GetFriendshipStatsAsync();
}
