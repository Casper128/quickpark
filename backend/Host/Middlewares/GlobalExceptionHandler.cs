using Application.DTO.Response;
using Application.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Serilog;
using System.Net;
using System.Text.Json;

namespace Host.Middlewares
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly JsonSerializerOptions jsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            Log.Error(exception, "An error occurred while processing the request");

            httpContext.Response.ContentType = "application/json";
            var response = CreateErrorResponse(exception);
            httpContext.Response.StatusCode = GetStatusCode(exception);

            await httpContext.Response.WriteAsync(
                JsonSerializer.Serialize(response, jsonOptions),
                cancellationToken);

            return true;
        }

        private static ApiResponse CreateErrorResponse(Exception exception)
        {
            return new ApiResponse
            {
                Success = false,
                Message = exception.Message
            };
        }

        private static int GetStatusCode(Exception exception)
        {
            return exception switch
            {
                BaseException baseException => (int)baseException.StatusCode,
                _ => (int)HttpStatusCode.InternalServerError
            };
        }
    }
}
