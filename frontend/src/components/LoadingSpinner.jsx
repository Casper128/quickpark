const LoadingSpinner = ({ message = "Cargando..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">{message}</p>
        <div className="mt-4">
          <div className="text-2xl">🅿️</div>
          <p className="text-sm text-gray-500 mt-2">QuickPark</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
