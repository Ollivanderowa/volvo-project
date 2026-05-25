using Volvo.Shared;
using Microsoft.Extensions.Configuration;

var builder = DistributedApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString(Services.Database)
    ?? throw new InvalidOperationException(
        $"Connection string '{Services.Database}' not found. Set the ConnectionStrings__VolvoDb environment variable.");

var database = builder.AddConnectionString(Services.Database, connectionString);

var web = builder.AddProject<Projects.Web>(Services.WebApi)
    .WithReference(database)
    .WithExternalHttpEndpoints()
    .WithAspNetCoreEnvironment()
    .WithUrlForEndpoint("http", url =>
    {
        url.DisplayText = "Scalar API Reference";
        url.Url = "/scalar";
    });

if (builder.ExecutionContext.IsRunMode)
{
    builder.AddJavaScriptApp(Services.WebFrontend, "./../Web/ClientApp")
        .WithRunScript("start")
        .WithReference(web)
        .WaitFor(web)
        .WithHttpEndpoint(env: "PORT")
        .WithExternalHttpEndpoints();
}

builder.Build().Run();
