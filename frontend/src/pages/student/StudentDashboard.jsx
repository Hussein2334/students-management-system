import { useState, useEffect } from 'react'
import {
  BookOpen, CreditCard, TrendingUp, Award, GraduationCap,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2,
  DollarSign, Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const COLORS = ['#3ecf8e', '#63b3ed', '#9f8cf2', '#e6b85c', '#ed7f9d', '#51d3cb']

export default function StudentDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [courses, setCourses] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔵 Kuanza fetch...')

        const [statsRes, coursesRes, paymentsRes] = await Promise.allSettled([
          api.get('/auth/student/stats/'),
          api.get('/auth/student/courses/'),
          api.get('/auth/student/payments/'),
        ])

        console.log('🟢 statsRes:', statsRes)
        console.log('🟢 coursesRes:', coursesRes)
        console.log('🟢 paymentsRes:', paymentsRes)

        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data)
        } else {
          console.error('🔴 Stats error:', statsRes.reason)
          setError(statsRes.reason?.response?.data?.detail || 'Imeshindwa kupakia stats.')
        }

        if (coursesRes.status === 'fulfilled') {
          const data = coursesRes.value.data.results || coursesRes.value.data || []
          setCourses(data)
        }

        if (paymentsRes.status === 'fulfilled') {
          const data = paymentsRes.value.data.results || paymentsRes.value.data || []
          setPayments(data)
        }
      } catch (err) {
        console.error('🔴 Error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatMoney = (amount) =>
    new Intl.NumberFormat('sw-TZ', {
      style: 'currency', currency: 'TZS',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount)

  const monthlyData = (stats?.monthly_payments || []).map((m) => ({
    month: new Date(m.month).toLocaleDateString('sw-TZ', { month: 'short' }),
    total: parseFloat(m.total || 0),
  }))

  const monthlyChartData = monthlyData.length > 0 ? monthlyData : [
    { month: 'Jul', total: 0 },
    { month: 'Ago', total: 0 },
    { month: 'Sep', total: 0 },
    { month: 'Okt', total: 0 },
    { month: 'Nov', total: 0 },
    { month: 'Des', total: 0 },
  ]

  const paymentStatusData = [
    { name: 'Paid', value: payments.filter(p => p.status === 'paid').length, color: '#3ecf8e' },
    { name: 'Pending', value: payments.filter(p => p.status === 'pending').length, color: '#e6b85c' },
    { name: 'Failed', value: payments.filter(p => p.status === 'failed').length, color: '#ed7f9d' },
  ].filter(d => d.value > 0)

  const KPI = [
    {
      label: 'Kozi Zinazopatikana',
      value: stats?.total_courses ?? 0,
      icon: BookOpen,
      color: 'bg-sky-50 text-sky-600',
      trend: '+2',
      up: true,
    },
    {
      label: 'Malipo Yangu',
      value: stats?.total_payments ?? 0,
      icon: CreditCard,
      color: 'bg-brand-50 text-brand-600',
      trend: '+1',
      up: true,
    },
    {
      label: 'Yaliyolipwa',
      value: formatMoney(stats?.paid_amount || 0),
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
      trend: '+5%',
      up: true,
    },
    {
      label: 'Yanasubiri',
      value: formatMoney(stats?.pending_amount || 0),
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
      trend: '-2%',
      up: false,
    },
  ]

  const recentPayments = payments.slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Inapakia dashibodi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700">
          <Activity className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Welcome banner */}
      <div className="welcome-card-gradient rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold tracking-wider uppercase mb-4">
            Mwanafunzi
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-4xl mb-3">
            Karibu, {(user?.first_name || user?.username || '').toUpperCase()} 👋
          </h2>
          <p className="text-white/90 text-sm md:text-base max-w-2xl">
            Hii ni dashibodi yako ya mwanafunzi. Hapa unaweza kuona kozi zako,
            malipo yako, na maendeleo yako.
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {KPI.map((s, i) => {
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
              <div className="font-display font-extrabold text-xl md:text-2xl text-gray-900 mb-1 truncate">
                {s.value}
              </div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Monthly payments */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Malipo Yangu kwa Mwezi</h3>
              <p className="text-gray-500 text-xs mt-1">Historia ya malipo (miezi 6)</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-300" />
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyChartData}>
                <defs>
                  <linearGradient id="colorStudentPay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3ecf8e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3ecf8e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px' }}
                  formatter={(v) => formatMoney(v)}
                />
                <Area type="monotone" dataKey="total" stroke="#3ecf8e" strokeWidth={3} fillOpacity={1} fill="url(#colorStudentPay)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payments pie */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Hali ya Malipo</h3>
              <p className="text-gray-500 text-xs mt-1">Mgawanyo</p>
            </div>
            <CreditCard className="w-5 h-5 text-gray-300" />
          </div>
          <div style={{ width: '100%', height: 200 }}>
            {paymentStatusData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={paymentStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {paymentStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">Hakuna malipo</div>
            )}
          </div>
          <div className="space-y-2 mt-4">
            {paymentStatusData.map((d, i) => (
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

      {/* Kozi + Malipo */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Kozi */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Kozi Zinazopatikana</h3>
              <p className="text-gray-500 text-xs mt-1">Kozi zote hai</p>
            </div>
            <BookOpen className="w-5 h-5 text-gray-300" />
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
                  <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600">
                    {c.credits} credits
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent payments */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Malipo ya Hivi Karibuni</h3>
              <p className="text-gray-500 text-xs mt-1">Malipo 5 ya mwisho</p>
            </div>
            <Activity className="w-5 h-5 text-gray-300" />
          </div>

          {recentPayments.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">Hakuna malipo bado.</p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    p.status === 'paid' ? 'bg-emerald-50 text-emerald-600'
                      : p.status === 'pending' ? 'bg-amber-50 text-amber-600'
                      : 'bg-red-50 text-red-600'
                  }`}>
                    <DollarSign className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{p.reference}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(p.created_at).toLocaleDateString('sw-TZ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{formatMoney(p.amount)}</div>
                    <div className={`text-[10px] font-bold uppercase ${
                      p.status === 'paid' ? 'text-emerald-600'
                        : p.status === 'pending' ? 'text-amber-600'
                        : 'text-red-600'
                    }`}>
                      {p.status_display || p.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Kozi Zangu', path: '/student/courses', icon: BookOpen, color: 'from-sky-500 to-sky-600' },
          { label: 'Matokeo', path: '/student/results', icon: Award, color: 'from-brand-500 to-brand-600' },
          { label: 'Malipo', path: '/student/payments', icon: CreditCard, color: 'from-amber-500 to-amber-600' },
          { label: 'Wasifu Wangu', path: '/profile', icon: GraduationCap, color: 'from-violet-500 to-violet-600' },
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