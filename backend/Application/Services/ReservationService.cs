using Application.DTO.Request;
using Application.DTO.Response;
using Application.Exceptions.Sample;
using Application.Interfaces.UnitOfWork;
using AutoMapper;
using Domain.Entities;

namespace Application.Services
{
    public interface IReservationService
    {
        Task<ApiResponse<IEnumerable<ReservationResponse>>> GetReservasAsync();
        //Task<ApiResponse<IEnumerable<ReservationResponse>>> GetReservasByUsuarioIdAsync(int usuarioId);
        Task<ApiResponse> SaveReservaAsync(ReservationRequest request);
        Task<ApiResponse<ReservationResponse>> UpdateReservaAsync(int id, ReservationRequest request);
        Task<ApiResponse> DeleteReservaAsync(int id);
    }

    public class ReservationService : IReservationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ReservationService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ApiResponse<IEnumerable<ReservationResponse>>> GetReservasAsync()
        {
            var reservas = await _unitOfWork.ReservationRepository.GetAllAsync();
            return new ApiResponse<IEnumerable<ReservationResponse>>
            {
                Success = true,
                Message = "Reservas retrieved successfully",
                Result = _mapper.Map<IEnumerable<ReservationResponse>>(reservas)
            };
        }

        public async Task<ApiResponse> SaveReservaAsync(ReservationRequest request)
        {
            var reserva = _mapper.Map<Reserva>(request);
            await _unitOfWork.ReservationRepository.AddAsync(reserva);
            await _unitOfWork.SaveChangesAsync();

            return new ApiResponse
            {
                Success = true,
                Message = "Reserva saved successfully"
            };
        }

        public async Task<ApiResponse<ReservationResponse>> UpdateReservaAsync(int id, ReservationRequest request)
        {
            var reserva = await _unitOfWork.ReservationRepository.GetByIdAsync(id);
            if (reserva == null)
                throw new ReservaNotFoundException(id);

            _mapper.Map(request, reserva); // Actualiza las propiedades
            _unitOfWork.ReservationRepository.Update(reserva);
            await _unitOfWork.SaveChangesAsync();

            return new ApiResponse<ReservationResponse>
            {
                Success = true,
                Message = "Reserva updated successfully",
                Result = _mapper.Map<ReservationResponse>(reserva)
            };
        }

        public async Task<ApiResponse> DeleteReservaAsync(int id)
        {
            var reserva = await _unitOfWork.ReservationRepository.GetByIdAsync(id);
            if (reserva == null)
                throw new ReservaNotFoundException(id);

            _unitOfWork.ReservationRepository.Delete(reserva);
            await _unitOfWork.SaveChangesAsync();

            return new ApiResponse
            {
                Success = true,
                Message = "Reserva deleted successfully"
            };
        }

        //// Métodos adicionales específicos
        //public async Task<ApiResponse<IEnumerable<ReservationResponse>>> GetReservasByUsuarioIdAsync(int usuarioId)
        //{
        //    var reservas = await _unitOfWork.ReservaRepository.GetReservasByUsuarioIdAsync(usuarioId);
        //    return new ApiResponse<IEnumerable<ReservationResponse>>
        //    {
        //        Success = true,
        //        Message = "Reservas retrieved successfully",
        //        Result = _mapper.Map<IEnumerable<ReservationResponse>>(reservas)
        //    };
        //}
    }
}
