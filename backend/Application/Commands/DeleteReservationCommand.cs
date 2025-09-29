using Application.DTO.Response;
using MediatR;

namespace Application.Commands;

public class DeleteReservationCommand : IRequest<ApiResponse>
{
    public int Id { get; set; }
}