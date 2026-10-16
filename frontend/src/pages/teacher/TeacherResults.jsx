import { useState, useEffect } from 'react'
import {
  Search, Loader2, Award, TrendingUp, Users, BookOpen,
  Plus, Edit, Trash2, X, Save, AlertCircle, CheckCircle2,
  ChevronDown, BarChart3, Target, Percent
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import api from '../../api/axios'

const COLORS = ['#3ecf8e', '#63b3ed', '#9f8cf2', '#e6b85c', '#ed7f9d', '#51d3cb']

export default function TeacherResults() {
  const [results, setResults] = useState([])
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingResult, setEditingResult] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const [form, setForm] = useState({
    student: '',
    course: '',
    score: '',
    max_score: '100',
    exam_type: 'test',
    remarks: '',
  })

  const EXAM_TYPES = [
    { value: 'test', label: 'Mtihani Mdogo' },
    { value: 'midterm', label: 'Mtihani wa Katikati' },
    { value: 'final', label: 'Mtihani wa Mwisho' },
    { value: 'assignment', label: 'Kazi ya Darasa' },
    { value: 'project', label: 'Mradi' },
  ]

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [studentsRes, coursesRes] = await Promise.allSettled([
        api.get('/auth/teacher/students/'),
        api.get('/auth/teacher/courses/'),
      ])

      if (studentsRes.status === 'fulfilled') {
        setStudents(studentsRes.value.data.results || studentsRes.value.data || [])
      }
      if (coursesRes.status === 'fulfilled') {
        setCourses(coursesRes.value.data.results || coursesRes.value.data || [])
      }

      // Kwa sasa matokeo yanatoka localStorage (kama backend haipo)
      const saved = localStorage.getItem('teacher_results')
      if (saved) {
        setResults(JSON.parse(saved))
      }
    } catch (err) {
      console.error(err)
      setError('Imeshindwa kupakia data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Save to localStorage kila results inabadilika
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('teacher_results', JSON.stringify(results))
    }
  }, [results, loading])

  const filteredResults = results.filter(r => {
    const matchesSearch =
      (r.student_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.course_name || '').toLowerCase().includes(search.toLowerCase())
    const matchesCourse = !courseFilter || r.course === courseFilter
    return matchesSearch && matchesCourse
  })

  const openCreate = () => {
    setEditingResult(null)
    setForm({
      student: '',
      course: '',
      score: '',
      max_score: '100',
      exam_type: 'test',
      remarks: '',
    })
    setShowModal(true)
  }

  const openEdit = (result) => {
    setEditingResult(result)
    setForm({
      student: result.student,
      course: result.course,
      score: result.score,
      max_score: result.max_score,
      exam_type: result.exam_type,
      remarks: result.remarks || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const student = students.find(s => s.id === parseInt(form.student))
      const course = courses.find(c => c.id === parseInt(form.course))

      if (!student || !course) {
        setMessage({ type: 'error', text: 'Chagua mwanafunzi na kozi.' })
        return
      }

      const score = parseFloat(form.score)
      const maxScore = parseFloat(form.max_score)
      const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0

      const newResult = {
        id: editingResult ? editingResult.id : Date.now(),
        student: parseInt(form.student),
        student_name: student.full_name || student.username,
        course: parseInt(form.course),
        course_name: course.name,
        course_code: course.code,
        score: score,
        max_score: maxScore,
        percentage: percentage,
        exam_type: form.exam_type,
        exam_type_display: EXAM_TYPES.find(e => e.value === form.exam_type)?.label || form.exam_type,
        remarks: form.remarks,
        date: new Date().toISOString(),
      }

      if (editingResult) {
        setResults(results.map(r => r.id === editingResult.id ? newResult : r))
        setMessage({ type: 'success', text: 'Matokeo yamehaririwa.' })
      } else {
        setResults([newResult, ...results])
        setMessage({ type: 'success', text: 'Matokeo yameongezwa.' })
      }

      setShowModal(false)
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: 'Kuna kosa. Jaribu tena.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (id) => {
    setResults(results.filter(r => r.id !== id))
    setDeleteConfirm(null)
    setMessage({ type: 'success', text: 'Matokeo yamefutwa.' })
    setTimeout(() => setMessage(null), 3000)
  }

  // Stats
  const totalResults = results.length
  const averageScore = totalResults > 0
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalResults)
    : 0
  const passedCount = results.filter(r => r.percentage >= 50).length
  const failedCount = totalResults - passedCount
  const passRate = totalResults > 0 ? Math.round((passedCount / totalResults) * 100) : 0

  // Chart: results by grade
  const gradeData = [
    { name: 'A (80-100)', value: results.filter(r => r.percentage >= 80).length, color: '#3ecf8e' },
    { name: 'B (70-79)', value: results.filter(r => r.percentage >= 70 && r.percentage < 80).length, color: '#63b3ed' },
    { name: 'C (60-69)', value: results.filter(r => r.percentage >= 60 && r.percentage < 70).length, color: '#9f8cf2' },
    { name: 'D (50-59)', value: results.filter(r => r.percentage >= 50 && r.percentage < 60).length, color: '#e6b85c' },
    { name: 'F (0-49)', value: results.filter(r => r.percentage < 50).length, color: '#ed7f9d' },
  ].filter(g => g.value > 0)

  const getGrade = (percentage) => {
    if (percentage >= 80) return { grade: 'A', color: 'text-emerald-600 bg-emerald-50' }
    if (percentage >= 70) return { grade: 'B', color: 'text-sky-600 bg-sky-50' }
    if (percentage >= 60) return { grade: 'C', color: 'text-violet-600 bg-violet-50' }
    if (percentage >= 50) return { grade: 'D', color: 'text-amber-600 bg-amber-50' }
    return { grade: 'F', color: 'text-red-600 bg-red-50' }
  }

  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString('sw-TZ', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">

      {/* ============ STAT CARDS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {[
          { label: 'Matokeo Yote', value: totalResults, icon: Award, color: 'bg-brand-50 text-brand-600' },
          { label: 'Wastani', value: `${averageScore}%`, icon: Target, color: 'bg-sky-50 text-sky-600' },
          { label: 'Wamefaulu', value: passedCount, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Kiwango cha Ufaulu', value: `${passRate}%`, icon: Percent, color: 'bg-violet-50 text-violet-600' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <div className="font-display font-extrabold text-2xl text-gray-900">{s.value}</div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">{s.label}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ============ MESSAGE ============ */}
      {message && (
        <div
          className={`rounded-2xl p-4 flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* ============ CHART ============ */}
      {gradeData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Mgawanyo wa Madaraja</h3>
              <p className="text-gray-500 text-xs mt-1">Matokeo kwa madaraja</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-300" />
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {gradeData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ============ TOOLBAR ============ */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tafuta kwa mwanafunzi, kozi..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="">Kozi zote</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
          ))}
        </select>

        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Ongeza Matokeo
        </button>
      </div>

      {/* ============ TABLE ============ */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="p-16 text-center">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Hakuna matokeo yaliyopatikana.</p>
            <p className="text-gray-400 text-sm mt-1">Bofya "Ongeza Matokeo" kuanza.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mwanafunzi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Kozi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Alama</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase hidden lg:table-cell">Aina</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Daraja</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase">Vitendo</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((r) => {
                  const grade = getGrade(r.percentage)
                  return (
                    <tr key={r.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{r.student_name}</div>
                        <div className="text-xs text-gray-500">{formatDate(r.date)}</div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="text-sm font-semibold text-gray-900">{r.course_code}</div>
                        <div className="text-xs text-gray-500">{r.course_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{r.score}</span>
                          <span className="text-gray-400 text-sm">/ {r.max_score}</span>
                        </div>
                        <div className="mt-1 w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              r.percentage >= 80 ? 'bg-emerald-500'
                              : r.percentage >= 70 ? 'bg-sky-500'
                              : r.percentage >= 60 ? 'bg-violet-500'
                              : r.percentage >= 50 ? 'bg-amber-500'
                              : 'bg-red-500'
                            }`}
                            style={{ width: `${r.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">{r.percentage}%</div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
                          {r.exam_type_display}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${grade.color}`}>
                          {grade.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(r)}
                            className="p-2 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(r)}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
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

      {/* ============ MODAL ============ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-brand-600" />
                </div>
                <h2 className="font-display font-bold text-xl text-gray-900">
                  {editingResult ? 'Hariri Matokeo' : 'Ongeza Matokeo'}
                </h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mwanafunzi *</label>
                <select
                  value={form.student}
                  onChange={(e) => setForm({ ...form, student: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white cursor-pointer"
                >
                  <option value="">— Chagua mwanafunzi —</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.full_name || s.username}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kozi *</label>
                <select
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white cursor-pointer"
                >
                  <option value="">— Chagua kozi —</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alama *</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.score}
                    onChange={(e) => setForm({ ...form, score: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kiwango cha Juu *</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.max_score}
                    onChange={(e) => setForm({ ...form, max_score: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aina ya Mtihani *</label>
                <select
                  value={form.exam_type}
                  onChange={(e) => setForm({ ...form, exam_type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white cursor-pointer"
                >
                  {EXAM_TYPES.map(e => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maoni</label>
                <textarea
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  rows={3}
                  placeholder="Maoni kuhusu matokeo..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white rounded-xl font-semibold transition inline-flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingResult ? 'Hifadhi' : 'Ongeza'}
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
            <h3 className="font-display font-bold text-xl text-gray-900 text-center mb-2">Futa Matokeo?</h3>
            <p className="text-gray-600 text-sm text-center mb-6">
              Una uhakika unataka kufuta matokeo ya{' '}
              <strong className="text-gray-900">{deleteConfirm.student_name}</strong>?
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
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition"
              >
                Futa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}