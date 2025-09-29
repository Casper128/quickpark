using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Empleado
{
    public int Usuarioid { get; set; }

    public string? Permisos { get; set; }

    public virtual Usuario Usuario { get; set; } = null!;
}
