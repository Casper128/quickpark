using Application.DTO.Request;
using Application.DTO.Response;
using AutoMapper;
using Domain.Entities;

namespace Application.Profiles;

public class ReservationProfile : Profile
{
    public ReservationProfile()
    {
        CreateMap<Reserva, ReservationResponse>();
        CreateMap<ReservationRequest, Reserva>()
                   .ForMember(dest => dest.Fechahorainicio, opt => opt.MapFrom(src => src.FechaHoraInicio))
                   .ForMember(dest => dest.Fechahorafin, opt => opt.MapFrom(src => src.FechaHoraFin))
                   .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => src.Estado))
                   .ForMember(dest => dest.Usuarioid, opt => opt.MapFrom(src => src.UsuarioId))
                   .ForMember(dest => dest.Parqueaderoid, opt => opt.MapFrom(src => src.ParqueaderoId));
    }
}
