namespace backend.Models;

public class Memory
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Mood { get; set; } = "Laughter";
    public string Story { get; set; } = string.Empty;
    public string? InsideJoke { get; set; }
    public bool IsCoreMemory { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
