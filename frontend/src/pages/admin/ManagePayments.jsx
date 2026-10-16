import { useState, useEffect } from 'react'
import {
  Search, Plus, Edit, Trash2, X, Loader2,
  CreditCard, DollarSign, Clock, CheckCircle2, XCircle,
  Smartphone, Building, Filter
} from 'lucide-react'
import api from '../../api/axios'

export default function ManagePayments() {
  const [payments, setPayments] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingPayment, setEditingPayment] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const [form, setForm] = useState({
    student: '',
    amount: '',
    method: 'mpesa',
    status: 'pending',
    description: '',
  })

  const METHODS = [
    { value: 'cash', label: 'Cash' },
    { value: 'mpesa', label: 'M-Pesa' },
    { value: 'tigo_pesa', label: 'Tigo Pesa' },
    { value: 'airtel_money', label: 'Airtel Money' },
    { value: 'halopesa', label: 'HaloPesa' },
    { value: 'bank', label: 'Bank Transfer' },
  ]

  const STATUSES = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ]

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      const res = await api.get(`/admin/payments/?${params}`)
      let data = res.data.results || res.data
      if (statusFilter) data = data.filter(p => p.status === statusFilter)
      setPayments(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const res = await api.get('/auth/admin/users/?role=student')
      setStudents(res.data.results || res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(fetchPayments, 300)
    return () => clearTimeout(timeout)
  }, [search, statusFilter])

  useEffect(() => {
    fetchStudents()
  }, [])

  const openCreate = () => {
    setEditingPayment(null)
    setForm({
      student: '', amount: '', method: 'mpesa', status: 'pending', description: '',
    })
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEditingPayment(p)
    setForm({
      student: p.student,
      amount: p.amount,
      method: p.method,
      status: p.status,
      description: p.description || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPayment) {
        await api.patch(`/admin/payments/${editingPayment.id}/`, form)
      } else {
        await api.post('/admin/payments/', form)
      }
      setShowModal(false)
      fetchPayments()
    } catch (err) {
      console.error(err)
      alert('Kuna kosa: ' + JSON.stringify(err.response?.data || err.message))
    }
  }

  const handleDelete = async (id) => {
    setActionLoading(id)
    try {
      await api.delete(`/admin/payments/${id}/`)
      setDeleteConfirm(null)
      fetchPayments()
    } catch (err) {
      alert(err.response?.data?.detail || 'Imeshindwa kufuta.')
    } finally {
      setActionLoading(null)
    }
  }

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency', currency: 'TZS', minimumFractionDigits: 0,
    }).format(amount)
  }

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
  const totalRevenue = paid.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
  const pendingAmount = pending.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  const STATUS_META = {
    pending: { color: 'bg-amber-50 text-amber-600', icon: Clock, label: 'PENDING' },
    paid: { color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2, label: 'PAID' },
    failed: { color: 'bg-red-50 text-red-600', icon: XCircle, label: 'FAILED' },
    refunded: { color: 'bg-gray-100 text-gray-600', icon: XCircle, label: 'REFUNDED' },
  }

  const METHOD_ICON = {
    cash: DollarSign,
    mpesa: Smartphone,
    tigo_pesa: Smartphone,
    airtel_money: Smartphone,
    halopesa: Smartphone,
    bank: Building,
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
              <div className="text-gray-500 text-xs uppercase tracking-wider">Malipo Yote</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-xl text-gray-900">{formatMoney(totalRevenue)}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Zilizolipwa</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-xl text-gray-900">{formatMoney(pendingAmount)}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Zinasubiri</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl text-gray-900">{paid.length}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Zilizolipwa</div>
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
            placeholder="Tafuta kwa reference, mwanafunzi..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
          />
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 cursor-pointer">
          <option value="">Hali zote</option>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <button onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition shadow-sm">
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Ongeza Malipo
        </button>
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
            <p className="text-gray-400 text-sm mt-1">Bofya "Ongeza Malipo" kuanza.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Reference</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mwanafunzi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Kiasi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Njia</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Hali</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase hidden lg:table-cell">Tarehe</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase">Vitendo</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const meta = STATUS_META[p.status] || STATUS_META.pending
                  const StatusIcon = meta.icon
                  const MethodIcon = METHOD_ICON[p.method] || CreditCard
                  return (
                    <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
                            <MethodIcon className="w-5 h-5 text-white" strokeWidth={2} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{p.reference}</div>
                            <div className="text-xs text-gray-500">{p.method_display}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{p.student_name}</div>
                        <div className="text-xs text-gray-500">{p.student_email}</div>
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
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirm(p)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-brand-600" />
                </div>
                <h2 className="font-display font-bold text-xl text-gray-900">
                  {editingPayment ? 'Hariri Malipo' : 'Ongeza Malipo'}
                </h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mwanafunzi *</label>
                <select value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white">
                  <option value="">— Chagua mwanafunzi —</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.full_name || s.username} ({s.email})</option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kiasi (TZS) *</label>
                  <input type="number" step="0.01" value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })} required
                    placeholder="50000"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Njia ya Malipo *</label>
                  <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white">
                    {METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hali *</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white">
                  {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maelezo</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white resize-none" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                  Ghairi
                </button>
                <button type="submit"
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition">
                  {editingPayment ? 'Hifadhi' : 'Ongeza'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900 text-center mb-2">Futa Malipo?</h3>
            <p className="text-gray-600 text-sm text-center mb-6">
              Una uhakika unataka kufuta <strong className="text-gray-900">{deleteConfirm.reference}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50">
                Ghairi
              </button>
              <button onClick={() => handleDelete(deleteConfirm.id)} disabled={actionLoading === deleteConfirm.id}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition disabled:opacity-60">
                {actionLoading === deleteConfirm.id ? 'Inafuta...' : 'Futa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}