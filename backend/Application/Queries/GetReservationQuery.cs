using Application.DTO.Response;
using MediatR;

namespace Application.Queries;

public class GetReservationQuery : IRequest<ApiResponse<IEnumerable<ReservationResponse>>>
{

}
