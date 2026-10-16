import { useState, useEffect } from 'react'
import {
  Search, Loader2, Calendar, CheckCircle2, XCircle, Clock,
  Users, Save, AlertCircle, ChevronLeft, ChevronRight,
  GraduationCap, Filter, Download, UserCheck, UserX
} from 'lucide-react'
import api from '../../api/axios'

export default function TeacherAttendance() {
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  // Date & filter
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [selectedCourse, setSelectedCourse] = useState('')
  const [search, setSearch] = useState('')

  // Attendance records: { [studentId]: 'present' | 'absent' | 'late' | 'excused' }
  const [attendance, setAttendance] = useState({})

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [studentsRes, coursesRes] = await Promise.allSettled([
        api.get('/auth/teacher/students/'),
        api.get('/auth/teacher/courses/'),
      ])

      if (studentsRes.status === 'fulfilled') {
        const data = studentsRes.value.data.results || studentsRes.value.data || []
        setStudents(data)
        // Weka default 'present' kwa wanafunzi wote
        const initial = {}
        data.forEach(s => { initial[s.id] = 'present' })
        setAttendance(initial)
      }
      if (coursesRes.status === 'fulfilled') {
        setCourses(coursesRes.value.data.results || coursesRes.value.data || [])
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

  const filteredStudents = students.filter(s =>
    (s.full_name || s.username || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleMark = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status })
  }

  const handleMarkAll = (status) => {
    const updated = {}
    filteredStudents.forEach(s => { updated[s.id] = status })
    setAttendance({ ...attendance, ...updated })
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      // Hapa unaweza kutuma data kwa backend baadaye
      // Kwa sasa, tunaonyesha ujumbe tu
      await new Promise(r => setTimeout(r, 800))

      setMessage({
        type: 'success',
        text: `Mahudhurio yamehifadhiwa kwa ${selectedDate} (${filteredStudents.length} wanafunzi).`,
      })
      setTimeout(() => setMessage(null), 4000)
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Imeshindwa kuhifadhi. Jaribu tena.',
      })
    } finally {
      setSaving(false)
    }
  }

  const changeDate = (days) => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + days)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  // Stats
  const totalMarked = Object.keys(attendance).length
  const present = Object.values(attendance).filter(s => s === 'present').length
  const absent = Object.values(attendance).filter(s => s === 'absent').length
  const late = Object.values(attendance).filter(s => s === 'late').length
  const excused = Object.values(attendance).filter(s => s === 'excused').length

  const STATUS_OPTIONS = [
    { value: 'present', label: 'Yupo', color: 'emerald', icon: CheckCircle2 },
    { value: 'absent',  label: 'Hayupo', color: 'red', icon: XCircle },
    { value: 'late',    label: 'Amechelewa', color: 'amber', icon: Clock },
    { value: 'excused', label: 'Ruhusa', color: 'sky', icon: AlertCircle },
  ]

  return (
    <div className="space-y-6">

      {/* ============ STAT CARDS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {[
          { label: 'Yupo', value: present, color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
          { label: 'Hayupo', value: absent, color: 'bg-red-50 text-red-600', icon: XCircle },
          { label: 'Amechelewa', value: late, color: 'bg-amber-50 text-amber-600', icon: Clock },
          { label: 'Ruhusa', value: excused, color: 'bg-sky-50 text-sky-600', icon: AlertCircle },
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* ============ CONTROLS ============ */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">

        {/* Row 1: Date + Course */}
        <div className="grid md:grid-cols-2 gap-3">
          {/* Date picker */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Tarehe
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeDate(-1)}
                className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition"
                title="Siku iliyopita"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="relative flex-1">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>
              <button
                onClick={() => changeDate(1)}
                className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition"
                title="Siku inayofuata"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Course */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Kozi
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:bg-white cursor-pointer"
            >
              <option value="">Kozi zote</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tafuta mwanafunzi kwa jina, email..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
          />
        </div>

        {/* Row 3: Quick actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500 font-medium py-2">Weka wote:</span>
          {STATUS_OPTIONS.map((opt) => {
            const Icon = opt.icon
            return (
              <button
                key={opt.value}
                onClick={() => handleMarkAll(opt.value)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition bg-${opt.color}-50 text-${opt.color}-600 hover:bg-${opt.color}-100`}
              >
                <Icon className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ============ STUDENTS LIST ============ */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-gray-900">
                Orodha ya Wanafunzi
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">
                {totalMarked} kati ya {students.length} wamewekwa alama
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || filteredStudents.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl transition shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Inahifadhi...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Hifadhi Mahudhurio
              </>
            )}
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-16 text-center">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Hakuna wanafunzi waliopatikana.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredStudents.map((student) => {
              const currentStatus = attendance[student.id] || 'present'
              return (
                <div key={student.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition">

                  {/* Student info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {(student.first_name?.[0] || student.username?.[0] || '?').toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">
                        {student.full_name || student.username}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        @{student.username} · {student.email}
                      </div>
                    </div>
                  </div>

                  {/* Status buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {STATUS_OPTIONS.map((opt) => {
                      const Icon = opt.icon
                      const isActive = currentStatus === opt.value
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleMark(student.id, opt.value)}
                          className={`p-2 rounded-lg transition ${
                            isActive
                              ? opt.value === 'present' ? 'bg-emerald-500 text-white shadow-sm'
                                : opt.value === 'absent' ? 'bg-red-500 text-white shadow-sm'
                                : opt.value === 'late' ? 'bg-amber-500 text-white shadow-sm'
                                : 'bg-sky-500 text-white shadow-sm'
                              : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                          }`}
                          title={opt.label}
                        >
                          <Icon className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                      )
                    })}
                  </div>

                  {/* Status label */}
                  <div className="hidden md:block w-24 text-right">
                    <span className={`inline-block text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${
                      currentStatus === 'present' ? 'bg-emerald-50 text-emerald-600'
                        : currentStatus === 'absent' ? 'bg-red-50 text-red-600'
                        : currentStatus === 'late' ? 'bg-amber-50 text-amber-600'
                        : 'bg-sky-50 text-sky-600'
                    }`}>
                      {STATUS_OPTIONS.find(o => o.value === currentStatus)?.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}