
using server_net.Models;

namespace server_net.Service.Users;

public interface IUsersRepository
{
    Task<IEnumerable<UsersShort>> GetAllUsers();
    Task<UsersShort?> GetUserById(long id);
    Task<long> CreateUser(UsersFull u);
    Task<bool> UpdateUser(UsersShort u);
    Task<bool> DeleteUser(long id);
}
