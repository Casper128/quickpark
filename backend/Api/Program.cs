using Host;
using Host.Extensions;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, services, configuration) => configuration
.WriteTo.Console()
.WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
.Enrich.WithEnvironmentName());

builder.Services.AddControllers();

HostExtensions.ConfigurationService(builder.Services, builder.Configuration);

var app = builder.Build();

app.UseOpenApi();

HostExtensions.Configure(app, host =>
{
    return host
    .UseDefaultFiles()
    .UseStaticFiles();
});

app.MapControllers();

await app.RunAsync();
