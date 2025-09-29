
using Host.Extensions;
using Host.Middlewares;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Host;


public static class HostExtensions
{
    private static readonly string SpecificOrigins = "_specificOrigins";

    public static IServiceCollection ConfigurationService(IServiceCollection services, IConfiguration _configuration)
    {
        return services
            .AddExceptionHandler<GlobalExceptionHandler>()
            .AddCustomMvc()
            .AddAutomapperConfig()
            .AddMediatRConfig()
            .AddInyectionDependency()
            .AddEntityFrameworkCore(_configuration)
            .AddCustomHttpContext()
            .AddCors(c =>
            {
                c.AddPolicy(name: SpecificOrigins, builder =>
                {
                    builder
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            })
            .AddOpenApiConfig();
    }

    public static IApplicationBuilder Configure(IApplicationBuilder app, Func<IApplicationBuilder, IApplicationBuilder> configurHost)
    {
        return configurHost(app)
            .UseCors(SpecificOrigins)
            .UseHttpsRedirection()
            .UseRouting()
            .UseAuthentication()    
            .UseAuthorization()
            .UseExceptionHandler("/error")
            .UseHeaderDiagnostics()            
            .UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
    }
}