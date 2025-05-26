using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using server_net.Models;
using server_net.Service.Users;

namespace server_net.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUsersRepository repository, ILogger<UsersController> logger) : ControllerBase
{
    private readonly ILogger _logger = logger;
    private readonly IUsersRepository _reposiotry = repository;

    [HttpGet]
    public Task<IEnumerable<UsersShort>> Get() => _reposiotry.GetAllUsers();


    [HttpPost]
    public async Task<IActionResult> Post(UsersFull u)
    {
        var id = await _reposiotry.CreateUser(u);
        var u2 = u with { Id = id };
        _logger.LogInformation("User created {Id}", id);
        return CreatedAtAction(nameof(Get), new { id = u2.Id }, u2);
    }
}
