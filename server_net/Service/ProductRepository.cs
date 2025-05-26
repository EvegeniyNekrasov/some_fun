using System;
using System.Collections.Generic;
using Microsoft.Data.Sqlite;
using System.Linq;
using System.Threading.Tasks;
using server_net.Models;

namespace server_net.Service;

public class ProductRepository(IConfiguration config) : IProductRepository
{
    private readonly string _connStr = config.GetConnectionString("Default")!;
    public async Task<long> CreateProduct(Product p)
    {
        const string sql = @"
            INSERT INTO Products (Name, Price) 
            VALUES (@name,@price);
            SELECT last_insert_rowid();";

        await using var conn = new SqliteConnection(_connStr);
        await conn.OpenAsync();
        await using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@name", p.Name);
        cmd.Parameters.AddWithValue("@price", p.Price);
        var result = await cmd.ExecuteScalarAsync();
        var id = result != null ? (long)result : 0;
        return id;
    }

    public async Task<IEnumerable<Product>> GetAllASync()
    {
        const string sql = "SELECT Id, Name, Price FROM Products;";
        var list = new List<Product>();
        await using var conn = new SqliteConnection(_connStr);
        await conn.OpenAsync();
        await using var cmd = new SqliteCommand(sql, conn);
        await using var rdr = await cmd.ExecuteReaderAsync();
        while (await rdr.ReadAsync())
        {
            list.Add(new Product
            {
                Id = rdr.GetInt64(0),
                Name = rdr.GetString(1),
                Price = rdr.GetDecimal(2)
            });
        }
        return list;
    }
}
