import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    date_of_birth: '',
    password: '',
    password2: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (form.password !== form.password2) {
      setMessage({ type: 'error', text: 'Nenosiri hazifanani.' })
      return
    }

    if (form.password.length < 8) {
      setMessage({ type: 'error', text: 'Nenosiri liwe na herufi 8 au zaidi.' })
      return
    }

    setLoading(true)
    try {
      await register(form)
      setMessage({
        type: 'success',
        text: 'Usajili umefanikiwa! Tunakupeleka kwenye dashboard...',
      })
      setTimeout(() => navigate('/student/dashboard', { replace: true }), 800)
    } catch (err) {
      const data = err.response?.data
      let errorText = 'Kuna kosa limetokea. Jaribu tena.'

      if (data) {
        if (typeof data === 'string') {
          errorText = data
        } else if (data.detail) {
          errorText = data.detail
        } else if (data.non_field_errors) {
          errorText = Array.isArray(data.non_field_errors)
            ? data.non_field_errors[0]
            : data.non_field_errors
        } else {
          const firstKey = Object.keys(data)[0]
          const firstError = Array.isArray(data[firstKey])
            ? data[firstKey][0]
            : data[firstKey]
          errorText = `${firstKey}: ${firstError}`
        }
      }
      setMessage({ type: 'error', text: errorText })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Jiunge na ShulePro</h1>
          <p className="text-gray-600 mt-2">Sajili akaunti yako ya mwanafunzi</p>
        </div>

        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
              message.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jina la Kwanza
              </label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jina la Mwisho
              </label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
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
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Namba ya Simu
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+255..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tarehe ya Kuzaliwa
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nenosiri
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rudia Nenosiri
              </label>
              <input
                type="password"
                name="password2"
                value={form.password2}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            ℹ️ Usajili huu ni kwa <strong>wanafunzi pekee</strong>. Walimu na
            wasimamizi wanaongezwa na msimamizi (admin).
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? 'Inatuma...' : 'Sajili Akaunti'}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Una akaunti tayari?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Ingia hapa
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}