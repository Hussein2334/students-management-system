import { useState, useEffect } from 'react'
import { Award, TrendingUp, Target, Percent, Loader2, BarChart3 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'

export default function StudentResults() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Kwa sasa matokeo yanatoka localStorage
    // Baadaye tutaunganisha na backend
    setTimeout(() => {
      const saved = localStorage.getItem('teacher_results') || '[]'
      try {
        setResults(JSON.parse(saved))
      } catch (e) {
        setResults([])
      }
      setLoading(false)
    }, 500)
  }, [])

  const totalResults = results.length
  const averageScore = totalResults > 0
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalResults)
    : 0
  const passedCount = results.filter(r => r.percentage >= 50).length
  const passRate = totalResults > 0 ? Math.round((passedCount / totalResults) * 100) : 0

  const getGrade = (percentage) => {
    if (percentage >= 80) return { grade: 'A', color: 'text-emerald-600 bg-emerald-50' }
    if (percentage >= 70) return { grade: 'B', color: 'text-sky-600 bg-sky-50' }
    if (percentage >= 60) return { grade: 'C', color: 'text-violet-600 bg-violet-50' }
    if (percentage >= 50) return { grade: 'D', color: 'text-amber-600 bg-amber-50' }
    return { grade: 'F', color: 'text-red-600 bg-red-50' }
  }

  const gradeData = [
    { name: 'A', value: results.filter(r => r.percentage >= 80).length, color: '#3ecf8e' },
    { name: 'B', value: results.filter(r => r.percentage >= 70 && r.percentage < 80).length, color: '#63b3ed' },
    { name: 'C', value: results.filter(r => r.percentage >= 60 && r.percentage < 70).length, color: '#9f8cf2' },
    { name: 'D', value: results.filter(r => r.percentage >= 50 && r.percentage < 60).length, color: '#e6b85c' },
    { name: 'F', value: results.filter(r => r.percentage < 50).length, color: '#ed7f9d' },
  ].filter(g => g.value > 0)

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Matokeo Yote', value: totalResults, icon: Award, color: 'bg-brand-50 text-brand-600' },
          { label: 'Wastani', value: `${averageScore}%`, icon: Target, color: 'bg-sky-50 text-sky-600' },
          { label: 'Ufaulu', value: passedCount, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Kiwango', value: `${passRate}%`, icon: Percent, color: 'bg-violet-50 text-violet-600' },
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
                  <div className="text-gray-500 text-xs uppercase">{s.label}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      {gradeData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Mgawanyo wa Madaraja</h3>
              <p className="text-gray-500 text-xs mt-1">Matokeo yako</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-300" />
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
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

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="p-16 text-center">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Hakuna matokeo yaliyopatikana.</p>
            <p className="text-gray-400 text-sm mt-1">Matokeo yako yataonekana hapa.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Kozi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Alama</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Aina</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Daraja</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const grade = getGrade(r.percentage)
                  return (
                    <tr key={r.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{r.course_name}</div>
                        <div className="text-xs text-gray-500">{r.course_code}</div>
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
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
                          {r.exam_type_display}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${grade.color}`}>
                          {grade.grade}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}