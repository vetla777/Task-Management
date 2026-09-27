using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TaskManagement.Core.Entities;

public class User
{
    [Key] public int Id { get; set; }
    [Required] [MaxLength(100)] public string Username { get; set; } = string.Empty;
    [Required] [MaxLength(200)] public string Email { get; set; } = string.Empty;
    [Required] public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.User;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TaskItem> AssignedTasks { get; set; } = new List<TaskItem>();
}
