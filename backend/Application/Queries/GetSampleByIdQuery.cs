using System;
using Application.DTO.Response;
using MediatR;

namespace Application.Queries;

public class GetSampleByIdQuery : IRequest<ApiResponse<SampleResponse>>
{
    public int Id { get; set; }
}
