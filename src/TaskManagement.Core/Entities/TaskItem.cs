using System;
using System.ComponentModel.DataAnnotations;

namespace TaskManagement.Core.Entities;

public class TaskItem
{
    [Key] public int Id { get; set; }
    [Required] [MaxLength(200)] public string Title { get; set; } = string.Empty;
    [MaxLength(2000)] public string? Description { get; set; }
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public TaskStatus Status { get; set; } = TaskStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // User assignment
    public int? AssignedUserId { get; set; }
    public User? AssignedUser { get; set; }
}
