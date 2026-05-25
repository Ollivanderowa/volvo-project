using Volvo.Shared;
using Microsoft.Extensions.Configuration;

namespace Volvo.TestAppHost;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = DistributedApplication.CreateBuilder(args);

        var connectionString = builder.Configuration.GetConnectionString(Services.Database)
            ?? throw new InvalidOperationException(
                $"Connection string '{Services.Database}' not found. Set the ConnectionStrings__VolvoDb environment variable.");

        builder.AddConnectionString(Services.Database, connectionString);

        builder.Build().Run();
    }
}
