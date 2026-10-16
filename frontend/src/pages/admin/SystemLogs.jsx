import { useState, useEffect } from 'react'
import {
  Search, Loader2, Activity, LogIn, LogOut, Plus, Edit3,
  Trash2, Key, ToggleRight, User, Clock, MapPin, AlertCircle,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react'
import api from '../../api/axios'

export default function SystemLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')

  // ============ PAGINATION ============
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(20)  // Logs kwa ukurasa

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (actionFilter) params.append('action', actionFilter)
      params.append('page', currentPage)
      params.append('page_size', pageSize)

      const url = `/auth/admin/logs/?${params}`
      console.log('🔵 Fetching:', url)

      const res = await api.get(url)
      console.log('🟢 Response:', res.data)

      let data = []
      let count = 0

      if (Array.isArray(res.data)) {
        // API inarudisha array moja kwa moja (no pagination)
        data = res.data
        count = res.data.length
      } else if (res.data && Array.isArray(res.data.results)) {
        // API inarudisha { results: [...], count: N }
        data = res.data.results
        count = res.data.count || res.data.results.length
      } else if (res.data && Array.isArray(res.data.data)) {
        data = res.data.data
        count = res.data.total || res.data.data.length
      }

      console.log('🟡 Logs zilizochukuliwa:', data.length, 'Jumla:', count)
      setLogs(data)
      setTotalCount(count)
    } catch (err) {
      console.error('🔴 Error:', err)
      setError(err.response?.data?.detail || err.message || 'Kuna kosa')
    } finally {
      setLoading(false)
    }
  }

  // Reset page kama filter inabadilika
  useEffect(() => {
    setCurrentPage(1)
  }, [search, actionFilter, pageSize])

  useEffect(() => {
    const timeout = setTimeout(fetchLogs, 300)
    return () => clearTimeout(timeout)
  }, [search, actionFilter, currentPage, pageSize])

  const ACTION_META = {
    login: { icon: LogIn, label: 'Login', color: 'bg-emerald-50 text-emerald-600' },
    logout: { icon: LogOut, label: 'Logout', color: 'bg-gray-100 text-gray-600' },
    create: { icon: Plus, label: 'Create', color: 'bg-sky-50 text-sky-600' },
    update: { icon: Edit3, label: 'Update', color: 'bg-amber-50 text-amber-600' },
    delete: { icon: Trash2, label: 'Delete', color: 'bg-red-50 text-red-600' },
    password_reset: { icon: Key, label: 'Password Reset', color: 'bg-violet-50 text-violet-600' },
    toggle_active: { icon: ToggleRight, label: 'Toggle Active', color: 'bg-indigo-50 text-indigo-600' },
  }

  const formatTime = (iso) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = Math.floor((now - d) / 1000)

    if (diff < 60) return 'Sasa hivi'
    if (diff < 3600) return `${Math.floor(diff / 60)} min zilizopita`
    if (diff < 86400) return `${Math.floor(diff / 3600)} saa zilizopita`
    if (diff < 604800) return `${Math.floor(diff / 86400)} siku zilizopita`

    return d.toLocaleDateString('sw-TZ', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const today = new Date().toDateString()
  const todayLogs = logs.filter((l) => new Date(l.created_at).toDateString() === today).length

  // ============ PAGINATION CALCULATIONS ============
  const totalPages = Math.ceil(totalCount / pageSize) || 1
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Tengeneza orodha ya kurasa za kuonyesha
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
  }

  return (
    <div className="space-y-6">

      {/* ============ STATS ============ */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Activity className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">{totalCount}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Shughuli Zote</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">{todayLogs}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Leo</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <LogIn className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">
                {logs.filter((l) => l.action === 'login').length}
              </div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Login</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ ERROR ============ */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-red-700 mb-1">Kuna kosa:</div>
            <div className="text-sm text-red-600">{error}</div>
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
            placeholder="Tafuta kwa mtumiaji, maelezo..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="">Aina zote</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="password_reset">Password Reset</option>
          <option value="toggle_active">Toggle Active</option>
        </select>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(parseInt(e.target.value))}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value={10}>10 / ukurasa</option>
          <option value={20}>20 / ukurasa</option>
          <option value={50}>50 / ukurasa</option>
          <option value={100}>100 / ukurasa</option>
        </select>
      </div>

      {/* ============ LOGS LIST ============ */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Hakuna shughuli zilizopatikana.</p>
            <p className="text-gray-400 text-sm mt-1">
              {search || actionFilter ? 'Badilisha vigezo vya utafutaji.' : 'Shughuli zitaonekana hapa.'}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {logs.map((log) => {
                const meta = ACTION_META[log.action] || ACTION_META.update
                const Icon = meta.icon
                return (
                  <div key={log.id} className="flex items-start gap-4 p-5 hover:bg-gray-50 transition">
                    <div className={`w-10 h-10 rounded-xl ${meta.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${meta.color}`}>
                          {meta.label}
                        </span>
                        {log.user_name && (
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            <strong className="text-gray-900">{log.user_name}</strong>
                            {log.user_role && (
                              <span className="text-gray-400 capitalize">({log.user_role})</span>
                            )}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 mb-1.5">{log.description || '—'}</p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(log.created_at)}
                        </span>
                        {log.ip_address && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {log.ip_address}
                          </span>
                        )}
                        {log.target_model && (
                          <span className="px-1.5 py-0.5 bg-gray-100 rounded">
                            {log.target_model} #{log.target_id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ============ PAGINATION ============ */}
            {totalCount > 0 && (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 border-t border-gray-100 bg-gray-50">
                {/* Info */}
                <div className="text-sm text-gray-600">
                  Inaonyesha <strong className="text-gray-900">{startItem}</strong> -{' '}
                  <strong className="text-gray-900">{endItem}</strong> kati ya{' '}
                  <strong className="text-gray-900">{totalCount}</strong> logs
                </div>

                {/* Page buttons */}
                <div className="flex items-center gap-1">
                  {/* First */}
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-white text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="Ukurasa wa kwanza"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  {/* Prev */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-white text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="Ukurasa uliopita"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Pages */}
                  {getPageNumbers().map((page, idx) => (
                    <div key={idx}>
                      {page === '...' ? (
                        <span className="px-3 py-2 text-gray-400">...</span>
                      ) : (
                        <button
                          onClick={() => goToPage(page)}
                          className={`min-w-[38px] px-3 py-2 rounded-lg text-sm font-medium transition ${
                            currentPage === page
                              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                              : 'border border-gray-200 hover:bg-white text-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Next */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-white text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="Ukurasa unaofuata"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Last */}
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-white text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="Ukurasa wa mwisho"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}