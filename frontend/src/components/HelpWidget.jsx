import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function HelpWidget() {
  const [open, setOpen] = useState(true)

  if (!open) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="relative">
        <Link
          to="/contact"
          className="flex items-center gap-3 pl-3 pr-5 py-3 bg-brand-400 text-ink-950 rounded-2xl shadow-2xl shadow-brand-400/30 hover:bg-brand-300 transition group"
        >
          <div className="w-10 h-10 bg-ink-950 rounded-full flex items-center justify-center group-hover:scale-110 transition">
            <MessageCircle className="w-5 h-5 text-brand-400" strokeWidth={2.5} />
          </div>
          <div className="leading-tight pr-2">
            <div className="font-bold text-sm font-display">Need help?</div>
            <div className="text-[11px] opacity-70">Chat or raise a ticket</div>
          </div>
        </Link>

        <button
          onClick={() => setOpen(false)}
          className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-ink-800 border border-white/10 flex items-center justify-center hover:bg-ink-700 transition"
          aria-label="Close"
        >
          <X className="w-3 h-3 text-white/60" />
        </button>
      </div>
    </div>
  )
}