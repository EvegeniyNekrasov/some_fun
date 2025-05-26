
namespace server_net.Models;

public record UsersShort(
    long Id,
    string User,
    string Username,
    string Email,
    string? Role
);
