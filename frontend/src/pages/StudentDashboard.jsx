import { useAuth } from '../context/AuthContext'

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Karibu, {user?.first_name} 👋</h1>
      <p className="text-gray-600 mb-8">Hii ni dashboard yako ya mwanafunzi.</p>
      <button
        onClick={logout}
        className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Toka (Logout)
      </button>
    </div>
  )
}