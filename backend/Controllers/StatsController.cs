using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatsController : ControllerBase
{
    private readonly IMemoryService _memoryService;

    public StatsController(IMemoryService memoryService)
    {
        _memoryService = memoryService;
    }

    /// <summary>
    /// GET /api/stats
    /// Returns friendship analytics (Days of friendship, total memories, core memories count, adventures).
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<FriendshipStats>> GetStats()
    {
        var stats = await _memoryService.GetFriendshipStatsAsync();
        return Ok(stats);
    }
}
