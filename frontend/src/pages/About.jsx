import { Link } from 'react-router-dom'
import {
  GraduationCap, University, CreditCard, Home, Smartphone,
  Stethoscope, BookOpen, Archive, LineChart, LifeBuoy, Globe,
  Info, ArrowUpRight, ArrowRight
} from 'lucide-react'

const SERVICES = [
  {
    icon: GraduationCap,
    category: 'Academic',
    title: 'Admission',
    desc: 'Online applications and applicant services',
    color: 'brand',
  },
  {
    icon: University,
    category: 'Academic',
    title: 'Academic',
    desc: 'Academic records and university administration',
    color: 'sky',
  },
  {
    icon: CreditCard,
    category: 'Finance',
    title: 'Billing',
    desc: 'Student bills, invoices, and payments',
    color: 'sun',
  },
  {
    icon: Home,
    category: 'Student life',
    title: 'Hostel',
    desc: 'Accommodation registration and services',
    color: 'violet',
  },
  {
    icon: Smartphone,
    category: 'Student life',
    title: 'USSD',
    desc: 'Fast university services from any mobile phone',
    color: 'mint',
  },
  {
    icon: Stethoscope,
    category: 'Campus services',
    title: 'Al-Zahra',
    desc: 'University dispensary and patient services',
    color: 'coral',
  },
  {
    icon: BookOpen,
    category: 'Academic',
    title: 'LMS',
    desc: 'Courses, learning resources, and activities',
    color: 'sky',
  },
  {
    icon: Archive,
    category: 'Research',
    title: 'Repository',
    desc: 'Research publications and digital archive',
    color: 'brand',
  },
  {
    icon: LineChart,
    category: 'Finance',
    title: 'Accounting',
    desc: 'Finance operations and institutional reporting',
    color: 'sun',
  },
  {
    icon: LifeBuoy,
    category: 'Support',
    title: 'Help Desk',
    desc: 'Support requests and service desk operations',
    color: 'mint',
  },
  {
    icon: Globe,
    category: 'Public web',
    title: 'Zanvarsity',
    desc: 'University website content management',
    color: 'violet',
  },
]

// Rangi kwa kila service
const COLOR_MAP = {
  brand: {
    bg: 'bg-brand-400/10',
    border: 'border-brand-400/30',
    text: 'text-brand-400',
    iconBg: 'bg-brand-400/15',
  },
  sky: {
    bg: 'bg-sky/10',
    border: 'border-sky/30',
    text: 'text-sky',
    iconBg: 'bg-sky/15',
  },
  sun: {
    bg: 'bg-sun/10',
    border: 'border-sun/30',
    text: 'text-sun',
    iconBg: 'bg-sun/15',
  },
  violet: {
    bg: 'bg-violet/10',
    border: 'border-violet/30',
    text: 'text-violet',
    iconBg: 'bg-violet/15',
  },
  mint: {
    bg: 'bg-mint/10',
    border: 'border-mint/30',
    text: 'text-mint',
    iconBg: 'bg-mint/15',
  },
  coral: {
    bg: 'bg-coral/10',
    border: 'border-coral/30',
    text: 'text-coral',
    iconBg: 'bg-coral/15',
  },
}

export default function About() {
  return (
    <div className="bg-ink-950 text-white">

      {/* ================== HERO ================== */}
      <section className="relative pt-20 pb-16 border-b border-white/5">
        <div className="absolute inset-0 grid-pattern opacity-40"></div>
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-brand-400/5 rounded-full blur-[140px]"></div>

        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[2px] bg-brand-400"></span>
            <span className="text-brand-400 text-[11px] font-semibold tracking-[0.28em] uppercase">
              Kuhusu ShulePro
            </span>
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mb-8 max-w-3xl">
            Mfumo wa kisasa wa{' '}
            <span className="text-brand-400 italic">usimamizi wa shule.</span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
            ShulePro ni mfumo wa kisasa wa usimamizi wa wanafunzi ulioundwa
            kwa ajili ya shule za Tanzania. Tunasaidia shule kusimamia taarifa
            za wanafunzi, walimu, madaraja, mahudhurio na matokeo kwa urahisi.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-brand-400 hover:bg-brand-300 text-ink-950 font-semibold rounded-xl transition shadow-lg shadow-brand-400/20"
            >
              Anza Sasa
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" strokeWidth={2.5} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/10 hover:border-white/25 hover:bg-white/5 text-white font-medium rounded-xl transition"
            >
              Wasiliana Nasi
            </Link>
          </div>
        </div>
      </section>

      {/* ================== SERVICES ================== */}
      <section className="relative py-20">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>

        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-10">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] bg-brand-400"></span>
                <span className="text-brand-400 text-[11px] font-semibold tracking-[0.28em] uppercase">
                  Part 02 · Services
                </span>
              </div>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[1.05] max-w-2xl">
                Technology built around{' '}
                <span className="text-brand-400">university life.</span>
              </h2>
            </div>

            <p className="text-white/50 text-sm max-w-xs">
              Select an icon to open a service, or use Info to understand
              its modules before continuing.
            </p>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => {
              const Icon = s.icon
              const colors = COLOR_MAP[s.color]
              return (
                <article
                  key={i}
                  className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden"
                >
                  {/* Decorative circle */}
                  <div
                    className={`absolute -top-16 -right-16 w-40 h-40 rounded-full ${colors.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`}
                  ></div>

                  {/* Content */}
                  <div className="relative flex items-start gap-4 mb-5">
                    {/* Icon with ring */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-14 h-14 rounded-2xl ${colors.iconBg} border ${colors.border} flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 ${colors.text}`} strokeWidth={2} />
                      </div>
                      {/* Outer ring decoration */}
                      <span
                        className={`absolute inset-0 rounded-2xl border ${colors.border} opacity-40 scale-125`}
                      ></span>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] tracking-[0.18em] uppercase text-white/40 mb-1">
                        {s.category}
                      </div>
                      <h3 className="font-display font-bold text-lg text-white mb-1">
                        {s.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom actions */}
                  <div className="relative flex items-center justify-between pt-4 border-t border-white/5">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 bg-white/5 rounded-lg hover:bg-white/10 hover:text-white transition">
                      <Info className="w-3.5 h-3.5" />
                      Info
                    </button>

                    <div
                      className={`w-8 h-8 rounded-lg ${colors.iconBg} border ${colors.border} flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition`}
                    >
                      <ArrowUpRight className={`w-4 h-4 ${colors.text}`} strokeWidth={2.5} />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================== MISSION ================== */}
      <section className="relative py-24 border-t border-white/5">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>

        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] bg-brand-400"></span>
                <span className="text-brand-400 text-[11px] font-semibold tracking-[0.28em] uppercase">
                  Dhamira Yetu
                </span>
              </div>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-[1.05] mb-6">
                Kurahisisha usimamizi wa shule kwa{' '}
                <span className="text-brand-400 italic">teknolojia.</span>
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-white/60 text-lg leading-relaxed">
                Kurahisisha usimamizi wa shule kwa kutumia teknolojia, ili
                walimu na watawala waweze kutumia muda wao mwingi kuelimisha
                wanafunzi badala ya kufanya kazi za karatasi.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'React', value: 'Frontend' },
                  { label: 'Django', value: 'Backend' },
                  { label: 'JWT', value: 'Usalama' },
                  { label: 'Tailwind', value: 'UI' },
                ].map((t, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="font-display font-extrabold text-xl text-brand-400 mb-1">
                      {t.label}
                    </div>
                    <div className="text-white/40 text-xs tracking-wide">
                      {t.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================== CTA ================== */}
      <section className="relative py-20 border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-400/10 rounded-full blur-[140px]"></div>

        <div className="relative max-w-2xl mx-auto px-5 text-center">
          <h2 className="font-display font-extrabold text-4xl md:text-5xl mb-5">
            Uko tayari <span className="text-brand-400 italic">kuanza?</span>
          </h2>
          <p className="text-white/60 mb-8">
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