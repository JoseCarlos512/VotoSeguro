namespace VotoSeguro.Api.Models.Internal;

public sealed class SenatorDto
{
    public string Name { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public List<string> Focus { get; set; } = new();
    public string Term { get; set; } = string.Empty;
}
