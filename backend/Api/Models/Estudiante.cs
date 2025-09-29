using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Estudiante
{
    public int Usuarioid { get; set; }

    public string Carrera { get; set; } = null!;

    public virtual Usuario Usuario { get; set; } = null!;
}
