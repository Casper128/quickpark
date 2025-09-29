using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Empleado
{
    public int Usuarioid { get; set; }

    public string? Permisos { get; set; }

    public virtual Usuario Usuario { get; set; } = null!;
}
