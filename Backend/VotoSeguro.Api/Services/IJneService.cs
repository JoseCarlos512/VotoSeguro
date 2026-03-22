using VotoSeguro.Api.Models.External;
using VotoSeguro.Api.Models.Internal;

namespace VotoSeguro.Api.Services;

public interface IJneService
{
    Task<IReadOnlyList<CandidateDto>> GetCandidatosAsync(JneRequest request, CancellationToken cancellationToken);
}
