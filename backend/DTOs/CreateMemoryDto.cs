using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateMemoryDto
{
    [Required(ErrorMessage = "Title is required")]
    public string Title { get; set; } = string.Empty;

    public string? Date { get; set; }

    public string? Location { get; set; }

    public string? Mood { get; set; }

    public string? Story { get; set; }

    public string? InsideJoke { get; set; }

    public bool IsCoreMemory { get; set; }

    public string? ImageUrl { get; set; }
}
