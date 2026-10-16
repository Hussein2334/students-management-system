import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Grid3x3, Menu, X, LayoutDashboard, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Zuia scroll ya body wakati mobile menu imefunguliwa
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Funga mobile menu kama ukubwa wa screen unakuwa mkubwa
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  const dashboardPath =
    user?.role === 'admin'
      ? '/admin/dashboard'
      : user?.role === 'teacher'
      ? '/teacher/dashboard'
      : '/student/dashboard'

  const profilePath = '/profile'

  return (
    <>
      {/* ============ NAVBAR (fixed at top) ============ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-ink-950/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="flex items-center justify-between h-[72px]">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-400/20 group-hover:scale-105 transition">
                <span className="text-ink-950 font-extrabold text-xl font-display">
                  S
                </span>
              </div>
              <div className="leading-none">
                <div className="text-white font-extrabold text-lg font-display tracking-tight">
                  SHULEPRO
                </div>
                <div className="text-white/50 text-[10px] tracking-[0.18em] uppercase mt-1">
                  Digital Campus
                </div>
              </div>
            </Link>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm text-white/60">
                    Karibu,{' '}
                    <strong className="text-brand-400">
                      {user.first_name || user.username}
                    </strong>
                  </span>
                  <Link
                    to={dashboardPath}
                    className="px-5 py-2.5 text-sm font-medium text-white border border-white/10 rounded-lg hover:bg-white/5 transition"
                  >
                    DASHBOARD
                  </Link>
                  <Link
                    to={profilePath}
                    className="w-10 h-10 rounded-lg border border-white/10 hover:bg-white/5 transition flex items-center justify-center overflow-hidden"
                    title="Wasifu Wangu"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white/70" />
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2.5 text-sm font-semibold bg-brand-400 text-ink-950 rounded-lg hover:bg-brand-300 transition"
                  >
                    TOKA
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-sm font-medium tracking-wide text-white border border-white/10 rounded-lg hover:bg-white/5 hover:border-white/20 transition uppercase"
                  >
                    Portal Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="group flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold tracking-wide bg-brand-400 text-ink-950 rounded-lg hover:bg-brand-300 transition uppercase"
                  >
                    Module Guide
                    <Grid3x3 className="w-4 h-4" strokeWidth={2.5} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/5 transition"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* ============ SPACER (ili content isifichwe na navbar) ============ */}
      <div className="h-[72px]"></div>

      {/* ============ MOBILE MENU (fixed overlay) ============ */}
      {open && (
        <div className="md:hidden fixed top-[72px] left-0 right-0 bottom-0 z-40 bg-ink-950 overflow-y-auto">
          <div className="p-5 space-y-3">
            {user ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-ink-950 font-bold text-lg">
                        {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-semibold truncate">
                      {user.first_name || user.username}
                    </div>
                    <div className="text-white/50 text-xs truncate capitalize">
                      {user.role}
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <Link
                  to={dashboardPath}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-brand-400 text-ink-950 rounded-lg font-semibold"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Nenda Dashboard
                </Link>

                <Link
                  to={profilePath}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 border border-white/10 text-white rounded-lg font-medium hover:bg-white/5 transition"
                >
                  <User className="w-5 h-5" />
                  Wasifu Wangu
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-red-500/30 text-red-400 rounded-lg font-medium hover:bg-red-500/10 transition"
                >
                  <LogOut className="w-5 h-5" />
                  Toka
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block text-center px-4 py-3 border border-white/10 text-white rounded-lg font-medium uppercase text-sm tracking-wide hover:bg-white/5 transition"
                >
                  Portal Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-400 text-ink-950 rounded-lg font-semibold uppercase text-sm tracking-wide hover:bg-brand-300 transition"
                >
                  Module Guide
                  <Grid3x3 className="w-4 h-4" strokeWidth={2.5} />
                </Link>
              </>
            )}

            {/* Extra links */}
            <div className="pt-4 border-t border-white/10 space-y-1">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition text-sm"
              >
                Nyumbani
              </Link>
              <Link
                to="/about"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition text-sm"
              >
                Kuhusu Sisi
              </Link>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition text-sm"
              >
                Wasiliana Nasi
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}