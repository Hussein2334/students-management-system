import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User, Mail, Phone, Calendar, Camera, Save,
  Loader2, CheckCircle2, AlertCircle, ArrowLeft,
  ShieldCheck, GraduationCap, BookOpen, Lock, LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api, { API_BASE } from '../api/axios'

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('info')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  // ============ AVATAR ============
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // ============ PROFILE FORM ============
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    date_of_birth: '',
  })

  // ============ PASSWORD ============
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password2: '',
  })
  const [showPasswords, setShowPasswords] = useState(false)

  // Load user data
  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        date_of_birth: user.date_of_birth || '',
      })
    }
  }, [user])

  // Kama haujaingia, elekeza login
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // ============ AVATAR ============
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Picha ni kubwa sana. Kiwango cha juu ni 2MB.' })
      return
    }

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setMessage({ type: 'error', text: 'Tumia picha ya JPG, PNG, au WebP.' })
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setMessage(null)
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return
    setUploadingAvatar(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('avatar', avatarFile)

      const res = await api.post('/auth/profile/avatar/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      // 🆕 Hakikisha URL ni kamili
      let avatarUrl = res.data.avatar
      if (avatarUrl && avatarUrl.startsWith('/')) {
        avatarUrl = `${API_BASE}${avatarUrl}`
      }

      updateUser({ avatar: avatarUrl })
      setMessage({ type: 'success', text: 'Picha imepakiwa kikamilifu!' })
      setAvatarFile(null)
      setAvatarPreview(null)
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Imeshindwa kupakia picha.',
      })
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleAvatarDelete = async () => {
    if (!window.confirm('Una uhakika unataka kufuta picha?')) return
    setUploadingAvatar(true)
    try {
      await api.delete('/auth/profile/avatar/delete/')
      updateUser({ avatar: null })
      setMessage({ type: 'success', text: 'Picha imefutwa.' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: 'Imeshindwa kufuta picha.' })
    } finally {
      setUploadingAvatar(false)
    }
  }

  // ============ SAVE PROFILE ============
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const res = await api.patch('/auth/profile/', profile)
      updateUser(res.data)
      setMessage({ type: 'success', text: 'Wasifu umehifadhiwa kikamilifu.' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Kuna kosa. Jaribu tena.',
      })
    } finally {
      setSaving(false)
    }
  }

  // ============ CHANGE PASSWORD ============
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (passwordForm.new_password !== passwordForm.new_password2) {
      setMessage({ type: 'error', text: 'Nenosiri hazifanani.' })
      return
    }
    if (passwordForm.new_password.length < 8) {
      setMessage({ type: 'error', text: 'Nenosiri liwe na herufi 8 au zaidi.' })
      return
    }

    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setMessage({ type: 'success', text: 'Feature hii inakuja hivi karibuni.' })
      setPasswordForm({ current_password: '', new_password: '', new_password2: '' })
      setTimeout(() => setMessage(null), 3000)
    }, 600)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Role icon
  const roleIcon = {
    admin: ShieldCheck,
    teacher: BookOpen,
    student: GraduationCap,
  }[user?.role] || User

  const RoleIcon = roleIcon

  // 🆕 Tumia API_BASE kwa avatar kama ni URL ya jamaa
  let displayAvatar = avatarPreview || user?.avatar
  if (displayAvatar && displayAvatar.startsWith('/')) {
    displayAvatar = `${API_BASE}${displayAvatar}`
  }

  const initials = (user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()

  const ROLE_LABEL = {
    admin: 'Msimamizi',
    teacher: 'Mwalimu',
    student: 'Mwanafunzi',
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-ink-950 text-white">

      {/* ============ HEADER ============ */}
      <section className="relative pt-16 pb-24 border-b border-white/5">
        <div className="absolute inset-0 grid-pattern opacity-40"></div>
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-brand-400/10 rounded-full blur-[140px]"></div>

        <div className="relative max-w-5xl mx-auto px-5 lg:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Rudi Nyumbani
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center overflow-hidden shadow-2xl border-4 border-ink-950 ring-4 ring-brand-400/20">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <span className="text-white font-bold text-5xl">{initials}</span>
                )}
              </div>

              {/* Camera button */}
              <label className="absolute bottom-2 right-2 w-10 h-10 rounded-xl bg-brand-500 hover:bg-brand-400 flex items-center justify-center cursor-pointer transition shadow-lg">
                <Camera className="w-5 h-5 text-ink-950" />
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
              </label>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-400/10 border border-brand-400/30 rounded-full text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
                <RoleIcon className="w-3.5 h-3.5" />
                {ROLE_LABEL[user.role] || 'Mtumiaji'}
              </div>
              <h1 className="font-display font-extrabold text-3xl md:text-5xl mb-2">
                {user.full_name || user.username}
              </h1>
              <p className="text-white/60 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-sm font-semibold rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
              Toka
            </button>
          </div>

          {/* Avatar actions */}
          {(avatarFile || user?.avatar) && (
            <div className="mt-6 flex flex-wrap gap-2">
              {avatarFile && (
                <button
                  onClick={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-ink-950 text-sm font-semibold rounded-lg transition"
                >
                  {uploadingAvatar ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Inapakia...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Hifadhi Picha Mpya
                    </>
                  )}
                </button>
              )}
              {avatarFile && (
                <button
                  onClick={() => { setAvatarFile(null); setAvatarPreview(null) }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 hover:bg-white/5 text-white text-sm font-medium rounded-lg transition"
                >
                  Ghairi
                </button>
              )}
              {user?.avatar && !avatarFile && (
                <button
                  onClick={handleAvatarDelete}
                  disabled={uploadingAvatar}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition disabled:opacity-60"
                >
                  Futa Picha
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============ CONTENT ============ */}
      <section className="relative max-w-5xl mx-auto px-5 lg:px-10 -mt-12 pb-16">
        <div className="relative">

          {/* Message */}
          {message && (
            <div
              className={`mb-4 rounded-2xl p-4 flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
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

          <div className="grid lg:grid-cols-4 gap-6">

            {/* Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-ink-900 rounded-2xl border border-white/10 p-2">
                {[
                  { id: 'info', label: 'Taarifa', icon: User },
                  { id: 'security', label: 'Usalama', icon: Lock },
                ].map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? 'bg-brand-500 text-ink-950 shadow-lg shadow-brand-500/20'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={2} />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">

              {/* ============ INFO TAB ============ */}
              {activeTab === 'info' && (
                <form
                  onSubmit={handleSaveProfile}
                  className="bg-ink-900 rounded-2xl border border-white/10 p-6 md:p-8"
                >
                  <h2 className="font-display font-bold text-xl mb-6">Taarifa za Kibinafsi</h2>

                  <div className="grid md:grid-cols-2 gap-5 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Jina la Kwanza
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="text"
                          value={profile.first_name}
                          onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-400/50 focus:bg-white/10 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Jina la Mwisho
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="text"
                          value={profile.last_name}
                          onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-400/50 focus:bg-white/10 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Barua Pepe
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-400/50 focus:bg-white/10 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Namba ya Simu
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="text"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          placeholder="+255..."
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-400/50 focus:bg-white/10 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Tarehe ya Kuzaliwa
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="date"
                        value={profile.date_of_birth}
                        onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-400/50 focus:bg-white/10 transition"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Kuhusu Wewe
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={4}
                      placeholder="Andika kitu kuhusu wewe..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-400/50 focus:bg-white/10 transition resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-6 border-t border-white/5">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-ink-950 font-semibold rounded-xl transition"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Inahifadhi...' : 'Hifadhi Mabadiliko'}
                    </button>
                  </div>
                </form>
              )}

              {/* ============ SECURITY TAB ============ */}
              {activeTab === 'security' && (
                <form
                  onSubmit={handleChangePassword}
                  className="bg-ink-900 rounded-2xl border border-white/10 p-6 md:p-8"
                >
                  <h2 className="font-display font-bold text-xl mb-6">Badilisha Nenosiri</h2>

                  <div className="space-y-5 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Nenosiri la Sasa
                      </label>
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-400/50 focus:bg-white/10 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Nenosiri Jipya
                      </label>
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                        minLength={8}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-400/50 focus:bg-white/10 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Rudia Nenosiri Jipya
                      </label>
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={passwordForm.new_password2}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new_password2: e.target.value })}
                        minLength={8}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-400/50 focus:bg-white/10 transition"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showPasswords}
                        onChange={(e) => setShowPasswords(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-white/70">Onyesha nenosiri</span>
                    </label>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-white/5">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-ink-950 font-semibold rounded-xl transition"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      {saving ? 'Inabadilisha...' : 'Badilisha Nenosiri'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}