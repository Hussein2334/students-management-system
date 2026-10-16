import { useState, useEffect } from 'react'
import {
  Search, Loader2, CreditCard, DollarSign, Clock, CheckCircle2,
  XCircle, TrendingUp, Calendar
} from 'lucide-react'
import api from '../../api/axios'

export default function StudentPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true)
      try {
        const res = await api.get('/auth/student/payments/')
        let data = res.data.results || res.data || []
        if (statusFilter) data = data.filter(p => p.status === statusFilter)
        if (search) data = data.filter(p =>
          (p.reference || '').toLowerCase().includes(search.toLowerCase()) ||
          (p.description || '').toLowerCase().includes(search.toLowerCase())
        )
        setPayments(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    const timeout = setTimeout(fetchPayments, 300)
    return () => clearTimeout(timeout)
  }, [search, statusFilter])

  const formatMoney = (amount) =>
    new Intl.NumberFormat('sw-TZ', {
      style: 'currency', currency: 'TZS',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount)

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('sw-TZ', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  // Stats
  const total = payments.length
  const paid = payments.filter(p => p.status === 'paid')
  const pending = payments.filter(p => p.status === 'pending')
  const totalPaid = paid.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
  const totalPending = pending.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  const STATUS_META = {
    paid: { color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2, label: 'PAID' },
    pending: { color: 'bg-amber-50 text-amber-600', icon: Clock, label: 'PENDING' },
    failed: { color: 'bg-red-50 text-red-600', icon: XCircle, label: 'FAILED' },
    refunded: { color: 'bg-gray-100 text-gray-600', icon: XCircle, label: 'REFUNDED' },
  }

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">{total}</div>
              <div className="text-gray-500 text-xs uppercase">Malipo Yote</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-lg text-gray-900 truncate">{formatMoney(totalPaid)}</div>
              <div className="text-gray-500 text-xs uppercase">Yaliyolipwa</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-lg text-gray-900 truncate">{formatMoney(totalPending)}</div>
              <div className="text-gray-500 text-xs uppercase">Yanasubiri</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">{paid.length}</div>
              <div className="text-gray-500 text-xs uppercase">Zilizolipwa</div>
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
            placeholder="Tafuta kwa reference..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="">Hali zote</option>
          <option value="paid">Zilizolipwa</option>
          <option value="pending">Zinasubiri</option>
          <option value="failed">Zilizoshindwa</option>
          <option value="refunded">Zilizorudishwa</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <div className="p-16 text-center">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Hakuna malipo yaliyopatikana.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Reference</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Kiasi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Njia</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Hali</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase hidden lg:table-cell">Tarehe</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const meta = STATUS_META[p.status] || STATUS_META.pending
                  const StatusIcon = meta.icon
                  return (
                    <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{p.reference}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{p.description || '—'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">{formatMoney(p.amount)}</span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-600">{p.method_display}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${meta.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-sm text-gray-600">{formatDate(p.created_at)}</span>
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