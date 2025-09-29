using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Pago
{
    public int Id { get; set; }

    public decimal Monto { get; set; }

    public DateTime Fechapago { get; set; }

    public string Metodo { get; set; } = null!;

    public int Reservaid { get; set; }

    public virtual Reserva Reserva { get; set; } = null!;
}
