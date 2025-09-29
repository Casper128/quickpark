"use client"

import { useState } from "react"
import { useParking } from "../context/ParkingContext"
import ReservationModal from "../components/ReservationModal"

const Reservations = () => {
  const { reservations, cancelReservation, deleteReservation, loading } = useParking()
  const [filter, setFilter] = useState("all")
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [reservationToCancel, setReservationToCancel] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [reservationToEdit, setReservationToEdit] = useState(null)


  const handleEditClick = (reservation) => {
    setReservationToEdit(reservation)
    setShowModal(true)
  }

  const filteredReservations = reservations.filter((reservation) => {
    if (filter === "all") return true
    return reservation.status === filter
  })

  const handleCancelClick = (reservation) => {
    setReservationToCancel(reservation)
    setShowCancelModal(true)
  }

  const handleConfirmCancel = async () => {
    if (reservationToCancel) {
      await cancelReservation(reservationToCancel.id)
      setShowCancelModal(false)
      setReservationToCancel(null)
    }
  }

  const handleDeleteClick = async (reservation) => {
    const { id }= reservation
    if (id) {
      await deleteReservation(id)
      setShowCancelModal(false)
      setReservationToCancel(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Activa"
      case "completed":
        return "Completada"
      case "cancelled":
        return "Cancelada"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
          <p className="text-gray-600 mt-1">Gestiona todas tus reservas de parqueadero</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-blue-600">
            {reservations.filter((r) => r.status === "active").length}
          </div>
          <div className="text-sm text-gray-600">Reservas Activas</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-green-600">
            {reservations.filter((r) => r.status === "completed").length}
          </div>
          <div className="text-sm text-gray-600">Completadas</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-red-600">
            {reservations.filter((r) => r.status === "cancelled").length}
          </div>
          <div className="text-sm text-gray-600">Canceladas</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-purple-600">
            $
            {reservations
              .filter((r) => r.paymentStatus === "paid")
              .reduce((sum, r) => sum + r.totalCost, 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Gastado</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Todas ({reservations.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "active" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Activas ({reservations.filter((r) => r.status === "active").length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "completed" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Completadas ({reservations.filter((r) => r.status === "completed").length})
          </button>
          <button
            onClick={() => setFilter("cancelled")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "cancelled" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Canceladas ({reservations.filter((r) => r.status === "cancelled").length})
          </button>
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "all" ? "No tienes reservas" : `No tienes reservas ${getStatusText(filter).toLowerCase()}`}
            </h3>
            <p className="text-gray-600">{filter === "all" && "Haz tu primera reserva para comenzar"}</p>
          </div>
        ) : (
          filteredReservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{reservation.parkingLotName}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}
                    >
                      {getStatusText(reservation.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Espacio:</span>
                      <div>{reservation.spaceNumber}</div>
                    </div>
                    <div>
                      <span className="font-medium">Fecha:</span>
                      <div>{reservation.date}</div>
                    </div>
                    <div>
                      <span className="font-medium">Horario:</span>
                      <div>
                        {reservation.startTime} - {reservation.endTime}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Duración:</span>
                      <div>
                        {reservation.duration} hora{reservation.duration !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col lg:items-end space-y-2">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">${Number(reservation.totalCost ?? 0).toLocaleString()}</div>
                    <div className="text-sm text-gray-600">ID: #{reservation.id}</div>
                  </div>

                  {/* {reservation.status === "active" && ( */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCancelClick(reservation)}
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleEditClick(reservation)}
                      className="px-4 py-2 text-sm font-medium text-yellow-600 border border-yellow-300 rounded-md hover:bg-yellow-50 transition-colors"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDeleteClick(reservation)}
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Eliminar
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors">
                      Ver Detalles
                    </button>
                  </div>
                  {/* )} */}

                  {reservation.status === "completed" && (
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors">
                      Descargar Recibo
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Cancelar Reserva?</h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas cancelar tu reserva en{" "}
                <strong>{reservationToCancel?.parkingLotName}</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  No, mantener reserva
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Cancelando...
                    </div>
                  ) : (
                    "Sí, cancelar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Reservation Modal */}
      {showModal && reservationToEdit && (
        <ReservationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          parkingLot={
            // buscar el parqueadero correspondiente a la reserva
            reservations.find(r => r.id === reservationToEdit.id)
              ? { id: reservationToEdit.parkingLotId, name: reservationToEdit.parkingLotName }
              : null
          }
          reservation={reservationToEdit}
          isEditing={true}
        />
      )}

    </div>
  )
}

export default Reservations
