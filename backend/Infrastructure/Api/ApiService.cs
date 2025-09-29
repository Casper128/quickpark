using Application.Interfaces.Api;
using Newtonsoft.Json;
using Polly;
using Polly.Retry;
using Serilog;
using System.Net;
using System.Text;

namespace Infrastructure.Api
{
    public class ApiService : IApiService
    {
        private readonly AsyncRetryPolicy<HttpResponseMessage> retryPolicy;

        public ApiService()
        {
            retryPolicy = Policy
                .HandleResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)
                .Or<HttpRequestException>()
                .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)), (response, retryCount) =>
                {
                    string logMessage = $"Intento de solicitud HTTP fallido en el intento {retryCount}:\n";
                    logMessage += $"Status Code: {(int)response.Result.StatusCode} {response.Result.StatusCode}\n";
                    logMessage += $"Headers:\n{string.Join("\n", response.Result.Headers)}\n";
                    logMessage += $"Content:\n{response.Result.Content}";

                    Log.Error(logMessage);
                });
        }

        public async Task<T> GetAsync<T>(HttpRequest request)
        {
            using (var client = new HttpClient())
            {
                if (request.Headers != null)
                {
                    foreach (KeyValuePair<string, string> entry in request.Headers)
                    {
                        client.DefaultRequestHeaders.Add(entry.Key, entry.Value);
                    }
                }

                Log.Information("[HTTP GET] {@Request}", request.Url, request);

                var response = await retryPolicy.ExecuteAsync(() => client.GetAsync(request.Url));
                Log.Information($"[RESPONSE] {response.StatusCode} {await response.Content.ReadAsStringAsync()}");

                response.EnsureSuccessStatusCode();
                string json = await response.Content.ReadAsStringAsync();

                return JsonConvert.DeserializeObject<T>(json);
            }
        }

        public async Task<T> PostAsync<T>(HttpRequest request)
        {
            using (var client = new HttpClient())
            {

                if (request.Headers != null)
                {
                    foreach (KeyValuePair<string, string> entry in request.Headers)
                    {
                        client.DefaultRequestHeaders.Add(entry.Key, entry.Value);
                    }
                }

                var content = new StringContent(JsonConvert.SerializeObject(request.Body), Encoding.UTF8, "application/json");

                Log.Information("[HTTP POST] {@Request} {@Body}", request.Url, request, content);

                var response = await retryPolicy.ExecuteAsync(() => client.PostAsync(request.Url, content));
                Log.Information($"[RESPONSE] {response.StatusCode} {await response.Content.ReadAsStringAsync()}");

                response.EnsureSuccessStatusCode();
                string json = await response.Content.ReadAsStringAsync();

                return JsonConvert.DeserializeObject<T>(json);
            }
        }

        public async Task<byte[]> DownloadSsrsReportAsync(HttpRequest request, NetworkCredential networkCredential)
        {

            var handler = new SocketsHttpHandler
            {
                Credentials = networkCredential,
                PreAuthenticate = false,
                AllowAutoRedirect = true
            };

            using (var client = new HttpClient(handler))
            {
                if (request.Headers != null)
                {
                    foreach (KeyValuePair<string, string> entry in request.Headers)
                    {
                        client.DefaultRequestHeaders.Add(entry.Key, entry.Value);
                    }
                }

                Log.Information("[HTTP GET] {RequestUrl}", request.Url);

                var response = await retryPolicy.ExecuteAsync(() => client.GetAsync(request.Url));
                Log.Information($"[RESPONSE] {response.StatusCode}");

                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsByteArrayAsync();
            }
        }
    }
}
