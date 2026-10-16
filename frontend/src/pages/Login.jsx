import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role === 'admin') navigate('/admin/dashboard')
      else if (user.role === 'teacher') navigate('/teacher/dashboard')
      else navigate('/student/dashboard')
    } catch (err) {
      const data = err.response?.data
      let msg = 'Barua pepe au nenosiri si sahihi.'
      if (data) {
        if (typeof data === 'string') msg = data
        else if (data.detail) msg = data.detail
        else if (data.non_field_errors) {
          msg = Array.isArray(data.non_field_errors)
            ? data.non_field_errors[0]
            : data.non_field_errors
        } else {
          const firstKey = Object.keys(data)[0]
          const firstError = Array.isArray(data[firstKey])
            ? data[firstKey][0]
            : data[firstKey]
          msg = firstError
        }
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Karibu Tena</h1>
          <p className="text-gray-600 mt-2">Ingia kwenye akaunti yako</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Barua Pepe
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Password + Forgot link */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Nenosiri
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Umesahau nenosiri?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? 'Inaingia...' : 'Ingia'}
          </button>

          {/* Register link */}
          <p className="text-center text-gray-600 text-sm">
            Huna akaunti?{' '}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sajili hapa
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}