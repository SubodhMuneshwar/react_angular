using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MemoriesController : ControllerBase
{
    private readonly IMemoryService _memoryService;
    private readonly ILogger<MemoriesController> _logger;

    public MemoriesController(IMemoryService memoryService, ILogger<MemoriesController> logger)
    {
        _memoryService = memoryService;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/memories
    /// Supports optional filtering by search query, mood, year, and coreOnly.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Memory>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? mood,
        [FromQuery] string? year,
        [FromQuery] bool? coreOnly)
    {
        var memories = await _memoryService.GetMemoriesAsync(search, mood, year, coreOnly);
        return Ok(memories);
    }

    /// <summary>
    /// GET /api/memories/{id}
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Memory>> GetById(string id)
    {
        var memory = await _memoryService.GetMemoryByIdAsync(id);
        if (memory is null)
        {
            return NotFound(new { error = $"Memory with id '{id}' was not found" });
        }
        return Ok(memory);
    }

    /// <summary>
    /// POST /api/memories
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Memory>> Create([FromBody] CreateMemoryDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var created = await _memoryService.CreateMemoryAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// PUT /api/memories/{id}
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<Memory>> Update(string id, [FromBody] UpdateMemoryDto dto)
    {
        var updated = await _memoryService.UpdateMemoryAsync(id, dto);
        if (updated is null)
        {
            return NotFound(new { error = $"Memory with id '{id}' was not found" });
        }
        return Ok(updated);
    }

    /// <summary>
    /// DELETE /api/memories/{id}
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _memoryService.DeleteMemoryAsync(id);
        if (!deleted)
        {
            return NotFound(new { error = $"Memory with id '{id}' was not found" });
        }
        return Ok(new { message = "Memory deleted successfully", id });
    }
}
