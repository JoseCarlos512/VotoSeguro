using System.Text.Json.Serialization;

namespace VotoSeguro.Api.Models.External;

public sealed class JneApiResponse
{
    [JsonPropertyName("data")]
    public List<JneCandidateRecord> Data { get; set; } = new();
}
