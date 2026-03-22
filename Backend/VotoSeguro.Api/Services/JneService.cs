using System.Globalization;
using System.Net.Http.Json;
using System.Text;
using VotoSeguro.Api.Models.External;
using VotoSeguro.Api.Models.Internal;

namespace VotoSeguro.Api.Services;

public sealed class JneService : IJneService
{
    private readonly HttpClient _httpClient;

    public JneService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IReadOnlyList<CandidateDto>> GetCandidatosAsync(
        JneRequest request,
        CancellationToken cancellationToken)
    {
        var baseRequest = new JneRequest
        {
            IdProcesoElectoral = request.IdProcesoElectoral == 0 ? 124 : request.IdProcesoElectoral,
            StrUbiDepartamento = request.StrUbiDepartamento ?? string.Empty,
        };

        var presidentialRequest = new JneRequest
        {
            IdProcesoElectoral = baseRequest.IdProcesoElectoral,
            IdTipoEleccion = 1,
            StrUbiDepartamento = baseRequest.StrUbiDepartamento,
        };

        var senatorRequest = new JneRequest
        {
            IdProcesoElectoral = baseRequest.IdProcesoElectoral,
            IdTipoEleccion = 20,
            StrUbiDepartamento = baseRequest.StrUbiDepartamento,
        };

        var presidentsTask = FetchCandidatesAsync(presidentialRequest, cancellationToken);
        var senatorsTask = FetchCandidatesAsync(senatorRequest, cancellationToken);

        await Task.WhenAll(presidentsTask, senatorsTask);

        var presidents = presidentsTask.Result;
        var senators = senatorsTask.Result;

        var grouped = presidents
            .GroupBy(record => record.IdOrganizacionPolitica?.ToString() ?? record.StrOrganizacionPolitica ?? string.Empty)
            .Where(group => !string.IsNullOrWhiteSpace(group.Key));

        var candidates = new List<CandidateDto>();

        foreach (var group in grouped)
        {
            var partyName = group.FirstOrDefault()?.StrOrganizacionPolitica ?? "SIN ORGANIZACION";
            var partyId = ToPartyId(partyName, group.Key);
            var president = group.FirstOrDefault(IsPresident) ?? group.FirstOrDefault();
            if (president is null)
            {
                continue;
            }

            var viceList = group.Where(IsVicepresident).ToList();
            var runningMate = BuildFullName(viceList.FirstOrDefault());

            var senatorList = senators
                .Where(senator => BelongsToParty(senator, group))
                .Select(MapSenator)
                .ToList();

            candidates.Add(new CandidateDto
            {
                Id = $"cand-{partyId}",
                Name = BuildFullName(president),
                PartyId = partyId,
                PartyName = partyName,
                RunningFor = president.StrCargo ?? "PRESIDENCIA",
                Bio = $"Candidatura por {partyName} para el proceso electoral {baseRequest.IdProcesoElectoral}.",
                Priorities = new List<string>(),
                Experience = new List<string>(),
                RunningMate = runningMate,
                Senators = senatorList,
                Vicepresidentes = viceList.Select(MapVicepresident).ToList(),
                Initials = BuildInitials(president),
            });
        }

        return candidates;
    }

    private async Task<List<JneCandidateRecord>> FetchCandidatesAsync(
        JneRequest request,
        CancellationToken cancellationToken)
    {
        using var response = await _httpClient.PostAsJsonAsync(
            "votoinf/listarCanditatos",
            request,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<JneApiResponse>(cancellationToken);
        return payload?.Data ?? new List<JneCandidateRecord>();
    }

    private static bool IsPresident(JneCandidateRecord record)
    {
        return record.StrCargo is not null
            && record.StrCargo.Contains("PRESIDENTE", StringComparison.OrdinalIgnoreCase)
            && !record.StrCargo.Contains("VICE", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsVicepresident(JneCandidateRecord record)
    {
        return record.StrCargo is not null
            && record.StrCargo.Contains("VICEPRESIDENTE", StringComparison.OrdinalIgnoreCase);
    }

    private static bool BelongsToParty(JneCandidateRecord record, IGrouping<string, JneCandidateRecord> group)
    {
        if (record.IdOrganizacionPolitica.HasValue && group.FirstOrDefault()?.IdOrganizacionPolitica.HasValue == true)
        {
            return record.IdOrganizacionPolitica == group.First().IdOrganizacionPolitica;
        }

        if (!string.IsNullOrWhiteSpace(record.StrOrganizacionPolitica)
            && !string.IsNullOrWhiteSpace(group.FirstOrDefault()?.StrOrganizacionPolitica))
        {
            return string.Equals(
                record.StrOrganizacionPolitica,
                group.First().StrOrganizacionPolitica,
                StringComparison.OrdinalIgnoreCase);
        }

        return false;
    }

    private static SenatorDto MapSenator(JneCandidateRecord record)
    {
        return new SenatorDto
        {
            Name = BuildFullName(record),
            Region = string.IsNullOrWhiteSpace(record.StrDepartamento) ? "NACIONAL" : record.StrDepartamento!,
            Term = record.StrAnioEleccion ?? string.Empty,
            Focus = new List<string>(),
        };
    }

    private static VicepresidentDto MapVicepresident(JneCandidateRecord record)
    {
        return new VicepresidentDto
        {
            Name = BuildFullName(record),
            Region = string.IsNullOrWhiteSpace(record.StrDepartamento) ? "NACIONAL" : record.StrDepartamento!,
            Term = record.StrAnioEleccion ?? string.Empty,
            Focus = new List<string>(),
        };
    }

    private static string BuildFullName(JneCandidateRecord? record)
    {
        if (record is null)
        {
            return string.Empty;
        }

        var parts = new[]
        {
            record.StrNombres,
            record.StrApellidoPaterno,
            record.StrApellidoMaterno,
        };

        return string.Join(" ", parts.Where(part => !string.IsNullOrWhiteSpace(part))).Trim();
    }

    private static string BuildInitials(JneCandidateRecord record)
    {
        var fullName = BuildFullName(record);
        if (string.IsNullOrWhiteSpace(fullName))
        {
            return "NA";
        }

        var segments = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length == 1)
        {
            return segments[0].Substring(0, Math.Min(2, segments[0].Length)).ToUpperInvariant();
        }

        var first = segments[0][0];
        var last = segments[^1][0];
        return string.Concat(char.ToUpperInvariant(first), char.ToUpperInvariant(last));
    }

    private static string ToPartyId(string partyName, string fallback)
    {
        var source = string.IsNullOrWhiteSpace(partyName) ? fallback : partyName;
        if (string.IsNullOrWhiteSpace(source))
        {
            return "sin-partido";
        }

        var normalized = source.Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder();

        foreach (var ch in normalized)
        {
            var category = CharUnicodeInfo.GetUnicodeCategory(ch);
            if (category == UnicodeCategory.NonSpacingMark)
            {
                continue;
            }

            builder.Append(ch);
        }

        var cleaned = builder.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();
        var slug = new StringBuilder();
        var lastWasDash = false;

        foreach (var ch in cleaned)
        {
            if (char.IsLetterOrDigit(ch))
            {
                slug.Append(ch);
                lastWasDash = false;
            }
            else if (!lastWasDash)
            {
                slug.Append('-');
                lastWasDash = true;
            }
        }

        return slug.ToString().Trim('-');
    }
}
