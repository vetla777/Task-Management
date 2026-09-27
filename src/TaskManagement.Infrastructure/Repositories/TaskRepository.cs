using Microsoft.EntityFrameworkCore;
using TaskManagement.Core.Entities;
using TaskManagement.Core.Interfaces;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _context;

    public TaskRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TaskItem?> GetByIdAsync(int id)
        => await _context.Tasks.Include(t => t.AssignedUser).FirstOrDefaultAsync(t => t.Id == id);

    public async Task<IEnumerable<TaskItem>> GetAllAsync(string? filter = null, int? priority = null, int? status = null)
    {
        var query = _context.Tasks.Include(t => t.AssignedUser).AsQueryable();

        if (!string.IsNullOrEmpty(filter))
            query = query.Where(t => t.Title.Contains(filter) || (t.Description != null && t.Description.Contains(filter)));

        if (priority.HasValue)
            query = query.Where(t => (int)t.Priority == priority.Value);

        if (status.HasValue)
            query = query.Where(t => (int)t.Status == status.Value);

        return await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
    }

    public async Task<TaskItem> CreateAsync(TaskItem task)
    {
        task.CreatedAt = DateTime.UtcNow;
        task.UpdatedAt = DateTime.UtcNow;
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task<TaskItem> UpdateAsync(TaskItem task)
    {
        task.UpdatedAt = DateTime.UtcNow;
        _context.Tasks.Update(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return false;
        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return true;
    }
}
