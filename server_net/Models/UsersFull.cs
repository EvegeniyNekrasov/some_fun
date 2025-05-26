namespace server_net.Models;

public record UsersFull(
    long Id,
    string User,
    string Username,
    string Email,
    string Password,
    string? Role
);
