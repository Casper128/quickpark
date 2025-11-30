using System.Diagnostics;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Scalar.AspNetCore;

namespace Host.Extensions;


public static class ApplicationBuilderExtensions
{
    public static WebApplication UseOpenApi(this WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI();
        app.MapScalarApiReference(options =>
        {
            options
            .WithTitle("Your Custom Title")
            .WithTheme(ScalarTheme.Saturn)
            .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
        });

        return app;
    }

    public static IApplicationBuilder UseHeaderDiagnostics(this IApplicationBuilder app)
    {
        var listener = app.ApplicationServices.GetService<DiagnosticListener>();

        return listener?.IsEnabled() ?? false
            ? app.Use((context, next) =>
            {
                var headers = string.Join("|", context.Request.Headers.Values.Select(h => h.ToString()));
                listener.Write("API.Diagnostics.Headers", new { Headers = headers, HttpContext = context });
                return next();
            })
            : app;
    }

}