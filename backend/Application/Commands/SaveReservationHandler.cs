using Application.DTO.Response;
using Application.Services;
using MediatR;

namespace Application.Commands;

public class SaveReservationHandler(IReservationService reservationService) : IRequestHandler<SaveReservationCommand, ApiResponse>
{
    public async Task<ApiResponse> Handle(SaveReservationCommand request, CancellationToken cancellationToken) => await reservationService.SaveReservaAsync(request);
}
