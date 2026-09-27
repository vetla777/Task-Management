using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using TaskManagement.Core.Entities;

namespace TaskManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly TaskManagement.Core.Interfaces.ITaskRepository _repo;

    public TasksController(TaskManagement.Core.Interfaces.ITaskRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? filter, [FromQuery] int? priority, [FromQuery] int? status)
    {
        var tasks = await _repo.GetAllAsync(filter, priority, status);
        var result = tasks.Select(t => new TaskDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Priority = (int)t.Priority,
            Status = (int)t.Status,
            AssignedUserId = t.AssignedUserId,
            AssignedUserName = t.AssignedUser?.Username,
            CreatedAt = t.CreatedAt,
            UpdatedAt = t.UpdatedAt
        });
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _repo.GetByIdAsync(id);
        if (task == null) return NotFound();
        return Ok(MapToDto(task));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateTaskDto dto)
    {
        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            Priority = (TaskPriority)dto.Priority,
            Status = (TaskManagement.Core.Entities.TaskStatus)dto.Status,
            AssignedUserId = dto.AssignedUserId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _repo.CreateAsync(task);
        return CreatedAtAction(nameof(GetById), new { id = task.Id }, MapToDto(task));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return NotFound();
        if (dto.Title != null) existing.Title = dto.Title;
        if (dto.Description != null) existing.Description = dto.Description;
        if (dto.Priority.HasValue) existing.Priority = (TaskPriority)dto.Priority.Value;
        if (dto.Status.HasValue) existing.Status = (TaskManagement.Core.Entities.TaskStatus)dto.Status.Value;
        if (dto.AssignedUserId.HasValue) existing.AssignedUserId = dto.AssignedUserId;
        await _repo.UpdateAsync(existing);
        return Ok(MapToDto(existing));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _repo.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }

    private TaskDto MapToDto(TaskItem t) => new TaskDto
    {
        Id = t.Id,
        Title = t.Title,
        Description = t.Description,
        Priority = (int)t.Priority,
        Status = (int)t.Status,
        AssignedUserId = t.AssignedUserId,
        AssignedUserName = t.AssignedUser?.Username,
        CreatedAt = t.CreatedAt,
        UpdatedAt = t.UpdatedAt
    };
}

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
    [Range(1, 4)] public int Priority { get; set; } = 2;
    [Range(1, 4)] public int Status { get; set; } = 1;
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
