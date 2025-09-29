using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Parqueadero
{
    public int Id { get; set; }

    public string Ubicacion { get; set; } = null!;

    public bool? Disponible { get; set; }

    public decimal Tarifa { get; set; }

    public virtual ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();
}
