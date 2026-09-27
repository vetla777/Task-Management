using System;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Core.Entities;
using TaskManagement.Core.Interfaces;

namespace TaskManagement.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context, IPasswordHasher passwordHasher)
    {
        if (await context.Database.CanConnectAsync())
        {
            await context.Database.EnsureCreatedAsync();
        }

        if (await context.Users.AnyAsync())
        {
            return; // DB already seeded
        }

        var adminUser = new User
        {
            Username = "admin",
            Email = "admin@taskmanagement.com",
            PasswordHash = passwordHasher.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            CreatedAt = DateTime.UtcNow
        };

        var regularUser = new User
        {
            Username = "johndoe",
            Email = "john@taskmanagement.com",
            PasswordHash = passwordHasher.HashPassword("User123!"),
            Role = UserRole.User,
            CreatedAt = DateTime.UtcNow
        };

        context.Users.AddRange(adminUser, regularUser);
        await context.SaveChangesAsync();

        var tasks = new[]
        {
            new TaskItem
            {
                Title = "Set up Production CI/CD Pipeline",
                Description = "Configure GitHub Actions workflow for automated testing and deployment to cloud infrastructure.",
                Priority = TaskPriority.Critical,
                Status = TaskManagement.Core.Entities.TaskStatus.InProgress,
                AssignedUserId = adminUser.Id,
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new TaskItem
            {
                Title = "Implement User Profile Settings",
                Description = "Allow users to update their avatar, password, and notification preferences.",
                Priority = TaskPriority.High,
                Status = TaskManagement.Core.Entities.TaskStatus.Pending,
                AssignedUserId = regularUser.Id,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new TaskItem
            {
                Title = "Database Index Optimization",
                Description = "Review query execution plans and add composite indexes on Task filter columns.",
                Priority = TaskPriority.Medium,
                Status = TaskManagement.Core.Entities.TaskStatus.Completed,
                AssignedUserId = adminUser.Id,
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new TaskItem
            {
                Title = "Documentation for REST API",
                Description = "Generate OpenAPI schema and write usage guides with Swagger UI.",
                Priority = TaskPriority.Low,
                Status = TaskManagement.Core.Entities.TaskStatus.Completed,
                AssignedUserId = regularUser.Id,
                CreatedAt = DateTime.UtcNow.AddDays(-4),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            }
        };

        context.Tasks.AddRange(tasks);
        await context.SaveChangesAsync();
    }
}
