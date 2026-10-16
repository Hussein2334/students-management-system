import { useState, useEffect } from 'react'
import { Search, Loader2, BookOpen, Award, Users } from 'lucide-react'
import api from '../../api/axios'

export default function StudentCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('')

  const LEVELS = [
    { value: 'form_1', label: 'Form 1' },
    { value: 'form_2', label: 'Form 2' },
    { value: 'form_3', label: 'Form 3' },
    { value: 'form_4', label: 'Form 4' },
    { value: 'form_5', label: 'Form 5' },
    { value: 'form_6', label: 'Form 6' },
  ]

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        const res = await api.get(`/auth/student/courses/?${params}`)
        let data = res.data.results || res.data || []
        if (levelFilter) data = data.filter(c => c.level === levelFilter)
        setCourses(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    const timeout = setTimeout(fetchCourses, 300)
    return () => clearTimeout(timeout)
  }, [search, levelFilter])

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
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">{courses.length}</div>
              <div className="text-gray-500 text-xs uppercase">Kozi Zote</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">
                {courses.reduce((sum, c) => sum + (c.credits || 0), 0)}
              </div>
              <div className="text-gray-500 text-xs uppercase">Credits</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Users className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">
                {new Set(courses.map(c => c.level)).size}
              </div>
              <div className="text-gray-500 text-xs uppercase">Levels</div>
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
            placeholder="Tafuta kozi..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="">Level zote</option>
          {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-16 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Hakuna kozi zilizopatikana.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${LEVEL_COLOR[c.level] || 'bg-gray-100 text-gray-600'}`}>
                  {c.level_display}
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-gray-900 mb-1">{c.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{c.code}</p>

              {c.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{c.description}</p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  <strong className="text-gray-900">{c.credits}</strong> credits
                </div>
                {c.teacher_name && (
                  <div className="text-xs text-gray-500">
                    <strong className="text-gray-900">{c.teacher_name}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}