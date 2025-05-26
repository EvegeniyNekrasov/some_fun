using System.ComponentModel.DataAnnotations;

namespace server_net.Models;

public record Product
{
    public long Id { get; init; }
    [Required] public string Name { get; init; } = "";
    [Range(0.01, 9999)] public decimal Price { get; init; }
}