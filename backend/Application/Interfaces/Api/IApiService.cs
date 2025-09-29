using System.Net;

namespace Application.Interfaces.Api
{
    public class HttpRequest
    {
        public required string Url { get; set; }
        public object? Body { get; set; }
        public Dictionary<string, string>? Headers { get; set; }
    }

    public interface IApiService
    {
        Task<T> GetAsync<T>(HttpRequest request);
        Task<T> PostAsync<T>(HttpRequest request);
        Task<byte[]> DownloadSsrsReportAsync(HttpRequest request, NetworkCredential networkCredential);
    }
}
