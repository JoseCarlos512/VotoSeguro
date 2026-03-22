using Microsoft.AspNetCore.Mvc;
using VotoSeguro.Api.Models.External;
using VotoSeguro.Api.Models.Internal;
using VotoSeguro.Api.Services;

namespace VotoSeguro.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class JneController : ControllerBase
{
    private readonly IJneService _jneService;

    public JneController(IJneService jneService)
    {
        _jneService = jneService;
    }

    [HttpGet("candidatos")]
    public async Task<ActionResult<IReadOnlyList<CandidateDto>>> GetCandidatos(
        [FromQuery] JneRequest request,
        CancellationToken cancellationToken)
    {
        request.StrUbiDepartamento ??= string.Empty;
        var candidates = await _jneService.GetCandidatosAsync(request, cancellationToken);
        return Ok(candidates);
    }
}
