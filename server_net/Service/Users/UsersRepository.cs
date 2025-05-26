using Microsoft.Data.Sqlite;
using server_net.Models;
using server_net.Utils;

namespace server_net.Service.Users;

public class UsersRepository(IConfiguration config) : IUsersRepository
{
    private readonly string _connStr = config.GetConnectionString(ConnectionStringKey.Default)!;

    /// <summary>
    /// Create a new user in table Users 
    /// </summary>
    /// <param name="u"></param>
    /// <returns>Created user Id</returns>
    public async Task<long> CreateUser(UsersFull u)
    {
        const string sql = @"
            INSERT INTO Users (User, Username, Email, Password, Role)
            VALUES (@user, @username, @email, @password, @role);
            SELECT last_insert_rowid();
        ";

        await using var conn = new SqliteConnection(_connStr);
        await conn.OpenAsync();
        await using var cmd = new SqliteCommand(sql, conn);

        cmd.Parameters.AddWithValue("@user", u.User);
        cmd.Parameters.AddWithValue("@username", u.Username);
        cmd.Parameters.AddWithValue("@email", u.Email);
        cmd.Parameters.AddWithValue("@password", u.Password);
        cmd.Parameters.AddWithValue("@role", u.Role);

        var result = await cmd.ExecuteScalarAsync();
        var id = result != null ? (long)result : 0;


        return id;
    }

    public Task<bool> DeleteUser(long id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<UsersShort>> GetAllUsers()
    {
        throw new NotImplementedException();
    }

    public Task<UsersShort?> GetUserById(long id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateUser(UsersShort u)
    {
        throw new NotImplementedException();
    }
}
