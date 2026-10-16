import { useState, useEffect } from 'react'
import {
  BookOpen, Users, GraduationCap, TrendingUp, Activity,
  ArrowUpRight, ArrowDownRight, CheckCircle2, Clock,
  ClipboardList, Award
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const COLORS = ['#3ecf8e', '#63b3ed', '#9f8cf2', '#e6b85c', '#ed7f9d', '#51d3cb']

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.allSettled([
          api.get('/auth/teacher/stats/'),
          api.get('/auth/teacher/courses/'),
        ])

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data)
        if (coursesRes.status === 'fulfilled') {
          setCourses(coursesRes.value.data.results || coursesRes.value.data || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ============ CHART DATA ============
  const monthlyData = (stats?.monthly_courses_growth || []).map((m) => ({
    month: new Date(m.month).toLocaleDateString('sw-TZ', { month: 'short' }),
    courses: m.count,
  }))

  const monthlyChartData = monthlyData.length > 0 ? monthlyData : [
    { month: 'Jul', courses: 0 },
    { month: 'Ago', courses: 0 },
    { month: 'Sep', courses: 0 },
    { month: 'Okt', courses: 0 },
    { month: 'Nov', courses: 0 },
    { month: 'Des', courses: 0 },
  ]

  const coursesByLevel = (stats?.courses_by_level || []).map((c) => ({
    name: c.level.replace('form_', 'Form '),
    count: c.count,
  }))

  const roleData = [
    { name: 'Kozi Zangu', value: stats?.total_courses || 0, color: '#3ecf8e' },
    { name: 'Zinatumika', value: stats?.active_courses || 0, color: '#63b3ed' },
  ].filter((d) => d.value > 0)

  // ============ KPI ============
  const KPI = [
    {
      label: 'Kozi Zangu',
      value: stats?.total_courses ?? 0,
      icon: BookOpen,
      color: 'bg-sky-50 text-sky-600',
      trend: '+2',
      up: true,
    },
    {
      label: 'Zinatumika',
      value: stats?.active_courses ?? 0,
      icon: Award,
      color: 'bg-emerald-50 text-emerald-600',
      trend: '+1',
      up: true,
    },
    {
      label: 'Wanafunzi',
      value: stats?.total_students ?? 0,
      icon: GraduationCap,
      color: 'bg-brand-50 text-brand-600',
      trend: '+5',
      up: true,
    },
    {
      label: 'Wanafunzi Hai',
      value: stats?.active_students ?? 0,
      icon: Users,
      color: 'bg-violet-50 text-violet-600',
      trend: '+3',
      up: true,
    },
  ]

  return (
    <div className="space-y-6">

      {/* ============ WELCOME BANNER ============ */}
      <div className="welcome-card-gradient rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold tracking-wider uppercase mb-4">
            Mwalimu
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-4xl mb-3">
            Karibu, {(user?.first_name || user?.username || '').toUpperCase()} 👋
          </h2>
          <p className="text-white/90 text-sm md:text-base max-w-2xl">
            Hii ni dashibodi yako ya mwalimu. Hapa unaweza kusimamia kozi zako,
            kuona wanafunzi wako, na kufuatilia maendeleo.
          </p>
        </div>
      </div>

      {/* ============ KPI CARDS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {KPI.map((s, i) => {
          const Icon = s.icon
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                  s.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                  {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {s.trend}
                </div>
              </div>
              <div className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 mb-1">
                {s.value}
              </div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* ============ CHARTS ROW 1 ============ */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Monthly courses growth */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Ukuaji wa Kozi Zangu</h3>
              <p className="text-gray-500 text-xs mt-1">Kozi zilizoongezwa kwa mwezi (miezi 6)</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-300" />
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyChartData}>
                <defs>
                  <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#63b3ed" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#63b3ed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px' }} />
                <Area type="monotone" dataKey="courses" stroke="#63b3ed" strokeWidth={3} fillOpacity={1} fill="url(#colorCourses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Courses summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Muhtasari</h3>
              <p className="text-gray-500 text-xs mt-1">Kozi zangu</p>
            </div>
            <BookOpen className="w-5 h-5 text-gray-300" />
          </div>

          <div style={{ width: '100%', height: 180 }}>
            {roleData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={roleData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {roleData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">Hakuna data</div>
            )}
          </div>
          <div className="space-y-2 mt-4">
            {roleData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-bold text-gray-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ CHARTS ROW 2 ============ */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Courses by level */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Kozi kwa Level</h3>
              <p className="text-gray-500 text-xs mt-1">Mgawanyo wa kozi</p>
            </div>
            <ClipboardList className="w-5 h-5 text-gray-300" />
          </div>
          <div style={{ width: '100%', height: 260 }}>
            {coursesByLevel.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={coursesByLevel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px' }} />
                  <Bar dataKey="count" fill="#3ecf8e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Hakuna kozi bado
              </div>
            )}
          </div>
        </div>

        {/* Recent courses */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Kozi Zangu za Hivi Karibuni</h3>
              <p className="text-gray-500 text-xs mt-1">Kozi zilizoongezwa hivi karibuni</p>
            </div>
            <Activity className="w-5 h-5 text-gray-300" />
          </div>

          {courses.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">Hakuna kozi bado.</p>
          ) : (
            <div className="space-y-3">
              {courses.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{c.name}</div>
                    <div className="text-xs text-gray-500 truncate">{c.code} · {c.level_display}</div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${
                    c.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {c.is_active ? 'HAI' : 'IMEZUIWA'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============ QUICK ACTIONS ============ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Kozi Zangu', path: '/teacher/courses', icon: BookOpen, color: 'from-sky-500 to-sky-600' },
          { label: 'Wanafunzi', path: '/teacher/students', icon: GraduationCap, color: 'from-brand-500 to-brand-600' },
          { label: 'Mahudhurio', path: '/teacher/attendance', icon: Clock, color: 'from-amber-500 to-amber-600' },
          { label: 'Matokeo', path: '/teacher/results', icon: Award, color: 'from-violet-500 to-violet-600' },
        ].map((a, i) => {
          const Icon = a.icon
          return (
            <Link
              key={i}
              to={a.path}
              className={`bg-gradient-to-br ${a.color} text-white rounded-2xl p-5 hover:shadow-xl transition group`}
            >
              <Icon className="w-6 h-6 mb-3 group-hover:scale-110 transition" strokeWidth={2} />
              <div className="font-semibold text-sm">{a.label}</div>
            </Link>
          )
        })}
      </div>

    </div>
  )
}