using System.Text.Json.Serialization;

namespace VotoSeguro.Api.Models.External;

public sealed class JneCandidateRecord
{
    [JsonPropertyName("idProcesoElectoral")]
    public int? IdProcesoElectoral { get; set; }

    [JsonPropertyName("strProcesoElectoral")]
    public string? StrProcesoElectoral { get; set; }

    [JsonPropertyName("idTipoEleccion")]
    public int? IdTipoEleccion { get; set; }

    [JsonPropertyName("strTipoEleccion")]
    public string? StrTipoEleccion { get; set; }

    [JsonPropertyName("strDepartamento")]
    public string? StrDepartamento { get; set; }

    [JsonPropertyName("idOrganizacionPolitica")]
    public int? IdOrganizacionPolitica { get; set; }

    [JsonPropertyName("strOrganizacionPolitica")]
    public string? StrOrganizacionPolitica { get; set; }

    [JsonPropertyName("idCargo")]
    public int? IdCargo { get; set; }

    [JsonPropertyName("strCargo")]
    public string? StrCargo { get; set; }

    [JsonPropertyName("strNombres")]
    public string? StrNombres { get; set; }

    [JsonPropertyName("strApellidoPaterno")]
    public string? StrApellidoPaterno { get; set; }

    [JsonPropertyName("strApellidoMaterno")]
    public string? StrApellidoMaterno { get; set; }

    [JsonPropertyName("strAnio_Eleccion")]
    public string? StrAnioEleccion { get; set; }
}
