using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Estudiante
{
    public int Usuarioid { get; set; }

    public string Carrera { get; set; } = null!;

    public virtual Usuario Usuario { get; set; } = null!;
}
