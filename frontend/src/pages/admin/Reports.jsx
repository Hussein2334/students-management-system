import { useState, useEffect } from 'react'
import {
  BarChart3, TrendingUp, Users, GraduationCap, BookOpen,
  CreditCard, Download, Printer, Filter, Calendar,
  ArrowUpRight, ArrowDownRight, DollarSign, Activity,
  FileText, PieChart as PieIcon, LineChart as LineIcon
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'
import api from '../../api/axios'

const COLORS = ['#3ecf8e', '#63b3ed', '#9f8cf2', '#e6b85c', '#ed7f9d', '#51d3cb']

export default function Reports() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [payments, setPayments] = useState([])
  const [period, setPeriod] = useState('all')   // all, month, week, today
  const [reportType, setReportType] = useState('overview')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, coursesRes, paymentsRes] = await Promise.allSettled([
        api.get('/auth/admin/stats/'),
        api.get('/auth/admin/users/'),
        api.get('/admin/courses/'),
        api.get('/admin/payments/'),
      ])

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data)
      if (usersRes.status === 'fulfilled')
        setUsers(usersRes.value.data.results || usersRes.value.data || [])
      if (coursesRes.status === 'fulfilled')
        setCourses(coursesRes.value.data.results || coursesRes.value.data || [])
      if (paymentsRes.status === 'fulfilled')
        setPayments(paymentsRes.value.data.results || paymentsRes.value.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ============ FILTER BY PERIOD ============
  const filterByPeriod = (items, dateField = 'created_at') => {
    if (period === 'all') return items
    const now = new Date()
    const cutoff = new Date()

    if (period === 'today') cutoff.setHours(0, 0, 0, 0)
    else if (period === 'week') cutoff.setDate(now.getDate() - 7)
    else if (period === 'month') cutoff.setMonth(now.getMonth() - 1)

    return items.filter((item) => new Date(item[dateField]) >= cutoff)
  }

  const filteredUsers = filterByPeriod(users)
  const filteredPayments = filterByPeriod(payments)

  // ============ STATS ============
  const totalRevenue = filteredPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  const pendingRevenue = filteredPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  const formatMoney = (amount) =>
    new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)

  // ============ DATA KWA CHARTS ============

  // 1. Monthly user growth
  const monthlyData = (() => {
    const data = {}
    filteredUsers.forEach((u) => {
      const d = new Date(u.created_at)
      const key = d.toLocaleDateString('sw-TZ', { month: 'short', year: 'numeric' })
      data[key] = (data[key] || 0) + 1
    })
    return Object.entries(data)
      .map(([month, users]) => ({ month, users }))
      .slice(-6)
  })()

  const monthlyChartData = monthlyData.length > 0 ? monthlyData : [
    { month: 'Jul', users: 0 },
    { month: 'Ago', users: 0 },
    { month: 'Sep', users: 0 },
    { month: 'Okt', users: 0 },
    { month: 'Nov', users: 0 },
    { month: 'Des', users: 0 },
  ]

  // 2. Users by role
  const roleData = [
    { name: 'Wanafunzi', value: filteredUsers.filter(u => u.role === 'student').length, color: '#3ecf8e' },
    { name: 'Walimu', value: filteredUsers.filter(u => u.role === 'teacher').length, color: '#63b3ed' },
    { name: 'Wasimamizi', value: filteredUsers.filter(u => u.role === 'admin').length, color: '#9f8cf2' },
  ].filter(d => d.value > 0)

  // 3. Payments by status
  const paymentStatusData = [
    { status: 'Paid', count: filteredPayments.filter(p => p.status === 'paid').length, amount: filteredPayments.filter(p => p.status === 'paid').reduce((s, p) => s + parseFloat(p.amount || 0), 0), color: '#3ecf8e' },
    { status: 'Pending', count: filteredPayments.filter(p => p.status === 'pending').length, amount: filteredPayments.filter(p => p.status === 'pending').reduce((s, p) => s + parseFloat(p.amount || 0), 0), color: '#e6b85c' },
    { status: 'Failed', count: filteredPayments.filter(p => p.status === 'failed').length, amount: filteredPayments.filter(p => p.status === 'failed').reduce((s, p) => s + parseFloat(p.amount || 0), 0), color: '#ed7f9d' },
    { status: 'Refunded', count: filteredPayments.filter(p => p.status === 'refunded').length, amount: filteredPayments.filter(p => p.status === 'refunded').reduce((s, p) => s + parseFloat(p.amount || 0), 0), color: '#94a3b8' },
  ]

  // 4. Courses by level
  const coursesByLevel = (() => {
    const levels = {}
    courses.forEach((c) => {
      const lvl = c.level_display || c.level
      levels[lvl] = (levels[lvl] || 0) + 1
    })
    return Object.entries(levels).map(([name, count]) => ({ name, count }))
  })()

  // 5. Top payers (students with highest payment)
  const topPayers = (() => {
    const map = {}
    filteredPayments
      .filter(p => p.status === 'paid')
      .forEach((p) => {
        const key = p.student
        if (!map[key]) {
          map[key] = {
            name: p.student_name,
            email: p.student_email,
            total: 0,
            count: 0,
          }
        }
        map[key].total += parseFloat(p.amount || 0)
        map[key].count += 1
      })
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 5)
  })()

  // ============ EXPORT FUNCTIONS ============
  const handlePrint = () => {
    window.print()
  }

  const handleExportCSV = () => {
    const rows = [
      ['Ripoti ya ShulePro', new Date().toLocaleString('sw-TZ')],
      [],
      ['Kipimo', 'Thamani'],
      ['Jumla ya Watumiaji', filteredUsers.length],
      ['Wanafunzi', filteredUsers.filter(u => u.role === 'student').length],
      ['Walimu', filteredUsers.filter(u => u.role === 'teacher').length],
      ['Wasimamizi', filteredUsers.filter(u => u.role === 'admin').length],
      ['Kozi', courses.length],
      ['Mapato (TZS)', totalRevenue],
      ['Yanasubiri (TZS)', pendingRevenue],
      [],
      ['Malipo ya Hivi Karibuni'],
      ['Reference', 'Mwanafunzi', 'Kiasi', 'Hali', 'Tarehe'],
      ...filteredPayments.slice(0, 50).map((p) => [
        p.reference,
        p.student_name,
        p.amount,
        p.status,
        new Date(p.created_at).toLocaleDateString('sw-TZ'),
      ]),
    ]

    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ripoti-shulepro-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // ============ KPI CARDS ============
  const KPI = [
    {
      label: 'Watumiaji Wote',
      value: filteredUsers.length,
      icon: Users,
      color: 'bg-brand-50 text-brand-600',
      trend: '+12%',
      up: true,
    },
    {
      label: 'Wanafunzi',
      value: filteredUsers.filter(u => u.role === 'student').length,
      icon: GraduationCap,
      color: 'bg-emerald-50 text-emerald-600',
      trend: '+8%',
      up: true,
    },
    {
      label: 'Kozi',
      value: courses.length,
      icon: BookOpen,
      color: 'bg-sky-50 text-sky-600',
      trend: '+3%',
      up: true,
    },
    {
      label: 'Mapato',
      value: formatMoney(totalRevenue),
      icon: DollarSign,
      color: 'bg-amber-50 text-amber-600',
      trend: '+15%',
      up: true,
    },
  ]

  return (
    <div className="space-y-6">

      {/* ============ TOOLBAR ============ */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col md:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="all">Kipindi Chote</option>
            <option value="today">Leo</option>
            <option value="week">Wiki Hii</option>
            <option value="month">Mwezi Huu</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition"
          >
            <Printer className="w-4 h-4" />
            Chapisha
          </button>
        </div>
      </div>

      {/* ============ KPI CARDS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {KPI.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition">
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

      {/* ============ ROW 1: USER GROWTH + ROLE DISTRIBUTION ============ */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Monthly user growth */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Ukuaji wa Watumiaji</h3>
              <p className="text-gray-500 text-xs mt-1">
                Watumiaji wapya kwa mwezi ({period === 'all' ? 'miezi 6' : period})
              </p>
            </div>
            <LineIcon className="w-5 h-5 text-gray-300" />
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyChartData}>
                <defs>
                  <linearGradient id="colorUsersReport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3ecf8e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3ecf8e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px' }} />
                <Area type="monotone" dataKey="users" stroke="#3ecf8e" strokeWidth={3} fillOpacity={1} fill="url(#colorUsersReport)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Watumiaji kwa Role</h3>
              <p className="text-gray-500 text-xs mt-1">Mgawanyo</p>
            </div>
            <PieIcon className="w-5 h-5 text-gray-300" />
          </div>
          <div style={{ width: '100%', height: 200 }}>
            {roleData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={roleData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {roleData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">Hakuna data</div>
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

      {/* ============ ROW 2: PAYMENTS + COURSES ============ */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Payments */}
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
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {paymentStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payment summary */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-gray-100">
            <div>
              <div className="text-xs text-gray-500 mb-1">Zilizolipwa</div>
              <div className="font-bold text-gray-900 text-sm">{formatMoney(totalRevenue)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Zinasubiri</div>
              <div className="font-bold text-amber-600 text-sm">{formatMoney(pendingRevenue)}</div>
            </div>
          </div>
        </div>

        {/* Courses by level */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Kozi kwa Level</h3>
              <p className="text-gray-500 text-xs mt-1">Mgawanyo wa kozi</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-300" />
          </div>
          <div style={{ width: '100%', height: 260 }}>
            {coursesByLevel.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={coursesByLevel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px' }} />
                  <Bar dataKey="count" fill="#9f8cf2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">Hakuna kozi bado</div>
            )}
          </div>
        </div>
      </div>

      {/* ============ TOP PAYERS ============ */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-bold text-lg text-gray-900">Wanafunzi Wanaolipa Zaidi</h3>
            <p className="text-gray-500 text-xs mt-1">Top 5 kwa malipo</p>
          </div>
          <TrendingUp className="w-5 h-5 text-gray-300" />
        </div>

        {topPayers.length === 0 ? (
          <p className="text-gray-400 text-sm py-6 text-center">Hakuna malipo bado.</p>
        ) : (
          <div className="space-y-3">
            {topPayers.map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white ${
                  i === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                  i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                  i === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                  'bg-gradient-to-br from-brand-400 to-brand-600'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-900 truncate">{p.name}</div>
                  <div className="text-xs text-gray-500 truncate">{p.email}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-sm">{formatMoney(p.total)}</div>
                  <div className="text-xs text-gray-400">{p.count} malipo</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============ RECENT PAYMENTS TABLE ============ */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Malipo ya Hivi Karibuni</h3>
              <p className="text-gray-500 text-xs mt-1">Malipo 10 ya mwisho</p>
            </div>
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Hakuna malipo bado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Reference</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mwanafunzi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Kiasi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Hali</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Tarehe</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.slice(0, 10).map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{p.reference}</div>
                      <div className="text-xs text-gray-500">{p.method_display}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{p.student_name}</div>
                      <div className="text-xs text-gray-500">{p.student_email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{formatMoney(p.amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${
                        p.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                        p.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        p.status === 'failed' ? 'bg-red-50 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {p.status_display || p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">
                        {new Date(p.created_at).toLocaleDateString('sw-TZ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}