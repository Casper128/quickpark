//using System;
//using Application.DTO.Response;
//using Application.Interfaces.Services;
//using MediatR;

//namespace Application.Queries;

//public class
//ByIdHandler(ISampleService sampleService) : IRequestHandler<GetSampleByIdQuery, ApiResponse<SampleResponse>>
//{
//    public async Task<ApiResponse<SampleResponse>> Handle(GetSampleByIdQuery request, CancellationToken cancellationToken)
//    {
//        return await sampleService.GetSampleByIdAsync(request.Id);
//    }
//}
