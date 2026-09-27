using System;
using System.ComponentModel.DataAnnotations;

namespace TaskManagement.Core.DTOs;

public class TaskDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Priority { get; set; }
    public int Status { get; set; }
    public int? AssignedUserId { get; set; }
    public string? AssignedUserName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateTaskDto
{
    [Required] [MaxLength(200)] public string Title { get; set; } = string.Empty;
    [MaxLength(2000)] public string? Description { get; set; }
    [Range(1, 4)] public int Priority { get; set; } = 2; // Medium
    [Range(1, 4)] public int Status { get; set; } = 1; // Pending
    public int? AssignedUserId { get; set; }
}

public class UpdateTaskDto
{
    [MaxLength(200)] public string? Title { get; set; }
    [MaxLength(2000)] public string? Description { get; set; }
    [Range(1, 4)] public int? Priority { get; set; }
    [Range(1, 4)] public int? Status { get; set; }
    public int? AssignedUserId { get; set; }
}
