import { useState, useEffect } from 'react'
import {
  Search, Plus, Edit, Trash2, UserX, UserCheck,
  X, Loader2, ShieldCheck, GraduationCap, BookOpen
} from 'lucide-react'
import api from '../../api/axios'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'student',
    phone: '',
    password: '',
    is_active: true,
  })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      const res = await api.get(`/auth/admin/users/?${params}`)
      let data = res.data.results || res.data
      if (roleFilter) data = data.filter(u => u.role === roleFilter)
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 300)
    return () => clearTimeout(timeout)
  }, [search, roleFilter])

  const openCreate = () => {
    setEditingUser(null)
    setForm({
      username: '', email: '', first_name: '', last_name: '',
      role: 'student', phone: '', password: '', is_active: true,
    })
    setShowModal(true)
  }

  const openEdit = (user) => {
    setEditingUser(user)
    setForm({
      username: user.username,
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      role: user.role,
      phone: user.phone || '',
      password: '',
      is_active: user.is_active,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        const payload = { ...form }
        if (!payload.password) delete payload.password
        await api.patch(`/auth/admin/users/${editingUser.id}/`, payload)
      } else {
        await api.post('/auth/admin/users/', form)
      }
      setShowModal(false)
      fetchUsers()
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
      fetchUsers()
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
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.detail || 'Imeshindwa kubadilisha.')
    } finally {
      setActionLoading(null)
    }
  }

  const ROLE_META = {
    admin: { icon: ShieldCheck, label: 'Admin', color: 'text-violet-600', bg: 'bg-violet-50' },
    teacher: { icon: BookOpen, label: 'Mwalimu', color: 'text-sky-600', bg: 'bg-sky-50' },
    student: { icon: GraduationCap, label: 'Mwanafunzi', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  }

  return (
    <div className="space-y-6">

      {/* ============ TOOLBAR ============ */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tafuta kwa jina, email, username..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 cursor-pointer"
        >
          <option value="">Wote</option>
          <option value="student">Wanafunzi</option>
          <option value="teacher">Walimu</option>
          <option value="admin">Wasimamizi</option>
        </select>

        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Ongeza Mtumiaji
        </button>
      </div>

      {/* ============ TABLE ============ */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-gray-400">Hakuna watumiaji waliopatikana.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Mtumiaji
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Role
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Simu
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
                {users.map((u) => {
                  const meta = ROLE_META[u.role] || ROLE_META.student
                  const RoleIcon = meta.icon
                  return (
                    <tr key={u.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-white font-bold text-sm">
                              {(u.first_name?.[0] || u.username?.[0] || '?').toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-gray-900 truncate">
                              {u.full_name || u.username}
                            </div>
                            <div className="text-xs text-gray-500 truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${meta.bg} ${meta.color}`}>
                          <RoleIcon className="w-3.5 h-3.5" />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-sm text-gray-600">{u.phone || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                          u.is_active
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {u.is_active ? 'HAI' : 'IMEZUIWA'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(u)}
                            className="p-2 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition"
                            title="Hariri"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(u.id)}
                            disabled={actionLoading === u.id}
                            className="p-2 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition disabled:opacity-50"
                            title={u.is_active ? 'Zuia' : 'Fungua'}
                          >
                            {u.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(u)}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                            title="Futa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
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
              <h2 className="font-display font-bold text-xl text-gray-900">
                {editingUser ? 'Hariri Mtumiaji' : 'Ongeza Mtumiaji Mpya'}
              </h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jina la Kwanza</label>
                  <input
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jina la Mwisho</label>
                  <input
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                <input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Barua Pepe *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:bg-white cursor-pointer"
                  >
                    <option value="student">Mwanafunzi</option>
                    <option value="teacher">Mwalimu</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Simu</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nenosiri {editingUser && <span className="text-gray-400">(acha wazi kama hutaki kubadilisha)</span>}
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
                  {editingUser ? 'Hifadhi' : 'Ongeza'}
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
              Futa Mtumiaji?
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