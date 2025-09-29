"use client"

import { useState } from "react"
import { useParking } from "../context/ParkingContext"
import ReservationModal from "../components/ReservationModal"

const ParkingLots = () => {
  const { parkingLots } = useParking()
  const [selectedLot, setSelectedLot] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")

  const filteredLots = parkingLots.filter((lot) => {
    const matchesSearch =
      lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "low" && lot.pricePerHour <= 2500) ||
      (priceFilter === "medium" && lot.pricePerHour > 2500 && lot.pricePerHour <= 3500) ||
      (priceFilter === "high" && lot.pricePerHour > 3500)

    return matchesSearch && matchesPrice
  })

  const handleReserve = (lot) => {
    setSelectedLot(lot)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parqueaderos Disponibles</h1>
          <p className="text-gray-600 mt-1">Encuentra y reserva el parqueadero perfecto para ti</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar parqueadero</label>
            <input
              type="text"
              placeholder="Buscar por nombre o dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por precio</label>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los precios</option>
              <option value="low">Económico (&lt;= $2,500/hora)</option>
              <option value="medium">Medio ($2,501 - $3,500/hora)</option>
              <option value="high">Premium (&gt; $3,500/hora)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="text-sm text-gray-600 mb-4">
        Mostrando {filteredLots.length} de {parkingLots.length} parqueaderos
      </div>

      {/* Parking Lots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLots.map((lot) => (
          <div key={lot.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              <img src={lot.image || "/placeholder.svg"} alt={lot.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lot.availableSpaces > 10
                      ? "bg-green-100 text-green-800"
                      : lot.availableSpaces > 5
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {lot.availableSpaces} disponibles
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{lot.name}</h3>
              <p className="text-gray-600 mb-4 flex items-center">📍 {lot.address}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Precio por hora:</span>
                  <span className="text-lg font-bold text-blue-600">${lot.pricePerHour.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Espacios totales:</span>
                  <span className="text-sm font-medium">{lot.totalSpaces}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Características:</p>
                <div className="flex flex-wrap gap-2">
                  {lot.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleReserve(lot)}
                disabled={lot.availableSpaces === 0}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  lot.availableSpaces === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {lot.availableSpaces === 0 ? "Sin espacios disponibles" : "Reservar Ahora"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLots.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron parqueaderos</h3>
          <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
        </div>
      )}

      {/* Reservation Modal */}
      <ReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} parkingLot={selectedLot} />
    </div>
  )
}

export default ParkingLots
