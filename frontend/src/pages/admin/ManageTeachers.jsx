import { useState, useEffect } from 'react'
import {
  Search, Plus, Edit, Trash2, UserX, UserCheck,
  X, Loader2, BookOpen, Mail, Phone
} from 'lucide-react'
import api from '../../api/axios'

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    password: '',
    is_active: true,
  })

  const fetchTeachers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      const res = await api.get(`/auth/admin/users/?role=teacher&${params}`)
      const data = res.data.results || res.data
      // Filter upande wa client kwa usalama
      setTeachers(data.filter((u) => u.role === 'teacher'))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(fetchTeachers, 300)
    return () => clearTimeout(timeout)
  }, [search])

  const openCreate = () => {
    setEditingTeacher(null)
    setForm({
      username: '', email: '', first_name: '', last_name: '',
      phone: '', date_of_birth: '', password: '', is_active: true,
    })
    setShowModal(true)
  }

  const openEdit = (teacher) => {
    setEditingTeacher(teacher)
    setForm({
      username: teacher.username,
      email: teacher.email,
      first_name: teacher.first_name || '',
      last_name: teacher.last_name || '',
      phone: teacher.phone || '',
      date_of_birth: teacher.date_of_birth || '',
      password: '',
      is_active: teacher.is_active,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, role: 'teacher' }
      if (editingTeacher) {
        if (!payload.password) delete payload.password
        await api.patch(`/auth/admin/users/${editingTeacher.id}/`, payload)
      } else {
        await api.post('/auth/admin/users/', payload)
      }
      setShowModal(false)
      fetchTeachers()
    } catch (err) {
      console.error(err)
      alert('Kuna kosa: ' + JSON.stringify(err.response?.data || err.message))
    }
  }

  const handleDelete = async (id) => {
    setActionLoading(id)
    try {
      await api.delete(`/auth/admin/users/${id}/`)
      setDeleteConfirm(null)
      fetchTeachers()
    } catch (err) {
      alert(err.response?.data?.detail || 'Imeshindwa kufuta.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleActive = async (id) => {
    setActionLoading(id)
    try {
      await api.post(`/auth/admin/users/${id}/toggle-active/`)
      fetchTeachers()
    } catch (err) {
      alert(err.response?.data?.detail || 'Imeshindwa kubadilisha.')
    } finally {
      setActionLoading(null)
    }
  }

  const totalTeachers = teachers.length
  const activeTeachers = teachers.filter((t) => t.is_active).length
  const inactiveTeachers = totalTeachers - activeTeachers

  return (
    <div className="space-y-6">

      {/* ============ STAT CARDS ============ */}
      <div className="grid md:grid-cols-3 gap-5">
        {[
          { label: 'Walimu Wote', value: totalTeachers, color: 'bg-sky-50 text-sky-600', icon: BookOpen },
          { label: 'Walimu Hai', value: activeTeachers, color: 'bg-emerald-50 text-emerald-600', icon: UserCheck },
          { label: 'Wamezuiwa', value: inactiveTeachers, color: 'bg-amber-50 text-amber-600', icon: UserX },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <div>
                  <div className="font-display font-extrabold text-2xl text-gray-900">
                    {s.value}
                  </div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ============ TOOLBAR ============ */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tafuta mwalimu kwa jina, email, username..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
          />
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Ongeza Mwalimu
        </button>
      </div>

      {/* ============ TABLE ============ */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : teachers.length === 0 ? (
          <div className="p-16 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Hakuna walimu waliopatikana.</p>
            <p className="text-gray-400 text-sm mt-1">
              Bofya "Ongeza Mwalimu" kuanza.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Mwalimu
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Mawasiliano
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Tarehe ya Kuzaliwa
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Hali
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Vitendo
                  </th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white font-bold text-sm">
                            {(t.first_name?.[0] || t.username?.[0] || '?').toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-gray-900 truncate">
                            {t.full_name || t.username}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            @{t.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {t.email}
                        </div>
                        {t.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {t.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">
                        {t.date_of_birth
                          ? new Date(t.date_of_birth).toLocaleDateString('sw-TZ')
                          : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                        t.is_active
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {t.is_active ? 'HAI' : 'IMEZUIWA'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(t)}
                          className="p-2 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition"
                          title="Hariri"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(t.id)}
                          disabled={actionLoading === t.id}
                          className="p-2 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition disabled:opacity-50"
                          title={t.is_active ? 'Zuia' : 'Fungua'}
                        >
                          {t.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(t)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                          title="Futa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============ CREATE/EDIT MODAL ============ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-sky-600" />
                </div>
                <h2 className="font-display font-bold text-xl text-gray-900">
                  {editingTeacher ? 'Hariri Mwalimu' : 'Ongeza Mwalimu'}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jina la Kwanza
                  </label>
                  <input
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jina la Mwisho
                  </label>
                  <input
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barua Pepe *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Namba ya Simu
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+255..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarehe ya Kuzaliwa
                  </label>
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nenosiri{' '}
                  {editingTeacher && (
                    <span className="text-gray-400">(acha wazi kama hutaki kubadilisha)</span>
                  )}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700">Akaunti hai</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition"
                >
                  {editingTeacher ? 'Hifadhi' : 'Ongeza'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ DELETE CONFIRM ============ */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900 text-center mb-2">
              Futa Mwalimu?
            </h3>
            <p className="text-gray-600 text-sm text-center mb-6">
              Una uhakika unataka kufuta{' '}
              <strong className="text-gray-900">
                {deleteConfirm.full_name || deleteConfirm.username}
              </strong>
              ? Kitendo hiki hakiwezi kurudishwa.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Ghairi
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={actionLoading === deleteConfirm.id}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition disabled:opacity-60"
              >
                {actionLoading === deleteConfirm.id ? 'Inafuta...' : 'Futa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}