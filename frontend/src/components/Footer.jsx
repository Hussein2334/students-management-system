import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-950">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <span className="text-ink-950 font-extrabold text-lg font-display">S</span>
            </div>
            <div className="leading-none">
              <div className="text-white font-extrabold text-base font-display">
                SHULEPRO
              </div>
              <div className="text-white/50 text-[10px] tracking-[0.18em] uppercase mt-1">
                Students Management System
              </div>
            </div>
          </Link>

          <p className="text-white/60 text-sm">One connected digital campus.</p>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link to="/" className="text-white/70 hover:text-brand-400 transition">Home</Link>
            <Link to="/about" className="text-white/70 hover:text-brand-400 transition">About</Link>
            <Link to="/contact" className="text-white/70 hover:text-brand-400 transition">Contact</Link>
            <span className="text-white/30">v1.0</span>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} ShulePro. Haki zote zimehifadhiwa.
        </div>
      </div>
    </footer>
  )
}