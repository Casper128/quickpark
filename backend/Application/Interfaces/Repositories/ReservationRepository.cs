using Domain.Entities;

namespace Application.Interfaces.Repositories
{
    public interface IReservationRepository : IRepository<Reserva>
    {
        Task<IEnumerable<Reserva>> GetReservasByUsuarioIdAsync(int usuarioId);
        Task<IEnumerable<Reserva>> GetReservasByParqueaderoIdAsync(int parqueaderoId);
    }
}
