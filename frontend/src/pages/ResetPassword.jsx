import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import api from '../api/axios'

export default function ResetPassword() {
  const { uid, token } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({ new_password: '', new_password2: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (form.new_password !== form.new_password2) {
      setMessage({ type: 'error', text: 'Nenosiri hazifanani.' })
      return
    }

    if (form.new_password.length < 8) {
      setMessage({ type: 'error', text: 'Nenosiri liwe na herufi 8 au zaidi.' })
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/password-reset-confirm/', {
        uid,
        token,
        new_password: form.new_password,
        new_password2: form.new_password2,
      })
      setMessage({
        type: 'success',
        text: res.data.detail || 'Nenosiri limebadilishwa!',
      })
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      const data = err.response?.data
      let errorText = 'Link si sahihi au imeisha muda.'
      if (data) {
        if (typeof data === 'string') errorText = data
        else if (data.detail) errorText = data.detail
        else if (data.token)
          errorText = Array.isArray(data.token) ? data.token[0] : data.token
        else if (data.new_password)
          errorText = Array.isArray(data.new_password)
            ? data.new_password[0]
            : data.new_password
      }
      setMessage({ type: 'error', text: errorText })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🔒</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Weka Nenosiri Jipya</h1>
          <p className="text-gray-600 mt-2">
            Chagua nenosiri imara lenye herufi 8 au zaidi
          </p>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nenosiri Jipya
            </label>
            <input
              type="password"
              name="new_password"
              value={form.new_password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rudia Nenosiri Jipya
            </label>
            <input
              type="password"
              name="new_password2"
              value={form.new_password2}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? 'Inabadilisha...' : 'Badilisha Nenosiri'}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Unakumbuka sasa?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Ingia hapa
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}