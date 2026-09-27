using Microsoft.AspNetCore.Mvc;
using TaskManagement.Core.DTOs;
using TaskManagement.Core.Interfaces;

namespace TaskManagement.Tests;

public class AuthControllerTests
{
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly Mock<IJwtService> _jwtMock = new();
    private readonly Mock<IPasswordHasher> _hasherMock = new();
    private AuthController _controller;

    [Fact]
    public async Task Login_ReturnsToken_WhenCredentialsValid()
    {
        _userRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync(new User { Id = 1, Email = "test@test.com", Username = "test", Role = UserRole.User, PasswordHash = "hash" });
        _hasherMock.Setup(h => h.VerifyPassword(It.IsAny<string>(), It.IsAny<string>())).Returns(true);
        _jwtMock.Setup(j => j.GenerateToken(It.IsAny<User>())).Returns("token123");

        _controller = new AuthController(_userRepoMock.Object, _jwtMock.Object, _hasherMock.Object);

        var result = await _controller.Login(new LoginDto { Email = "test@test.com", Password = "pwd" }) as OkObjectResult;

        Assert.NotNull(result);
        Assert.IsType<AuthResponseDto>(result.Value);
    }
}
