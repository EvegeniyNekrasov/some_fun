using Microsoft.Data.Sqlite;
using server_net;
using server_net.Service;
using Serilog;
using Serilog.Events;
using server_net.Service.Users;

var builder = WebApplication.CreateBuilder(args);
var connStr = builder.Configuration.GetConnectionString("Default");


SeedData.NewData(new SqliteConnection(connStr));

builder.Services.AddSingleton<IProductRepository, ProductRepository>();
builder.Services.AddSingleton<IUsersRepository, UsersRepository>();

builder.Host.UseSerilog((context, config) =>
    config.ReadFrom.Configuration(context.Configuration));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My api v1");
    });
}
app.UseSerilogRequestLogging();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
