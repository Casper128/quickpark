"use client"

import { useState } from "react"
import { useParking } from "../context/ParkingContext"

const ReservationModal = ({
  isOpen,
  onClose,
  parkingLot,
  reservation = null,
  isEditing = false
}) => {
  const { createReservation, updateReservation, loading } = useParking()

  const [formData, setFormData] = useState({
    date: reservation?.date || "",
    startTime: reservation?.startTime || "",
    endTime: reservation?.endTime || "",
    paymentMethod: reservation?.paymentMethod || "credit-card",
  })
  
  const [step, setStep] = useState(1)
  const [reservationResult, setReservationResult] = useState(null)

  if (!isOpen || !parkingLot) return null

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0

    const start = new Date(`2000-01-01T${formData.startTime}`)
    const end = new Date(`2000-01-01T${formData.endTime}`)

    if (end <= start) return 0

    return Math.ceil((end - start) / (1000 * 60 * 60))
  }

  const duration = calculateDuration()
  const totalCost = duration * parkingLot.pricePerHour

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

      const payload = {
        fechaHoraInicio: `${formData.date}T${formData.startTime}:00`,
        fechaHoraFin: `${formData.date}T${formData.endTime}:00`,
        estado: formData?.status || reservation?.status,
        usuarioId: reservation?.usuarioId ?? 2,
        parqueaderoId: reservation?.parkingLotId ?? 6,
      };

    if (isEditing) {

      await updateReservation(reservation.id, payload);
      onClose();
      return;

    } else {
      if (step === 1) {
        setStep(2)
        return
      }

      try {
        // const reservationData = {
          // parkingLotId: parkingLot.id,
          // parkingLotName: parkingLot.name,
          // spaceNumber: `${parkingLot.name.charAt(0)}-${Math.floor(Math.random() * 99) + 1}`,
          // date: formData.date,
          // startTime: formData.startTime,
          // endTime: formData.endTime,
          // duration,
          // totalCost,
          // paymentMethod: formData.paymentMethod,
        // }

        const result = await createReservation(payload)
        setReservationResult(result)
        setStep(3)
      } catch (error) {
        console.error("Error creating reservation:", error)
      }
    }
  }

  const handleClose = () => {
    setStep(1)
    setFormData({
      date: "",
      startTime: "",
      endTime: "",
      paymentMethod: "credit-card",
    })
    setReservationResult(null)
    onClose()
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? "Editar Reserva" : step === 1 ? "Detalles de Reserva" : step === 2 ? "Confirmar y Pagar" : "Reserva Confirmada"}
          </h2>

          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              {/* Parking Lot Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">{parkingLot.name}</h3>
                <p className="text-sm text-gray-600">{parkingLot.address}</p>
                {/* <p className="text-sm text-blue-600 font-medium mt-1">
                  ${parkingLot.pricePerHour.toLocaleString()}/hora
                </p> */}
                <p className="text-sm text-blue-600 font-medium mt-1">
                  ${parkingLot?.pricePerHour?.toLocaleString?.() || 0}/hora
                </p>

              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de reserva</label>
                <input
                  type="date"
                  name="date"
                  required
                  min={today}
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora de inicio</label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora de fin</label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Duration and Cost Preview */}
              {duration > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duración:</span>
                    <span className="font-medium">
                      {duration} hora{duration !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Costo total:</span>
                    <span className="text-lg font-bold text-blue-600">${totalCost.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {/* Reservation Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Resumen de Reserva</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parqueadero:</span>
                    <span className="font-medium">{parkingLot.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium">{formData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horario:</span>
                    <span className="font-medium">
                      {formData.startTime} - {formData.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duración:</span>
                    <span className="font-medium">
                      {duration} hora{duration !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-blue-600">${totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Método de pago</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={formData.paymentMethod === "credit-card"}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="text-sm">💳 Tarjeta de Crédito</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="debit-card"
                      checked={formData.paymentMethod === "debit-card"}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="text-sm">💳 Tarjeta Débito</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="digital-wallet"
                      checked={formData.paymentMethod === "digital-wallet"}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="text-sm">📱 Billetera Digital</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 3 && reservationResult && (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-600">¡Reserva Confirmada!</h3>
              <div className="bg-green-50 rounded-lg p-4 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID de Reserva:</span>
                    <span className="font-medium">#{reservationResult.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Espacio Asignado:</span>
                    <span className="font-medium">{reservationResult.spaceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium">{reservationResult.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horario:</span>
                    <span className="font-medium">
                      {reservationResult.startTime} - {reservationResult.endTime}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Recibirás un correo de confirmación con todos los detalles de tu reserva.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {/* <div className="flex space-x-3 mt-6">
            {step === 1 && (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!formData.date || !formData.startTime || !formData.endTime || duration <= 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Continuar
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    "Confirmar y Pagar"
                  )}
                </button>
              </>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleClose}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Cerrar
              </button>
            )}
          </div> */}

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.date || !formData.startTime || !formData.endTime || duration <= 0}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </>
            ) : (
              <>
                {step === 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!formData.date || !formData.startTime || !formData.endTime || duration <= 0}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Continuar
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Procesando...
                        </div>
                      ) : (
                        "Confirmar y Pagar"
                      )}
                    </button>
                  </>
                )}

                {step === 3 && (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Cerrar
                  </button>
                )}
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReservationModal
