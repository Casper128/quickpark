namespace Application.DTO.Response
{
    public class ApiResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
    }

    public class ApiResponse<T> : ApiResponse where T : class
    {
        public required T Result { get; set; }
    }
}
