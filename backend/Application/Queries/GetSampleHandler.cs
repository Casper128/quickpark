//using Application.DTO.Response;
//using Application.Interfaces.Services;
//using MediatR;

//namespace Application.Queries;

//public class GetSampleHandler(ISampleService sampleService) : IRequestHandler<GetSampleQuery, ApiResponse<IEnumerable<SampleResponse>>>
//{
//    public async Task<ApiResponse<IEnumerable<SampleResponse>>> Handle(GetSampleQuery request, CancellationToken cancellationToken)
//    {
//        return await sampleService.GetSampleAsync();
//    }
//}
