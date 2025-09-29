using Application.DTO.Response;
using Application.Services;
using MediatR;

namespace Application.Queries;

public class GetReservationHandler(IReservationService reservationService) : IRequestHandler<GetReservationQuery, ApiResponse<IEnumerable<ReservationResponse>>>
{
    public async Task<ApiResponse<IEnumerable<ReservationResponse>>> Handle(GetReservationQuery request, CancellationToken cancellationToken)
    {
        return await reservationService.GetReservasAsync();
    }
}
