using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactUI", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=.;Database=TaskManagementDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true;";

builder.Services.AddDbContext<TaskManagement.Infrastructure.Data.AppDbContext>(options =>
    options.UseSqlServer(connectionString, sql => sql.EnableRetryOnFailure()));

builder.Services.AddScoped<TaskManagement.Core.Interfaces.ITaskRepository, TaskManagement.Infrastructure.Repositories.TaskRepository>();
builder.Services.AddScoped<TaskManagement.Core.Interfaces.IUserRepository, TaskManagement.Infrastructure.Repositories.UserRepository>();
builder.Services.AddScoped<TaskManagement.Core.Interfaces.IJwtService, TaskManagement.Infrastructure.Services.JwtService>();
builder.Services.AddScoped<TaskManagement.Core.Interfaces.IPasswordHasher, TaskManagement.Infrastructure.Services.PasswordHasher>();

builder.Services.AddAuthentication(Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "TaskManagementApi",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "TaskManagementUI",
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "superSecretKey123!_changeThisInProduction12345!"))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors("AllowReactUI");

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.MapGet("/", () => "Task Management API is running. Try POST /api/auth/login or GET /api/tasks");

await Task.Run(async () =>
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<TaskManagement.Infrastructure.Data.AppDbContext>();
        var hasher = scope.ServiceProvider.GetRequiredService<TaskManagement.Core.Interfaces.IPasswordHasher>();
        await TaskManagement.Infrastructure.Data.DbInitializer.SeedAsync(context, hasher);
    }
});

app.Run();
