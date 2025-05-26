
using Microsoft.AspNetCore.Mvc;
using server_net.Models;
using server_net.Service;

namespace server_net.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController(IProductRepository repo) : ControllerBase
{
    private readonly IProductRepository _repo = repo;

    [HttpGet]
    public Task<IEnumerable<Product>> Get() => _repo.GetAllASync();

    [HttpPost]
    public async Task<IActionResult> Post(Product p)
    {
        var id = await _repo.CreateProduct(p);
        var p2 = p with { Id = (int)id };
        return CreatedAtAction(nameof(Get), new { id = p2.Id }, p2);
    }
}
