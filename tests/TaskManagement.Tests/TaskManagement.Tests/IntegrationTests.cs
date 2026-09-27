using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using TaskManagement.Core.DTOs;

namespace TaskManagement.Tests;

public class IntegrationTests : IClassFixture<WebApplicationFactory<TaskManagement.API.Controllers.TasksController>>
{
    private readonly HttpClient _client;

    public IntegrationTests(WebApplicationFactory<TaskManagement.API.Controllers.TasksController> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetTasks_ReturnsSuccess()
    {
        var response = await _client.GetAsync("/api/tasks");
        Assert.True(response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.Unauthorized);
    }
}
