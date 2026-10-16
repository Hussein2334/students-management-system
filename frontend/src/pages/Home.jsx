import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  ArrowDown, ArrowRight, ArrowUpRight, GraduationCap, Users,
  BarChart3, ShieldCheck, ChevronLeft, ChevronRight
} from 'lucide-react'

const CAMPUS_IMAGES = [
  {
    url: 'https://picsum.photos/seed/campus1/1200/1500',
    label: 'Campus life · 01',
    title: 'Belong to something bigger.',
    desc: 'A diverse community learning, growing and building the future together.',
  },
  {
    url: 'https://picsum.photos/seed/campus2/1200/1500',
    label: 'Ideas in motion · 02',
    title: 'Every voice has a place.',
    desc: 'Spaces where knowledge is shared and new possibilities begin.',
  },
  {
    url: 'https://picsum.photos/seed/campus3/1200/1500',
    label: 'Connected university · 03',
    title: 'People power every system.',
    desc: 'Technology designed around the students and staff who use it every day.',
  },
]

const FEATURES = [
  { icon: GraduationCap, title: 'Wanafunzi', desc: 'Sajili, hariri na fuatilia taarifa za wanafunzi kwa urahisi.' },
  { icon: Users, title: 'Walimu', desc: 'Walimu wanaweza kusimamia madaraja, mahudhurio na alama.' },
  { icon: BarChart3, title: 'Ripoti', desc: 'Pata ripoti za matokeo na maendeleo ya wanafunzi kwa wakati.' },
  { icon: ShieldCheck, title: 'Usalama', desc: 'Login salama kwa JWT, na kurejesha nenosiri kwa barua pepe.' },
]

export default function Home() {
  const [slide, setSlide] = useState(0)
  const [auto, setAuto] = useState(true)

  // Auto-advance slide
  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => setSlide((s) => (s + 1) % CAMPUS_IMAGES.length), 6000)
    return () => clearInterval(id)
  }, [auto])

  const next = () => { setAuto(false); setSlide((s) => (s + 1) % CAMPUS_IMAGES.length) }
  const prev = () => { setAuto(false); setSlide((s) => (s - 1 + CAMPUS_IMAGES.length) % CAMPUS_IMAGES.length) }

  const current = CAMPUS_IMAGES[slide]

  return (
    <div className="bg-ink-950 text-white overflow-hidden">

      {/* ================== HERO ================== */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center">
        {/* Grid pattern background */}
        <div className="absolute inset-0 grid-pattern opacity-60"></div>

        {/* Glow */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-brand-400/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-400/5 rounded-full blur-[140px]"></div>

        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-10 py-16 lg:py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* ---- LEFT: Copy ---- */}
            <div className="animate-fade-in">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-8">
                <span className="w-8 h-[2px] bg-brand-400"></span>
                <span className="text-brand-400 text-[11px] font-semibold tracking-[0.28em] uppercase">
                  ShulePro Digital Ecosystem
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-[76px] leading-[1.02] tracking-tight mb-7">
                <span className="text-white">One campus.</span>
                <br />
                <span className="text-brand-400 italic">Every service</span>
                <br />
                <span className="text-brand-400 italic">connected.</span>
              </h1>

              <p className="text-white/60 text-lg leading-relaxed max-w-lg mb-10">
                ShulePro inawapa wanafunzi, walimu, na wasimamizi njia moja wazi
                kwa zana zote za kidijitali wanazotumia kila siku.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 mb-12">
                <a
                  href="#services"
                  className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-brand-400 hover:bg-brand-300 text-ink-950 font-semibold rounded-xl transition shadow-lg shadow-brand-400/20"
                >
                  Explore services
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition" strokeWidth={2.5} />
                </a>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/10 hover:border-white/25 hover:bg-white/5 text-white font-medium rounded-xl transition"
                >
                  View module guide
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
                {[
                  { n: '11+', l: 'Connected services' },
                  { n: '4.1', l: 'Current release' },
                  { n: '24/7', l: 'Digital access' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="font-display font-extrabold text-3xl text-brand-400 mb-1">
                      {s.n}
                    </div>
                    <div className="text-white/50 text-xs tracking-wide">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---- RIGHT: Image Album ---- */}
            <div className="relative animate-fade-in">
              {/* Decorative plates */}
              <div className="absolute -top-6 -left-6 w-40 h-40 rounded-[40px] bg-brand-400/10 blur-2xl"></div>
              <div className="absolute -bottom-8 -right-4 w-56 h-56 rounded-[60px] bg-sun/10 blur-3xl"></div>

              {/* Main image */}
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-black/50 border border-white/10 bg-ink-900">
                <div className="aspect-[4/5] relative">
                  {CAMPUS_IMAGES.map((img, i) => (
                    <div
                      key={i}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        i === slide ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        loading="eager"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback: badilisha kuwa gradient ikiwa picha haipatikani
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  ))}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent"></div>

                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
                    <div className="text-brand-400 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">
                      {current.label}
                    </div>
                    <h3 className="font-display font-extrabold text-3xl md:text-4xl leading-tight mb-3 text-white">
                      {current.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed max-w-md">
                      {current.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thumbnails strip */}
              <div className="hidden lg:flex flex-col gap-3 absolute -right-20 top-1/2 -translate-y-1/2">
                {CAMPUS_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setAuto(false); setSlide(i) }}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all bg-ink-900 ${
                      i === slide
                        ? 'border-brand-400 scale-105 shadow-lg shadow-brand-400/30'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white bg-ink-950/70 px-1.5 rounded">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="absolute -bottom-5 left-8 right-8 flex items-center justify-between">
                <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-ink-900/90 backdrop-blur-xl border border-white/10 shadow-xl">
                  <div className="font-display font-extrabold text-white text-lg">
                    {String(slide + 1).padStart(2, '0')}
                    <span className="text-white/40 font-medium text-sm">
                      {' '}/ {String(CAMPUS_IMAGES.length).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-white/10"></div>
                  <button
                    onClick={prev}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition text-white/70 hover:text-white"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={next}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition text-white/70 hover:text-white"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Badge */}
                <div className="hidden md:flex items-center gap-3 px-4 py-3 rounded-2xl bg-ink-900/90 backdrop-blur-xl border border-white/10">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-3 h-3 bg-brand-400/40 rounded-full animate-ping"></span>
                    <span className="w-2 h-2 bg-brand-400 rounded-full"></span>
                  </div>
                  <div className="leading-tight">
                    <div className="text-[10px] text-white/50 tracking-wide uppercase">Connected now</div>
                    <div className="text-xs font-semibold text-white">Digital campus online</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================== FEATURES ================== */}
      <section id="services" className="relative py-24 border-t border-white/5">
        <div className="absolute inset-0 grid-pattern opacity-30"></div>

        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-10">
          {/* Section header */}
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[2px] bg-brand-400"></span>
              <span className="text-brand-400 text-[11px] font-semibold tracking-[0.28em] uppercase">
                Part 02 · Services
              </span>
            </div>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-white mb-5">
              Technology built around{' '}
              <span className="text-brand-400">university life.</span>
            </h2>
            <p className="text-white/60 text-lg">
              Vipengele vyote unavyohitaji kusimamia shule yako kwa ufanisi.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={i}
                  className="group relative p-7 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-brand-400/40 hover:bg-white/[0.04] transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-brand-400/10 border border-brand-400/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-400/20 transition">
                    <Icon className="w-6 h-6 text-brand-400" strokeWidth={2} />
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-2.5">
                    {f.title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed">
                    {f.desc}
                  </p>

                  {/* Corner decoration */}
                  <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition">
                    <ArrowUpRight className="w-4 h-4 text-brand-400" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================== CTA ================== */}
      <section className="relative py-28 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-400/10 rounded-full blur-[140px]"></div>

        <div className="relative max-w-3xl mx-auto px-5 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full border border-brand-400/30 text-brand-400 text-xs font-semibold tracking-[0.18em] uppercase mb-6">
            Get started
          </span>
          <h2 className="font-display font-extrabold text-5xl md:text-6xl leading-[1.05] text-white mb-6">
            Uko tayari <span className="text-brand-400 italic">kuanza?</span>
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Jiunge na maelfu ya wanafunzi wanaotumia ShulePro kila siku.
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-400 hover:bg-brand-300 text-ink-950 font-bold rounded-xl transition shadow-2xl shadow-brand-400/30"
          >
            Sajili Akaunti Yako
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" strokeWidth={2.5} />
          </Link>
        </div>
      </section>

    </div>
  )
}