"use client"

import { useState } from "react"
import { useParking } from "../context/ParkingContext"

const AdminDashboard = () => {
  const { parkingLots, reservations } = useParking()
  const [activeTab, setActiveTab] = useState("overview")

  const totalRevenue = reservations.filter((r) => r.paymentStatus === "paid").reduce((sum, r) => sum + r.totalCost, 0)

  const occupancyRate =
    parkingLots.reduce((total, lot) => {
      return total + ((lot.totalSpaces - lot.availableSpaces) / lot.totalSpaces) * 100
    }, 0) / parkingLots.length

  const stats = [
    {
      title: "Ingresos Totales",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: "💰",
      color: "bg-green-500",
    },
    {
      title: "Reservas Activas",
      value: reservations.filter((r) => r.status === "active").length,
      icon: "📅",
      color: "bg-blue-500",
    },
    {
      title: "Ocupación Promedio",
      value: `${occupancyRate.toFixed(1)}%`,
      icon: "📊",
      color: "bg-purple-500",
    },
    {
      title: "Parqueaderos",
      value: parkingLots.length,
      icon: "🅿️",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-purple-100">Gestiona parqueaderos, reservas y usuarios del sistema</p>
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

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", name: "Resumen", icon: "📊" },
              { id: "parking-lots", name: "Parqueaderos", icon: "🅿️" },
              { id: "reservations", name: "Reservas", icon: "📅" },
              { id: "users", name: "Usuarios", icon: "👥" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Reservations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservas Recientes</h3>
                  <div className="space-y-3">
                    {reservations.slice(0, 5).map((reservation) => (
                      <div key={reservation.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{reservation.parkingLotName}</p>
                          <p className="text-sm text-gray-600">
                            {reservation.date} • {reservation.startTime}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                    ))}
                  </div>
                </div>

                {/* Parking Lot Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Parqueaderos</h3>
                  <div className="space-y-3">
                    {parkingLots.map((lot) => (
                      <div key={lot.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{lot.name}</h4>
                          <span
                            className={`text-sm font-medium ${
                              lot.availableSpaces > lot.totalSpaces * 0.5
                                ? "text-green-600"
                                : lot.availableSpaces > lot.totalSpaces * 0.2
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {lot.availableSpaces}/{lot.totalSpaces} disponibles
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              lot.availableSpaces > lot.totalSpaces * 0.5
                                ? "bg-green-500"
                                : lot.availableSpaces > lot.totalSpaces * 0.2
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${((lot.totalSpaces - lot.availableSpaces) / lot.totalSpaces) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "parking-lots" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Gestión de Parqueaderos</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Agregar Parqueadero
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parqueadero
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ubicación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Espacios
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio/Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parkingLots.map((lot) => (
                      <tr key={lot.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{lot.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{lot.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {lot.availableSpaces}/{lot.totalSpaces}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${lot.pricePerHour.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              lot.availableSpaces > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {lot.availableSpaces > 0 ? "Disponible" : "Lleno"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                          <button className="text-red-600 hover:text-red-900">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "reservations" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Todas las Reservas</h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parqueadero
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha/Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duración
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Costo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{reservation.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reservation.parkingLotName}</div>
                          <div className="text-sm text-gray-500">Espacio: {reservation.spaceNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reservation.date}</div>
                          <div className="text-sm text-gray-500">
                            {reservation.startTime} - {reservation.endTime}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.duration}h</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${reservation.totalCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Agregar Usuario
                </button>
              </div>

              <div className="text-center py-12">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Gestión de Usuarios</h3>
                <p className="text-gray-600">Funcionalidad de gestión de usuarios en desarrollo</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
