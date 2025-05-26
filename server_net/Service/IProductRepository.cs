using server_net.Models;

namespace server_net.Service;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllASync();
    Task<long> CreateProduct(Product p);
}
