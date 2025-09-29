using Application.DTO.Response;
using MediatR;

namespace Application.Queries;

public class GetSampleQuery : IRequest<ApiResponse<IEnumerable<SampleResponse>>>
{

}
