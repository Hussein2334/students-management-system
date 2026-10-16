import { useState, useEffect } from 'react'
import {
  Users, GraduationCap, BookOpen, ShieldCheck,
  TrendingUp, Activity, ArrowRight, CheckCircle2,
  ArrowUpRight, ArrowDownRight, DollarSign, CreditCard,
  Clock, Bell, Calendar
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const COLORS = ['#3ecf8e', '#63b3ed', '#9f8cf2', '#e6b85c', '#ed7f9d', '#51d3cb']

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentUsers, setRecentUsers] = useState([])
  const [recentLogs, setRecentLogs] = useState([])
  const [payments, setPayments] = useState([])
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          statsRes,
          usersRes,
          logsRes,
          paymentsRes,
          coursesRes,
        ] = await Promise.allSettled([
          api.get('/auth/admin/stats/'),
          api.get('/auth/admin/users/?ordering=-created_at'),
          api.get('/auth/admin/logs/?limit=5'),
          api.get('/admin/payments/'),
          api.get('/admin/courses/'),
        ])

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data)
        if (usersRes.status === 'fulfilled') {
          const list = usersRes.value.data.results || usersRes.value.data
          setRecentUsers(list.slice(0, 5))
        }
        if (logsRes.status === 'fulfilled') {
          const list = logsRes.value.data.results || logsRes.value.data
          setRecentLogs(list.slice(0, 5))
        }
        if (paymentsRes.status === 'fulfilled') {
          setPayments(paymentsRes.value.data.results || paymentsRes.value.data || [])
        }
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

  // ============ DATA KWA GRAPHS ============

  // 1. Monthly growth (kwa Line/Area chart)
  const monthlyData = (stats?.monthly_growth || []).map((m) => ({
    month: new Date(m.month).toLocaleDateString('sw-TZ', { month: 'short' }),
    users: m.count,
  }))

  // Kama hakuna data, tengeneza mfano
  const monthlyChartData = monthlyData.length > 0 ? monthlyData : [
    { month: 'Jul', users: 0 },
    { month: 'Ago', users: 0 },
    { month: 'Sep', users: 0 },
    { month: 'Okt', users: 0 },
    { month: 'Nov', users: 0 },
    { month: 'Des', users: 0 },
  ]

  // 2. Users by role (kwa Pie chart)
  const roleData = [
    { name: 'Wanafunzi', value: stats?.total_students || 0, color: '#3ecf8e' },
    { name: 'Walimu', value: stats?.total_teachers || 0, color: '#63b3ed' },
    { name: 'Wasimamizi', value: stats?.total_admins || 0, color: '#9f8cf2' },
  ].filter((d) => d.value > 0)

  // 3. Payments status (kwa Bar chart)
  const paymentStatusData = [
    { status: 'Paid', count: payments.filter((p) => p.status === 'paid').length, color: '#3ecf8e' },
    { status: 'Pending', count: payments.filter((p) => p.status === 'pending').length, color: '#e6b85c' },
    { status: 'Failed', count: payments.filter((p) => p.status === 'failed').length, color: '#ed7f9d' },
    { status: 'Refunded', count: payments.filter((p) => p.status === 'refunded').length, color: '#94a3b8' },
  ]

  // 4. Courses by level (kwa Bar chart)
  const coursesByLevel = (() => {
    const levels = {}
    courses.forEach((c) => {
      const lvl = c.level_display || c.level
      levels[lvl] = (levels[lvl] || 0) + 1
    })
    return Object.entries(levels).map(([name, count]) => ({ name, count }))
  })()

  // Total revenue
  const totalRevenue = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  const formatMoney = (amount) =>
    new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)

  const completion = stats?.total_users
    ? Math.round(((stats.active_users || 0) / stats.total_users) * 100)
    : 0

  // ============ KPI CARDS ============
  const KPI_CARDS = [
    {
      label: 'Wanafunzi',
      value: stats?.total_students ?? '—',
      icon: GraduationCap,
      color: 'bg-emerald-50 text-emerald-600',
      trend: '+12%',
      up: true,
    },
    {
      label: 'Walimu',
      value: stats?.total_teachers ?? '—',
      icon: BookOpen,
      color: 'bg-sky-50 text-sky-600',
      trend: '+3%',
      up: true,
    },
    {
      label: 'Kozi',
      value: courses.length,
      icon: BookOpen,
      color: 'bg-violet-50 text-violet-600',
      trend: '+5%',
      up: true,
    },
    {
      label: 'Mapato',
      value: formatMoney(totalRevenue),
      icon: DollarSign,
      color: 'bg-amber-50 text-amber-600',
      trend: '+8%',
      up: true,
    },
  ]

  return (
    <div className="space-y-6">

      {/* ============ WELCOME BANNER ============ */}
      <div className="welcome-card-gradient rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold tracking-wider uppercase mb-4">
              {user?.role === 'admin' ? 'Msimamizi' : 'Mtumiaji'}
            </div>
            <h2 className="font-display font-extrabold text-2xl md:text-4xl mb-3">
              Karibu, {(user?.first_name || user?.username || '').toUpperCase()} 👋
            </h2>
            <p className="text-white/90 text-sm md:text-base max-w-2xl">
              Hii ni dashibodi yako ya msimamizi. Hapa unaona muhtasari wa mfumo,
              takwimu, na shughuli za hivi karibuni.
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <svg className="transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.2)" strokeWidth="10" fill="none" />
                <circle
                  cx="60" cy="60" r="50"
                  stroke="white" strokeWidth="10" fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - completion / 100)}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-display font-extrabold text-2xl md:text-3xl">{completion}%</div>
                  <div className="text-[10px] uppercase tracking-wider opacity-80">Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ KPI CARDS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {KPI_CARDS.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition">
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
              <div className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 mb-1 truncate">
                {s.value}
              </div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* ============ CHARTS ROW 1 ============ */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Monthly users - Area chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Ukuaji wa Watumiaji</h3>
              <p className="text-gray-500 text-xs mt-1">Watumiaji wapya kwa mwezi (miezi 6)</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-300" />
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyChartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3ecf8e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3ecf8e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '13px',
                  }}
                />
                <Area
                  type="monotone" dataKey="users" stroke="#3ecf8e" strokeWidth={3}
                  fillOpacity={1} fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users by role - Pie chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Watumiaji kwa Role</h3>
              <p className="text-gray-500 text-xs mt-1">Mgawanyo wa role</p>
            </div>
            <Users className="w-5 h-5 text-gray-300" />
          </div>
          <div style={{ width: '100%', height: 220 }}>
            {roleData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '13px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Hakuna data
              </div>
            )}
          </div>
          <div className="space-y-2 mt-2">
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

        {/* Payments by status - Bar chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Malipo kwa Hali</h3>
              <p className="text-gray-500 text-xs mt-1">Mgawanyo wa malipo</p>
            </div>
            <CreditCard className="w-5 h-5 text-gray-300" />
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={paymentStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="status" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Courses by level - Bar chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Kozi kwa Level</h3>
              <p className="text-gray-500 text-xs mt-1">Mgawanyo wa kozi</p>
            </div>
            <BookOpen className="w-5 h-5 text-gray-300" />
          </div>
          <div style={{ width: '100%', height: 260 }}>
            {coursesByLevel.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={coursesByLevel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="count" fill="#9f8cf2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Hakuna kozi bado
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ RECENT ACTIVITY ============ */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Recent users */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Watumiaji wa Hivi Karibuni</h3>
              <p className="text-gray-500 text-xs mt-1">Waliyojisajili hivi karibuni</p>
            </div>
            <Activity className="w-5 h-5 text-gray-300" />
          </div>

          {recentUsers.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">Hakuna watumiaji bado.</p>
          ) : (
            <div className="space-y-2">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {(u.first_name?.[0] || u.username?.[0] || '?').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {u.full_name || u.username}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{u.email}</div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${
                    u.role === 'admin' ? 'bg-violet-50 text-violet-600' :
                    u.role === 'teacher' ? 'bg-sky-50 text-sky-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent logs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Shughuli za Hivi Karibuni</h3>
              <p className="text-gray-500 text-xs mt-1">Kutoka system logs</p>
            </div>
            <Bell className="w-5 h-5 text-gray-300" />
          </div>

          {recentLogs.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">Hakuna shughuli bado.</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 truncate">
                      <strong>{log.user_name}</strong>{' '}
                      <span className="text-gray-500 capitalize">({log.user_role})</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{log.description || log.action}</p>
                    <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.created_at).toLocaleString('sw-TZ', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============ QUICK ACTIONS ============ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Simamia Watumiaji', path: '/admin/users', icon: Users, color: 'from-brand-500 to-brand-600' },
          { label: 'Simamia Kozi', path: '/admin/courses', icon: BookOpen, color: 'from-sky-500 to-sky-600' },
          { label: 'Malipo', path: '/admin/payments', icon: CreditCard, color: 'from-amber-500 to-amber-600' },
          { label: 'Ripoti', path: '/admin/reports', icon: TrendingUp, color: 'from-violet-500 to-violet-600' },
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