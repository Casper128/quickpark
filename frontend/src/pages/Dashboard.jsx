"use client"
import { useAuth } from "../context/AuthContext"
import { useParking } from "../context/ParkingContext"
import { Link } from "react-router-dom"

const Dashboard = () => {
  const { user } = useAuth()
  const { parkingLots, reservations } = useParking()

  const activeReservations = reservations.filter((r) => r.status === "active")
  const totalSpent = reservations.filter((r) => r.paymentStatus === "paid").reduce((sum, r) => sum + r.totalCost, 0)

  const stats = [
    {
      title: "Reservas Activas",
      value: activeReservations.length,
      icon: "📅",
      color: "bg-blue-500",
    },
    {
      title: "Total Reservas",
      value: reservations.length,
      icon: "📊",
      color: "bg-green-500",
    },
    {
      title: "Gasto Total",
      value: `$${totalSpent.toLocaleString()}`,
      icon: "💰",
      color: "bg-purple-500",
    },
    {
      title: "Parqueaderos Disponibles",
      value: parkingLots.length,
      icon: "🅿️",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">¡Bienvenido, {user?.name}! 👋</h1>
        <p className="text-blue-100">Gestiona tus reservas de parqueadero de manera fácil y rápida</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-full p-3 text-white text-xl mr-4`}>{stat.icon}</div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Reservations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Reservas Activas</h2>
            <Link to="/reservations" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Ver todas →
            </Link>
          </div>

          {activeReservations.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🅿️</div>
              <p className="text-gray-500 mb-4">No tienes reservas activas</p>
              <Link
                to="/parking-lots"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Hacer una reserva
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeReservations.slice(0, 3).map((reservation) => (
                <div key={reservation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{reservation.parkingLotName}</h3>
                      <p className="text-sm text-gray-600">Espacio: {reservation.spaceNumber}</p>
                      <p className="text-sm text-gray-600">
                        {reservation.date} • {reservation.startTime} - {reservation.endTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Activa
                      </span>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        ${reservation.totalCost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Parking Lots */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Parqueaderos Populares</h2>
            <Link to="/parking-lots" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Ver todos →
            </Link>
          </div>

          <div className="space-y-4">
            {parkingLots.slice(0, 3).map((lot) => (
              <div key={lot.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{lot.name}</h3>
                    <p className="text-sm text-gray-600">{lot.address}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-sm text-gray-600">💰 ${lot.pricePerHour.toLocaleString()}/hora</span>
                      <span
                        className={`text-sm ${
                          lot.availableSpaces > 10
                            ? "text-green-600"
                            : lot.availableSpaces > 5
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        🅿️ {lot.availableSpaces} disponibles
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/parking-lots"
                    className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h2>

        {reservations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-500">No hay actividad reciente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.slice(0, 5).map((reservation) => (
              <div key={reservation.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      reservation.status === "active"
                        ? "bg-green-100 text-green-600"
                        : reservation.status === "completed"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-red-100 text-red-600"
                    }`}
                  >
                    {reservation.status === "active" ? "🟢" : reservation.status === "completed" ? "✅" : "❌"}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Reserva en {reservation.parkingLotName}</p>
                  <p className="text-sm text-gray-600">
                    {reservation.date} • {reservation.startTime} - {reservation.endTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">${reservation.totalCost.toLocaleString()}</p>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      reservation.status === "active"
                        ? "bg-green-100 text-green-800"
                        : reservation.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {reservation.status === "active"
                      ? "Activa"
                      : reservation.status === "completed"
                        ? "Completada"
                        : "Cancelada"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
