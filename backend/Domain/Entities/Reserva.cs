using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Reserva
{
    public int Id { get; set; }

    public DateTime Fechahorainicio { get; set; }

    public DateTime Fechahorafin { get; set; }

    public string Estado { get; set; } = null!;

    public int Usuarioid { get; set; }

    public int Parqueaderoid { get; set; }

    public virtual ICollection<Pago> Pagos { get; set; } = new List<Pago>();

    public virtual Parqueadero Parqueadero { get; set; } = null!;

    public virtual Usuario Usuario { get; set; } = null!;
}
