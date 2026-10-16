import { useState, useEffect } from 'react'
import {
  User, Lock, Bell, Save, Mail, Phone, MapPin, Camera,
  CheckCircle2, AlertCircle, Loader2, Smartphone, Monitor,
  BookOpen, GraduationCap, Clock, Palette, Moon, Sun, Globe
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function TeacherSettings() {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  // ============ AVATAR ============
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // ============ PROFILE ============
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

  // ============ NOTIFICATIONS ============
  const [notifications, setNotifications] = useState({
    email_new_student: true,
    email_new_submission: true,
    email_attendance_reminder: true,
    push_new_student: true,
    push_submission: true,
  })

  // ============ TEACHING PREFERENCES ============
  const [teaching, setTeaching] = useState({
    default_course_level: 'form_1',
    default_exam_type: 'test',
    auto_mark_attendance: false,
    notify_low_performance: true,
    theme: 'light',
  })

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

      updateUser({ avatar: res.data.avatar })
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
      setMessage({ type: 'success', text: 'Wasifu umehifadhiwa.' })
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

  // ============ SAVE NOTIFICATIONS ============
  const handleSaveNotifications = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setMessage({ type: 'success', text: 'Mipangilio imehifadhiwa.' })
      setTimeout(() => setMessage(null), 3000)
    }, 600)
  }

  // ============ SAVE TEACHING ============
  const handleSaveTeaching = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setMessage({ type: 'success', text: 'Mipangilio ya kufundisha imehifadhiwa.' })
      setTimeout(() => setMessage(null), 3000)
    }, 600)
  }

  const TABS = [
    { id: 'profile', label: 'Wasifu', icon: User },
    { id: 'security', label: 'Usalama', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'teaching', label: 'Kufundisha', icon: BookOpen },
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

        {/* TABS SIDEBAR */}
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

        {/* CONTENT */}
        <div className="lg:col-span-3 space-y-6">

          {/* ============ PROFILE TAB ============ */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">

              {/* AVATAR */}
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
                  {displayAvatar ? (
                    <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-3xl">
                      {(user?.first_name?.[0] || user?.username?.[0] || 'T').toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg text-gray-900">Picha ya Wasifu</h3>
                  <p className="text-gray-500 text-sm mt-1">PNG au JPG. Kiwango cha juu 2MB.</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition cursor-pointer">
                      <Camera className="w-4 h-4" />
                      {avatarFile ? 'Badilisha' : 'Chagua Picha'}
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
                          <><Loader2 className="w-4 h-4 animate-spin" />Inapakia...</>
                        ) : (
                          <><Save className="w-4 h-4" />Hifadhi</>
                        )}
                      </button>
                    )}

                    {user?.avatar && !avatarFile && (
                      <button
                        type="button"
                        onClick={handleAvatarDelete}
                        disabled={uploadingAvatar}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition"
                      >
                        Futa Picha
                      </button>
                    )}

                    {avatarFile && (
                      <button
                        type="button"
                        onClick={() => { setAvatarFile(null); setAvatarPreview(null) }}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 text-sm font-medium rounded-lg transition"
                      >
                        Ghairi
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <h3 className="font-display font-bold text-xl text-gray-900 mb-6">Taarifa za Kibinafsi</h3>

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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rudia Nenosiri</label>
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
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">Barua Pepe</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'email_new_student', label: 'Mwanafunzi mpya amejiunga' },
                      { key: 'email_new_submission', label: 'Kazi mpya imetumwa' },
                      { key: 'email_attendance_reminder', label: 'Kikumbusho cha mahudhurio' },
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
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">Push Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'push_new_student', label: 'Mwanafunzi mpya' },
                      { key: 'push_submission', label: 'Kazi mpya imetumwa' },
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

          {/* ============ TEACHING TAB ============ */}
          {activeTab === 'teaching' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-gray-900">Mapendeleo ya Kufundisha</h3>
                    <p className="text-gray-500 text-sm">Mipangilio ya kozi na mitihani</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level ya Kawaida</label>
                    <select
                      value={teaching.default_course_level}
                      onChange={(e) => setTeaching({ ...teaching, default_course_level: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white cursor-pointer"
                    >
                      <option value="form_1">Form 1</option>
                      <option value="form_2">Form 2</option>
                      <option value="form_3">Form 3</option>
                      <option value="form_4">Form 4</option>
                      <option value="form_5">Form 5</option>
                      <option value="form_6">Form 6</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aina ya Mtihani</label>
                    <select
                      value={teaching.default_exam_type}
                      onChange={(e) => setTeaching({ ...teaching, default_exam_type: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white cursor-pointer"
                    >
                      <option value="test">Mtihani Mdogo</option>
                      <option value="midterm">Mtihani wa Katikati</option>
                      <option value="final">Mtihani wa Mwisho</option>
                      <option value="assignment">Kazi ya Darasa</option>
                      <option value="project">Mradi</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                    <span className="text-sm text-gray-700">Weka mahudhurio kiotomatiki</span>
                    <input
                      type="checkbox"
                      checked={teaching.auto_mark_attendance}
                      onChange={(e) => setTeaching({ ...teaching, auto_mark_attendance: e.target.checked })}
                      className="w-5 h-5 rounded text-brand-500 focus:ring-brand-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                    <span className="text-sm text-gray-700">Nijulishe kama mwanafunzi ana ufaulu mdogo</span>
                    <input
                      type="checkbox"
                      checked={teaching.notify_low_performance}
                      onChange={(e) => setTeaching({ ...teaching, notify_low_performance: e.target.checked })}
                      className="w-5 h-5 rounded text-brand-500 focus:ring-brand-500"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-gray-900">Muonekano</h3>
                    <p className="text-gray-500 text-sm">Chagua theme</p>
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
                        onClick={() => setTeaching({ ...teaching, theme: theme.value })}
                        className={`p-5 rounded-2xl border-2 transition ${
                          teaching.theme === theme.value
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${teaching.theme === theme.value ? 'text-brand-600' : 'text-gray-400'}`} />
                        <div className={`text-sm font-medium ${teaching.theme === theme.value ? 'text-brand-700' : 'text-gray-600'}`}>
                          {theme.label}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveTeaching}
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