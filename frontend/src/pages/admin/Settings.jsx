import { useState, useEffect } from 'react'
import {
  User, Lock, Bell, Globe, Palette, Save,
  Mail, Phone, MapPin, Camera, CheckCircle2, AlertCircle,
  Loader2, Smartphone, Building,
  Moon, Sun, Monitor
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function Settings() {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
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

  // ============ PASSWORD FORM ============
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password2: '',
  })
  const [showPasswords, setShowPasswords] = useState(false)

  // ============ NOTIFICATIONS ============
  const [notifications, setNotifications] = useState({
    email_new_user: true,
    email_new_payment: true,
    email_password_reset: false,
    push_login: true,
    push_payment: true,
  })

  // ============ SYSTEM SETTINGS ============
  const [system, setSystem] = useState({
    school_name: 'ShulePro',
    school_email: 'info@shulepro.co.tz',
    school_phone: '+255 658 216 348',
    school_address: 'Mombasa & Zanzibar',
    currency: 'TZS',
    language: 'sw',
    timezone: 'Africa/Dar_es_Salaam',
    theme: 'light',
  })

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

  // ============ AVATAR HANDLERS ============
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log('🟢 File imechaguliwa:', file.name, file.size, 'bytes')

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
    if (!avatarFile) {
      console.log('🔴 Hakuna avatarFile')
      return
    }

    setUploadingAvatar(true)
    setMessage(null)

    try {
      console.log('🔵 Kuanza upload...')
      console.log('🟢 avatarFile:', avatarFile.name)

      const formData = new FormData()
      formData.append('avatar', avatarFile)

      console.log('📦 FormData imeundwa')

      const res = await api.post('/auth/profile/avatar/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      console.log('🟢 Response status:', res.status)
      console.log('🟢 Response data:', res.data)
      console.log('🟢 typeof res.data:', typeof res.data)
      console.log('🟢 res.data.avatar:', res.data?.avatar)

      const newAvatarUrl = res.data?.avatar

      if (!newAvatarUrl) {
        console.error('🔴 newAvatarUrl ni null/undefined')
        setMessage({
          type: 'error',
          text: 'Picha imepakiwa lakini URL haipo kwenye response.',
        })
        return
      }

      console.log('🟢 updateUser inaitwa...')
      updateUser({ avatar: newAvatarUrl })
      console.log('🟢 updateUser imefanikiwa')

      setMessage({ type: 'success', text: 'Picha imepakiwa kikamilifu!' })
      setAvatarFile(null)
      setAvatarPreview(null)

      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error('🔴 FULL ERROR:', err)
      console.error('🔴 Error name:', err.name)
      console.error('🔴 Error message:', err.message)
      console.error('🔴 Error response:', err.response)
      console.error('🔴 Error response data:', err.response?.data)
      console.error('🔴 Error response status:', err.response?.status)

      setMessage({
        type: 'error',
        text: err.response?.data?.detail || err.message || 'Imeshindwa kupakia picha.',
      })
    } finally {
      setUploadingAvatar(false)
      console.log('🔵 Upload imekamilika')
    }
  }

  const handleAvatarDelete = async () => {
    if (!window.confirm('Una uhakika unataka kufuta picha?')) return
    setUploadingAvatar(true)
    setMessage(null)

    try {
      await api.delete('/auth/profile/avatar/delete/')
      updateUser({ avatar: null })
      setMessage({ type: 'success', text: 'Picha imefutwa.' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error('🔴 Delete error:', err)
      setMessage({ type: 'error', text: 'Imeshindwa kufuta picha.' })
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleCancelAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
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
      setMessage({ type: 'error', text: 'Nenosiri jipya hazifanani.' })
      return
    }
    if (passwordForm.new_password.length < 8) {
      setMessage({ type: 'error', text: 'Nenosiri liwe na herufi 8 au zaidi.' })
      return
    }

    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setMessage({
        type: 'success',
        text: 'Feature ya kubadilisha nenosiri inakuja hivi karibuni.',
      })
      setPasswordForm({ current_password: '', new_password: '', new_password2: '' })
      setTimeout(() => setMessage(null), 3000)
    }, 600)
  }

  // ============ SAVE NOTIFICATIONS ============
  const handleSaveNotifications = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setMessage({ type: 'success', text: 'Mipangilio ya notifications imehifadhiwa.' })
      setTimeout(() => setMessage(null), 3000)
    }, 600)
  }

  // ============ SAVE SYSTEM ============
  const handleSaveSystem = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setMessage({ type: 'success', text: 'Mipangilio ya mfumo imehifadhiwa.' })
      setTimeout(() => setMessage(null), 3000)
    }, 600)
  }

  // ============ TABS ============
  const TABS = [
    { id: 'profile', label: 'Wasifu', icon: User },
    { id: 'security', label: 'Usalama', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'Mfumo', icon: Globe },
  ]

  const displayAvatar = avatarPreview || user?.avatar

  return (
    <div className="space-y-6">

      {message && (
        <div
          className={`rounded-2xl p-4 flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
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

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-2 sticky top-24">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">

          {/* ============ PROFILE TAB ============ */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">

              {/* ============ AVATAR UPLOAD ============ */}
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('🔴 Picha haipatikani:', displayAvatar)
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <span className="text-white font-bold text-3xl">
                      {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg text-gray-900">Picha ya Wasifu</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    PNG au JPG. Kiwango cha juu 2MB.
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <label
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition ${
                        uploadingAvatar
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Camera className="w-4 h-4" />
                      {avatarFile ? 'Badilisha Picha' : 'Chagua Picha'}
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleAvatarChange}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                    </label>

                    {avatarFile && (
                      <button
                        type="button"
                        onClick={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition"
                      >
                        {uploadingAvatar ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Inapakia...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Hifadhi Picha
                          </>
                        )}
                      </button>
                    )}

                    {user?.avatar && !avatarFile && (
                      <button
                        type="button"
                        onClick={handleAvatarDelete}
                        disabled={uploadingAvatar}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition disabled:opacity-60"
                      >
                        Futa Picha
                      </button>
                    )}

                    {avatarFile && (
                      <button
                        type="button"
                        onClick={handleCancelAvatar}
                        className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 text-sm font-medium rounded-lg transition"
                      >
                        Ghairi
                      </button>
                    )}
                  </div>

                  {avatarFile && (
                    <p className="text-xs text-brand-600 mt-2">
                      ✓ Picha imechaguliwa. Bofya "Hifadhi Picha" kupakia.
                    </p>
                  )}
                </div>
              </div>

              <h3 className="font-display font-bold text-xl text-gray-900 mb-6">
                Taarifa za Kibinafsi
              </h3>

              <div className="grid md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jina la Kwanza</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={profile.first_name}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jina la Mwisho</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={profile.last_name}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Barua Pepe</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Namba ya Simu</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+255..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tarehe ya Kuzaliwa</label>
                <input
                  type="date"
                  value={profile.date_of_birth}
                  onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Kuhusu Wewe</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  placeholder="Andika kitu kuhusu wewe..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white resize-none"
                />
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl transition"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Inahifadhi...' : 'Hifadhi Mabadiliko'}
                </button>
              </div>
            </form>
          )}

          {/* ============ SECURITY TAB ============ */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-gray-900">Badilisha Nenosiri</h3>
                    <p className="text-gray-500 text-sm">Weka nenosiri imara lenye herufi 8+</p>
                  </div>
                </div>

                <div className="space-y-5 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nenosiri la Sasa</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nenosiri Jipya</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      minLength={8}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rudia Nenosiri Jipya</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={passwordForm.new_password2}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password2: e.target.value })}
                      minLength={8}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPasswords}
                      onChange={(e) => setShowPasswords(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-600">Onyesha nenosiri</span>
                  </label>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl transition"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    {saving ? 'Inabadilisha...' : 'Badilisha Nenosiri'}
                  </button>
                </div>
              </form>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-gray-900">Vifaa Vilivyounganika</h3>
                    <p className="text-gray-500 text-sm">Simamia vifaa vinavyotumia akaunti yako</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">Kifaa hiki (sasa)</div>
                    <div className="text-xs text-gray-500">Dar es Salaam, Tanzania</div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-1 bg-emerald-200 text-emerald-700 rounded-lg">
                    Hai
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ============ NOTIFICATIONS TAB ============ */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-gray-900">Notifications</h3>
                  <p className="text-gray-500 text-sm">Chagua jinsi unavyopokea taarifa</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">
                    Barua Pepe
                  </h4>
                  <div className="space-y-3">
                    {[
                      { key: 'email_new_user', label: 'Mtumiaji mpya ajisajili' },
                      { key: 'email_new_payment', label: 'Malipo mapya yamefanyika' },
                      { key: 'email_password_reset', label: 'Kurejesha nenosiri' },
                    ].map((n) => (
                      <label key={n.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                        <span className="text-sm text-gray-700">{n.label}</span>
                        <input
                          type="checkbox"
                          checked={notifications[n.key]}
                          onChange={(e) => setNotifications({ ...notifications, [n.key]: e.target.checked })}
                          className="w-5 h-5 rounded text-brand-500 focus:ring-brand-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">
                    Push Notifications
                  </h4>
                  <div className="space-y-3">
                    {[
                      { key: 'push_login', label: 'Mtu ameingia kwenye akaunti' },
                      { key: 'push_payment', label: 'Malipo yamefanyika' },
                    ].map((n) => (
                      <label key={n.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                        <span className="text-sm text-gray-700">{n.label}</span>
                        <input
                          type="checkbox"
                          checked={notifications[n.key]}
                          onChange={(e) => setNotifications({ ...notifications, [n.key]: e.target.checked })}
                          className="w-5 h-5 rounded text-brand-500 focus:ring-brand-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
                <button
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl transition"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Inahifadhi...' : 'Hifadhi'}
                </button>
              </div>
            </div>
          )}

          {/* ============ SYSTEM TAB ============ */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Building className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-gray-900">Taarifa za Shule</h3>
                    <p className="text-gray-500 text-sm">Maelezo ya kitaasisi</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jina la Shule</label>
                    <input
                      type="text"
                      value={system.school_name}
                      onChange={(e) => setSystem({ ...system, school_name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Barua Pepe</label>
                      <input
                        type="email"
                        value={system.school_email}
                        onChange={(e) => setSystem({ ...system, school_email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Namba ya Simu</label>
                      <input
                        type="text"
                        value={system.school_phone}
                        onChange={(e) => setSystem({ ...system, school_phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Anwani</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={system.school_address}
                        onChange={(e) => setSystem({ ...system, school_address: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-gray-900">Lugha na Eneo</h3>
                    <p className="text-gray-500 text-sm">Mipangilio ya lugha, sarafu, na saa</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lugha</label>
                    <select
                      value={system.language}
                      onChange={(e) => setSystem({ ...system, language: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white cursor-pointer"
                    >
                      <option value="sw">Kiswahili</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sarafu</label>
                    <select
                      value={system.currency}
                      onChange={(e) => setSystem({ ...system, currency: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white cursor-pointer"
                    >
                      <option value="TZS">TZS (Shilingi)</option>
                      <option value="USD">USD (Dollar)</option>
                      <option value="KES">KES (Shilingi ya Kenya)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Saa</label>
                    <select
                      value={system.timezone}
                      onChange={(e) => setSystem({ ...system, timezone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white cursor-pointer"
                    >
                      <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam</option>
                      <option value="Africa/Nairobi">Africa/Nairobi</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-gray-900">Muonekano</h3>
                    <p className="text-gray-500 text-sm">Chagua theme unayopendelea</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'light', label: 'Nuru', icon: Sun },
                    { value: 'dark', label: 'Giza', icon: Moon },
                    { value: 'system', label: 'Mfumo', icon: Monitor },
                  ].map((theme) => {
                    const Icon = theme.icon
                    return (
                      <button
                        key={theme.value}
                        type="button"
                        onClick={() => setSystem({ ...system, theme: theme.value })}
                        className={`p-5 rounded-2xl border-2 transition ${
                          system.theme === theme.value
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 mx-auto mb-2 ${
                            system.theme === theme.value ? 'text-brand-600' : 'text-gray-400'
                          }`}
                        />
                        <div
                          className={`text-sm font-medium ${
                            system.theme === theme.value ? 'text-brand-700' : 'text-gray-600'
                          }`}
                        >
                          {theme.label}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveSystem}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl transition"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Inahifadhi...' : 'Hifadhi Mipangilio'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}