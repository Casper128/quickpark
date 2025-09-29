using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ReservationRepository : Repository<Reserva>, IReservationRepository
    {
        private readonly QuickParkDbContext _context;

        public ReservationRepository(QuickParkDbContext context) : base(context)
        {
            _context = context;
        }

        // Create
        public async Task<Reserva> AddReservaAsync(Reserva reserva)
        {
            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync();
            return reserva;
        }

        // Read all
        public async Task<IEnumerable<Reserva>> GetAllReservasAsync()
        {
            return await _context.Reservas
                .Include(r => r.Usuario)
                .Include(r => r.Parqueadero)
                .Include(r => r.Pagos)
                .ToListAsync();
        }

        // Read by ID
        public async Task<Reserva> GetReservaByIdAsync(int id)
        {
            return await _context.Reservas
                .Include(r => r.Usuario)
                .Include(r => r.Parqueadero)
                .Include(r => r.Pagos)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        // Update
        public async Task<Reserva> UpdateReservaAsync(Reserva reserva)
        {
            _context.Reservas.Update(reserva);
            await _context.SaveChangesAsync();
            return reserva;
        }

        // Delete
        public async Task<bool> DeleteReservaAsync(int id)
        {
            var reserva = await _context.Reservas.FindAsync(id);
            if (reserva == null) return false;

            _context.Reservas.Remove(reserva);
            await _context.SaveChangesAsync();
            return true;
        }

        // Métodos existentes
        public async Task<IEnumerable<Reserva>> GetReservasByUsuarioIdAsync(int usuarioId)
        {
            return await _context.Reservas
                .Include(r => r.Parqueadero)
                .Include(r => r.Pagos)
                .Where(r => r.Usuarioid == usuarioId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reserva>> GetReservasByParqueaderoIdAsync(int parqueaderoId)
        {
            return await _context.Reservas
                .Include(r => r.Usuario)
                .Include(r => r.Pagos)
                .Where(r => r.Parqueaderoid == parqueaderoId)
                .ToListAsync();
        }
    }
}
