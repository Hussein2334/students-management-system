import { useState, useEffect } from 'react'
import { Search, Loader2, GraduationCap, Mail, Phone, Users, AlertCircle } from 'lucide-react'
import api from '../../api/axios'

export default function TeacherStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  const fetchStudents = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)

      const url = `/auth/teacher/students/?${params}`
      console.log('🔵 Fetching:', url)

      const res = await api.get(url)
      console.log('🟢 Response:', res.data)

      // Kuchukua data — inashughulikia aina zote za response
      let data = []
      if (Array.isArray(res.data)) {
        data = res.data
      } else if (res.data && Array.isArray(res.data.results)) {
        data = res.data.results
      } else if (res.data && Array.isArray(res.data.data)) {
        data = res.data.data
      }

      console.log('🟡 Wanafunzi:', data.length)
      setStudents(data)
    } catch (err) {
      console.error('🔴 Error:', err)
      console.error('🔴 Response:', err.response?.data)
      console.error('🔴 Status:', err.response?.status)
      setError(err.response?.data?.detail || err.message || 'Kuna kosa')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(fetchStudents, 300)
    return () => clearTimeout(timeout)
  }, [search])

  const activeStudents = students.filter(s => s.is_active).length
  const inactiveStudents = students.length - activeStudents

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">{students.length}</div>
              <div className="text-gray-500 text-xs uppercase">Wanafunzi Wote</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">{activeStudents}</div>
              <div className="text-gray-500 text-xs uppercase">Wanafunzi Hai</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">{inactiveStudents}</div>
              <div className="text-gray-500 text-xs uppercase">Wamezuiwa</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-red-700 mb-1">Kuna kosa:</div>
            <div className="text-sm text-red-600">{error}</div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tafuta mwanafunzi..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <div className="p-16 text-center">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Hakuna wanafunzi waliopatikana.</p>
            <p className="text-gray-400 text-sm mt-1">
              Angalia Console (F12) kwa maelezo zaidi.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mwanafunzi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Mawasiliano</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Hali</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {(s.first_name?.[0] || s.username?.[0] || '?').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{s.full_name || s.username}</div>
                          <div className="text-xs text-gray-500">@{s.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {s.email}
                        </div>
                        {s.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {s.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${
                        s.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {s.is_active ? 'HAI' : 'IMEZUIWA'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}