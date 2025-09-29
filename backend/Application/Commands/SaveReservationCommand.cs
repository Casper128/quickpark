using Application.DTO.Request;
using Application.DTO.Response;
using MediatR;

namespace Application.Commands;

public class SaveReservationCommand : ReservationRequest, IRequest<ApiResponse>
{

}
