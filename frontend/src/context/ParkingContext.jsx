"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { createReservationService, deleteReservationService, getReservationsService, updateReservationService } from "../services/reservations.services"

const ParkingContext = createContext()

export const useParking = () => {
  const context = useContext(ParkingContext)
  if (!context) {
    throw new Error("useParking must be used within a ParkingProvider")
  }
  return context
}

export const ParkingProvider = ({ children }) => {
  const [parkingLots, setParkingLots] = useState([])
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const mockParkingLots = [
      {
        id: "4",
        name: "Campus Principal - Bloque A",
        address: "Calle 45 #12-34, Bogotá",
        totalSpaces: 50,
        availableSpaces: 23,
        pricePerHour: 3000,
        features: ["Cubierto", "Seguridad 24/7", "CCTV"],
        coordinates: { lat: 4.6097, lng: -74.0817 },
        image: "/api/placeholder/400/200",
      },
      {
        id: "6",
        name: "Campus Principal - Bloque B",
        address: "Carrera 30 #45-67, Bogotá",
        totalSpaces: 75,
        availableSpaces: 12,
        pricePerHour: 2500,
        features: ["Descubierto", "Vigilancia", "Acceso 24h"],
        coordinates: { lat: 4.6087, lng: -74.0827 },
        image: "/api/placeholder/400/200",
      },
      {
        id: "10",
        name: "Biblioteca Central",
        address: "Avenida 68 #22-45, Bogotá",
        totalSpaces: 30,
        availableSpaces: 8,
        pricePerHour: 3500,
        features: ["Cubierto", "Carga eléctrica", "Seguridad"],
        coordinates: { lat: 4.6107, lng: -74.0837 },
        image: "/api/placeholder/400/200",
      },
    ]

    const fetchData = async () => {
      setLoading(true)
      try {
        const apiReservations = await getReservationsService()

        // 🔹 Transformar los datos de la API al formato que espera tu frontend
        const mappedReservations = apiReservations.map((r) => ({
          id: r.id,
          parkingLotId: r.parqueaderoid,
          parkingLotName: r.parqueaderoNombre ?? `Parqueadero ${r.parqueaderoid}`,
          spaceNumber: `#${r.parqueaderoid}`, // si no hay número de espacio real
          date: r.fechahorainicio.split("T")[0],
          startTime: r.fechahorainicio.split("T")[1].substring(0, 5),
          endTime: r.fechahorafin.split("T")[1].substring(0, 5),
          duration:
            (new Date(r.fechahorafin) - new Date(r.fechahorainicio)) / (1000 * 60 * 60),
          totalCost: 0, // la API no devuelve costo, lo dejas en 0 o calculas según tarifa
          status: r.estado.toLowerCase(), // "Pendiente", "Confirmada", "Cancelada"
          paymentStatus: "paid", // si la API no lo devuelve
        }))

        setReservations(mappedReservations)
      } catch (err) {
        console.error("Error cargando reservas:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // const mockReservations = [
    //   {
    //     id: "1",
    //     parkingLotId: "1",
    //     parkingLotName: "Campus Principal - Bloque A",
    //     spaceNumber: "A-15",
    //     date: "2024-01-25",
    //     startTime: "08:00",
    //     endTime: "12:00",
    //     duration: 4,
    //     totalCost: 12000,
    //     status: "active",
    //     paymentStatus: "paid",
    //   },
    //   {
    //     id: "2",
    //     parkingLotId: "2",
    //     parkingLotName: "Campus Principal - Bloque B",
    //     spaceNumber: "B-23",
    //     date: "2024-01-24",
    //     startTime: "14:00",
    //     endTime: "18:00",
    //     duration: 4,
    //     totalCost: 10000,
    //     status: "completed",
    //     paymentStatus: "paid",


    //   },
    // ]


    setParkingLots(mockParkingLots)
    // setReservations(mockReservations)
  }, [])

  const createReservation = async (reservationData) => {
    setLoading(true)

    const newReservation = {
      id: Date.now().toString(),
      ...reservationData,
      estado: "active",
      paymentStatus: "paid",
    }

    await createReservationService(newReservation)

    setReservations((prev) => [...prev, newReservation])
    // Actualizar espacios disponibles
    setParkingLots((prev) =>
      prev.map((lot) =>
        lot.id === reservationData.parkingLotId ? { ...lot, availableSpaces: lot.availableSpaces - 1 } : lot,
      ),
    )

    setLoading(false)
    return newReservation
  }

  const cancelReservation = async (reservationId) => {
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const reservation = reservations.find((r) => r.id === reservationId)
    if (reservation) {
      // Actualizar espacios disponibles
      setParkingLots((prev) =>
        prev.map((lot) =>
          lot.id === reservation.parkingLotId ? { ...lot, availableSpaces: lot.availableSpaces + 1 } : lot,
        ),
      )
    }

    setReservations((prev) => prev.map((r) => (r.id === reservationId ? { ...r, status: "cancelled" } : r)))

    setLoading(false)
  }


  const updateReservation = async (reservationId, updatedData) => {
    setLoading(true)
    try {
      const {result: updatedFromBackend, success } = await updateReservationService(reservationId, updatedData)
      debugger
      const mappedUpdate = {
        id: updatedFromBackend?.id ?? "",
        parkingLotId: updatedFromBackend?.parqueaderoid ?? "",
        parkingLotName:
          updatedFromBackend?.parqueaderoNombre?.trim() !== ""
            ? updatedFromBackend.parqueaderoNombre
            : `Parqueadero ${updatedFromBackend?.parqueaderoid ?? "N/A"}`,
        spaceNumber: updatedFromBackend?.parqueaderoid
          ? `#${updatedFromBackend.parqueaderoid}`
          : "N/A",
        date: updatedFromBackend?.fechahorainicio
          ? updatedFromBackend.fechahorainicio.split("T")[0]
          : "",
        startTime: updatedFromBackend?.fechahorainicio
          ? updatedFromBackend.fechahorainicio.split("T")[1]?.substring(0, 5) ?? ""
          : "",
        endTime: updatedFromBackend?.fechahorafin
          ? updatedFromBackend.fechahorafin.split("T")[1]?.substring(0, 5) ?? ""
          : "",
        duration:
          updatedFromBackend?.fechahorainicio && updatedFromBackend?.fechahorafin
            ? Math.max(
              (new Date(updatedFromBackend.fechahorafin) - new Date(updatedFromBackend.fechahorainicio)) / (1000 * 60 * 60),
              0
            )
            : 0,
        status: updatedFromBackend?.estado?.toLowerCase() ?? "unknown",
        totalCost: updatedFromBackend?.totalCost ?? 0,
        paymentStatus: "paid",
      };
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? mappedUpdate : r))
      )

      return mappedUpdate
    } catch (err) {
      console.error("Error updating reservation:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }


  // 🔹 Eliminar reserva
  const deleteReservation = async (reservationId) => {
    debugger
    setLoading(true)
    try {
      await deleteReservationService(reservationId)

      setReservations((prev) => prev.filter((r) => r.id !== reservationId))

      const reservation = reservations.find((r) => r.id === reservationId)
      if (reservation && reservation.status === "active") {
        setParkingLots((prev) =>
          prev.map((lot) =>
            lot.id === reservation.parkingLotId
              ? { ...lot, availableSpaces: lot.availableSpaces + 1 }
              : lot,
          ),
        )
      }
    } catch (error) {
      console.error("Error eliminando reserva:", error)
    } finally {
      setLoading(false)
    }
  }


  const value = {
    parkingLots,
    reservations,
    loading,
    createReservation,
    cancelReservation,
    updateReservation,
    deleteReservation,
  }

  return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>
}
