using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Api.Models;

public partial class QuickParkDbContext : DbContext
{
    public QuickParkDbContext()
    {
    }

    public QuickParkDbContext(DbContextOptions<DbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Empleado> Empleados { get; set; }

    public virtual DbSet<Estudiante> Estudiantes { get; set; }

    public virtual DbSet<Pago> Pagos { get; set; }

    public virtual DbSet<Parqueadero> Parqueaderos { get; set; }

    public virtual DbSet<Reserva> Reservas { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Database=parqueadero_db;Username=admin;Password=admin123");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Empleado>(entity =>
        {
            entity.HasKey(e => e.Usuarioid).HasName("empleado_pkey");

            entity.ToTable("empleado");

            entity.Property(e => e.Usuarioid)
                .ValueGeneratedNever()
                .HasColumnName("usuarioid");
            entity.Property(e => e.Permisos)
                .HasMaxLength(255)
                .HasColumnName("permisos");

            entity.HasOne(d => d.Usuario).WithOne(p => p.Empleado)
                .HasForeignKey<Empleado>(d => d.Usuarioid)
                .HasConstraintName("fk_empleado_usuario");
        });

        modelBuilder.Entity<Estudiante>(entity =>
        {
            entity.HasKey(e => e.Usuarioid).HasName("estudiante_pkey");

            entity.ToTable("estudiante");

            entity.Property(e => e.Usuarioid)
                .ValueGeneratedNever()
                .HasColumnName("usuarioid");
            entity.Property(e => e.Carrera)
                .HasMaxLength(255)
                .HasColumnName("carrera");

            entity.HasOne(d => d.Usuario).WithOne(p => p.Estudiante)
                .HasForeignKey<Estudiante>(d => d.Usuarioid)
                .HasConstraintName("fk_estudiante_usuario");
        });

        modelBuilder.Entity<Pago>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pago_pkey");

            entity.ToTable("pago");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Fechapago)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("fechapago");
            entity.Property(e => e.Metodo)
                .HasMaxLength(50)
                .HasColumnName("metodo");
            entity.Property(e => e.Monto)
                .HasPrecision(10, 2)
                .HasColumnName("monto");
            entity.Property(e => e.Reservaid).HasColumnName("reservaid");

            entity.HasOne(d => d.Reserva).WithMany(p => p.Pagos)
                .HasForeignKey(d => d.Reservaid)
                .HasConstraintName("fk_pago_reserva");
        });

        modelBuilder.Entity<Parqueadero>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("parqueadero_pkey");

            entity.ToTable("parqueadero");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Disponible)
                .HasDefaultValue(true)
                .HasColumnName("disponible");
            entity.Property(e => e.Tarifa)
                .HasPrecision(10, 2)
                .HasColumnName("tarifa");
            entity.Property(e => e.Ubicacion)
                .HasMaxLength(255)
                .HasColumnName("ubicacion");
        });

        modelBuilder.Entity<Reserva>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("reserva_pkey");

            entity.ToTable("reserva");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Estado)
                .HasMaxLength(50)
                .HasColumnName("estado");
            entity.Property(e => e.Fechahorafin)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("fechahorafin");
            entity.Property(e => e.Fechahorainicio)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("fechahorainicio");
            entity.Property(e => e.Parqueaderoid).HasColumnName("parqueaderoid");
            entity.Property(e => e.Usuarioid).HasColumnName("usuarioid");

            entity.HasOne(d => d.Parqueadero).WithMany(p => p.Reservas)
                .HasForeignKey(d => d.Parqueaderoid)
                .HasConstraintName("fk_reserva_parqueadero");

            entity.HasOne(d => d.Usuario).WithMany(p => p.Reservas)
                .HasForeignKey(d => d.Usuarioid)
                .HasConstraintName("fk_reserva_usuario");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("usuario_pkey");

            entity.ToTable("usuario");

            entity.HasIndex(e => e.Email, "usuario_email_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.Nombre)
                .HasMaxLength(255)
                .HasColumnName("nombre");
            entity.Property(e => e.Rol)
                .HasMaxLength(50)
                .HasColumnName("rol");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
