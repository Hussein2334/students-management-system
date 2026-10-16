import { Link } from 'react-router-dom'
import { useState } from 'react'
import api from '../api/axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)
    try {
      const res = await api.post('/auth/password-reset/', { email })
      setMessage({
        type: 'success',
        text: res.data.detail || 'Tumekutumia link ya kurejesha nenosiri.',
      })
      setEmail('')
    } catch (err) {
      const data = err.response?.data
      let errorText = 'Kuna kosa limetokea. Jaribu tena.'
      if (data) {
        if (typeof data === 'string') errorText = data
        else if (data.detail) errorText = data.detail
        else if (data.email)
          errorText = Array.isArray(data.email) ? data.email[0] : data.email
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
            <span className="text-white text-2xl">🔑</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Umesahau Nenosiri?</h1>
          <p className="text-gray-600 mt-2">
            Ingiza barua pepe yako na tutakutumia link ya kuweka nenosiri jipya.
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
              Barua Pepe
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="jina@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? 'Inatuma...' : 'Tuma Link ya Kurejesha'}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Unakumbuka nenosiri?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Ingia hapa
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}