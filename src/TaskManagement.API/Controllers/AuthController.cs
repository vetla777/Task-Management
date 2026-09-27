using System.ComponentModel.DataAnnotations;
using TaskManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TaskManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepo;
    private readonly IJwtService _jwtService;
    private readonly IPasswordHasher _passwordHasher;

    public AuthController(IUserRepository userRepo, IJwtService jwtService, IPasswordHasher passwordHasher)
    {
        _userRepo = userRepo;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (await _userRepo.GetByEmailAsync(dto.Email) != null)
            return BadRequest(new { message = "Email already exists" });
        if (await _userRepo.GetByUsernameAsync(dto.Username) != null)
            return BadRequest(new { message = "Username already exists" });

        var user = new TaskManagement.Core.Entities.User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = _passwordHasher.HashPassword(dto.Password),
            Role = TaskManagement.Core.Entities.UserRole.User,
            CreatedAt = DateTime.UtcNow
        };
        await _userRepo.CreateAsync(user);
        return Ok(new { message = "Registration successful", username = user.Username });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _userRepo.GetByEmailAsync(dto.Email);
        if (user == null || !_passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password" });

        var token = _jwtService.GenerateToken(user);
        return Ok(new AuthResponseDto
        {
            Token = token,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role.ToString()
        });
    }
}

public class LoginDto
{
    [Required] [EmailAddress] public string Email { get; set; } = string.Empty;
    [Required] public string Password { get; set; } = string.Empty;
}

public class RegisterDto
{
    [Required] [MinLength(3)] [MaxLength(50)] public string Username { get; set; } = string.Empty;
    [Required] [EmailAddress] public string Email { get; set; } = string.Empty;
    [Required] [MinLength(6)] public string Password { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
