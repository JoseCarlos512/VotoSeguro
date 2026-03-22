namespace VotoSeguro.Api.Models.Internal;

public sealed class CandidateDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string PartyId { get; set; } = string.Empty;
    public string PartyName { get; set; } = string.Empty;
    public string RunningFor { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public List<string> Priorities { get; set; } = new();
    public List<string> Experience { get; set; } = new();
    public string RunningMate { get; set; } = string.Empty;
    public List<SenatorDto> Senators { get; set; } = new();
    public List<VicepresidentDto> Vicepresidentes { get; set; } = new();
    public string Initials { get; set; } = string.Empty;
}
