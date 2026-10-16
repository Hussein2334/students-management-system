import { useState, useEffect } from 'react'
import {
  Search, Plus, Edit, Trash2, X, Loader2,
  BookOpen, User, Award, Filter
} from 'lucide-react'
import api from '../../api/axios'

export default function ManageCourses() {
  const [courses, setCourses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    level: 'form_1',
    credits: 1,
    teacher: '',
    is_active: true,
  })

  const LEVELS = [
    { value: 'form_1', label: 'Form 1' },
    { value: 'form_2', label: 'Form 2' },
    { value: 'form_3', label: 'Form 3' },
    { value: 'form_4', label: 'Form 4' },
    { value: 'form_5', label: 'Form 5' },
    { value: 'form_6', label: 'Form 6' },
  ]

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      const res = await api.get(`/admin/courses/?${params}`)
      let data = res.data.results || res.data
      if (levelFilter) data = data.filter(c => c.level === levelFilter)
      setCourses(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/auth/admin/users/?role=teacher')
      setTeachers(res.data.results || res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(fetchCourses, 300)
    return () => clearTimeout(timeout)
  }, [search, levelFilter])

  useEffect(() => {
    fetchTeachers()
  }, [])

  const openCreate = () => {
    setEditingCourse(null)
    setForm({
      code: '', name: '', description: '',
      level: 'form_1', credits: 1, teacher: '', is_active: true,
    })
    setShowModal(true)
  }

  const openEdit = (course) => {
    setEditingCourse(course)
    setForm({
      code: course.code,
      name: course.name,
      description: course.description || '',
      level: course.level,
      credits: course.credits,
      teacher: course.teacher || '',
      is_active: course.is_active,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form }
      if (!payload.teacher) payload.teacher = null
      if (editingCourse) {
        await api.patch(`/admin/courses/${editingCourse.id}/`, payload)
      } else {
        await api.post('/admin/courses/', payload)
      }
      setShowModal(false)
      fetchCourses()
    } catch (err) {
      console.error(err)
      alert('Kuna kosa: ' + JSON.stringify(err.response?.data || err.message))
    }
  }

  const handleDelete = async (id) => {
    setActionLoading(id)
    try {
      await api.delete(`/admin/courses/${id}/`)
      setDeleteConfirm(null)
      fetchCourses()
    } catch (err) {
      alert(err.response?.data?.detail || 'Imeshindwa kufuta.')
    } finally {
      setActionLoading(null)
    }
  }

  const totalCourses = courses.length
  const activeCourses = courses.filter(c => c.is_active).length

  const LEVEL_COLOR = {
    form_1: 'bg-emerald-50 text-emerald-600',
    form_2: 'bg-sky-50 text-sky-600',
    form_3: 'bg-violet-50 text-violet-600',
    form_4: 'bg-amber-50 text-amber-600',
    form_5: 'bg-pink-50 text-pink-600',
    form_6: 'bg-indigo-50 text-indigo-600',
  }

  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">{totalCourses}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Kozi Zote</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">{activeCourses}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Zinatumika</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <User className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">{teachers.length}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Walimu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tafuta kozi kwa jina, code..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
          />
        </div>

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="">Level zote</option>
          {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>

        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Ongeza Kozi
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="p-16 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Hakuna kozi zilizopatikana.</p>
            <p className="text-gray-400 text-sm mt-1">Bofya "Ongeza Kozi" kuanza.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Kozi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Level</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Mwalimu</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase hidden lg:table-cell">Credits</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Hali</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase">Vitendo</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-white" strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-gray-900 truncate">{c.name}</div>
                          <div className="text-xs text-gray-500">{c.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${LEVEL_COLOR[c.level] || 'bg-gray-100 text-gray-600'}`}>
                        {c.level_display}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{c.teacher_name || '—'}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">{c.credits}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${
                        c.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {c.is_active ? 'HAI' : 'IMEZUIWA'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(c)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-sky-600" />
                </div>
                <h2 className="font-display font-bold text-xl text-gray-900">
                  {editingCourse ? 'Hariri Kozi' : 'Ongeza Kozi Mpya'}
                </h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required
                    placeholder="MTH101"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jina la Kozi *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    placeholder="Hisabati"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maelezo</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white resize-none" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                  <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white">
                    {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credits *</label>
                  <input type="number" min="1" value={form.credits} onChange={(e) => setForm({ ...form, credits: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mwalimu</label>
                <select value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white">
                  <option value="">— Hakuna —</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.full_name || t.username}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500" />
                <span className="text-sm text-gray-700">Kozi inatumika</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                  Ghairi
                </button>
                <button type="submit"
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition">
                  {editingCourse ? 'Hifadhi' : 'Ongeza'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900 text-center mb-2">Futa Kozi?</h3>
            <p className="text-gray-600 text-sm text-center mb-6">
              Una uhakika unataka kufuta <strong className="text-gray-900">{deleteConfirm.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50">
                Ghairi
              </button>
              <button onClick={() => handleDelete(deleteConfirm.id)} disabled={actionLoading === deleteConfirm.id}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition disabled:opacity-60">
                {actionLoading === deleteConfirm.id ? 'Inafuta...' : 'Futa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}