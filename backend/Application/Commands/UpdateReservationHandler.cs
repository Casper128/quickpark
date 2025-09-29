using Application.DTO.Response;
using Application.Services;
using MediatR;

namespace Application.Commands;

public class UpdateReservationHandler(IReservationService reservationService) : IRequestHandler<UpdateReservationCommand, ApiResponse<ReservationResponse>>
{
    public async Task<ApiResponse<ReservationResponse>> Handle(UpdateReservationCommand request, CancellationToken cancellationToken) => await reservationService.UpdateReservaAsync(request.idReservation, request);
}
