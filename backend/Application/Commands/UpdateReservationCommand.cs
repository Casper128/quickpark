using Application.DTO.Request;
using Application.DTO.Response;
using MediatR;

namespace Application.Commands;

public class UpdateReservationCommand : ReservationRequest, IRequest<ApiResponse<ReservationResponse>>
{
   public int idReservation { get; set; }
}
