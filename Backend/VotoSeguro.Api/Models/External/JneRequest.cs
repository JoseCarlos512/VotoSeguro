using System.Text.Json.Serialization;

namespace VotoSeguro.Api.Models.External;

public sealed class JneRequest
{
    [JsonPropertyName("idProcesoElectoral")]
    public int IdProcesoElectoral { get; set; } = 124;

    [JsonPropertyName("idTipoEleccion")]
    public int IdTipoEleccion { get; set; } = 1;

    [JsonPropertyName("strUbiDepartamento")]
    public string? StrUbiDepartamento { get; set; }
}
