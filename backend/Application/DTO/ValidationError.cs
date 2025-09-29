namespace Application.DTO;

public class ValidationError
{
    public required string Key { get; set; }
    public required string Error { get; set; }
}