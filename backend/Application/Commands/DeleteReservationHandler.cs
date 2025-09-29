using Application.DTO.Response;
using Application.Services;
using MediatR;

namespace Application.Commands;

public class DeleteReservationHandler(IReservationService reservationService) : IRequestHandler<DeleteReservationCommand, ApiResponse>
{
    public async Task<ApiResponse> Handle(DeleteReservationCommand request, CancellationToken cancellationToken) => await reservationService.DeleteReservaAsync(request.Id);
}
