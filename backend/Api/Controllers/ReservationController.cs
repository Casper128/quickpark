using Application.Commands;
using Application.DTO;
using Application.DTO.Request;
using Application.DTO.Response;
using Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationController(IMediator mediator) : ControllerBase
    {

        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<ReservationResponse>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
        public async Task<ApiResponse<IEnumerable<ReservationResponse>>> GetReservationsAsync()
        {
            return await mediator.Send(new GetReservationQuery());
        }

        
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
        public async Task<ApiResponse> Post([FromBody] ReservationRequest reservationRequest)
        {
            var command = new SaveReservationCommand
            {
                FechaHoraInicio = DateTime.SpecifyKind(reservationRequest.FechaHoraInicio, DateTimeKind.Unspecified),
                FechaHoraFin = DateTime.SpecifyKind(reservationRequest.FechaHoraFin, DateTimeKind.Unspecified),
                Estado = reservationRequest.Estado,
                UsuarioId = reservationRequest.UsuarioId,
                ParqueaderoId = reservationRequest.ParqueaderoId
            };

            return await mediator.Send(command);
        }

        // PUT api/<ReservasController>/5
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
        public async Task<ApiResponse<ReservationResponse>> Put(int id, [FromBody] ReservationRequest reservationRequest)
        {
            var command = new UpdateReservationCommand
            {
                idReservation = id,
                FechaHoraInicio = DateTime.SpecifyKind(reservationRequest.FechaHoraInicio, DateTimeKind.Unspecified),
                FechaHoraFin = DateTime.SpecifyKind(reservationRequest.FechaHoraFin, DateTimeKind.Unspecified),
                Estado = reservationRequest.Estado,
                UsuarioId = reservationRequest.UsuarioId,
                ParqueaderoId = reservationRequest.ParqueaderoId
            };

            return await mediator.Send(command);
        }


        // DELETE api/<ReservasController>/5
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
        public async Task<ApiResponse> Delete(int id)
        {
            var command = new DeleteReservationCommand
            {
                Id = id,
            };

            return await mediator.Send(command);
        }
    }
}