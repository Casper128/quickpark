namespace Application.DTO.Request
{
    public class ReservationRequest
    {
        public DateTime FechaHoraInicio { get; set; }
        public DateTime FechaHoraFin { get; set; }
        public string Estado { get; set; } = null!;
        public int UsuarioId { get; set; }
        public int ParqueaderoId { get; set; }
    }
}
