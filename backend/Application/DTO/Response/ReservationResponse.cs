using System;

namespace Application.DTO.Response
{
    public class ReservationResponse
    {
        public int Id { get; set; }

        public DateTime Fechahorainicio { get; set; }

        public DateTime Fechahorafin { get; set; }

        public string Estado { get; set; } = null!;

        public int Usuarioid { get; set; }

        public int Parqueaderoid { get; set; }

        public string? UsuarioNombre { get; set; }

        public string? ParqueaderoNombre { get; set; }
    }
}
