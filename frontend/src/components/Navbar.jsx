import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Grid3x3, ArrowRight, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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

  return (
    <header className="sticky top-0 z-50 bg-ink-950/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
        <div className="flex items-center justify-between h-[72px]">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-400/20 group-hover:scale-105 transition">
              <span className="text-ink-950 font-extrabold text-xl font-display">S</span>
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

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-5 border-t border-white/5 space-y-2">
            {user ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={() => setOpen(false)}
                  className="block text-center px-4 py-3 bg-brand-400 text-ink-950 rounded-lg font-semibold"
                >
                  Nenda Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 border border-white/10 text-white rounded-lg font-medium"
                >
                  Toka
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block text-center px-4 py-3 border border-white/10 text-white rounded-lg font-medium uppercase text-sm tracking-wide"
                >
                  Portal Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-400 text-ink-950 rounded-lg font-semibold uppercase text-sm tracking-wide"
                >
                  Module Guide
                  <Grid3x3 className="w-4 h-4" strokeWidth={2.5} />
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}