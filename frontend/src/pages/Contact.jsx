import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  MapPin, Mail, Phone, Send, MessageSquare,
  Clock, ArrowRight, CheckCircle2
} from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate sending
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSuccess(false), 5000)
    }, 800)
  }

  const CONTACT_INFO = [
    {
      icon: MapPin,
      title: 'Anwani',
      value: 'Mombasa & Zanzibar',
      sub: 'Ofisi zetu',
    },
    {
      icon: Mail,
      title: 'Barua Pepe',
      value: 'husseinabdulrahman2334@gmail.com',
      sub: 'Tutajibu ndani ya masaa 24',
    },
    {
      icon: Phone,
      title: 'Simu',
      value: '+255 658 216 348',
      sub: 'Jumatatu - Ijumaa, 8:00 - 17:00',
    },
  ]

  const FAQS = [
    {
      q: 'Ninawezaje kujisajili kama mwanafunzi?',
      a: 'Nenda kwenye ukurasa wa Register na ujaze fomu. Usajili ni wa bure kwa wanafunzi.',
    },
    {
      q: 'Nimesahau nenosiri langu, nifanye nini?',
      a: 'Bofya "Umesahau nenosiri?" kwenye ukurasa wa Login. Tutakutumia link ya kuweka nenosiri jipya.',
    },
    {
      q: 'Walimu wanawezaje kupata akaunti?',
      a: 'Walimu wanaongezwa na msimamizi (admin). Wasiliana nasi kwa msaada zaidi.',
    },
  ]

  return (
    <div className="bg-ink-950 text-white">

      {/* ================== HERO ================== */}
      <section className="relative pt-20 pb-16 border-b border-white/5">
        <div className="absolute inset-0 grid-pattern opacity-40"></div>
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-brand-400/5 rounded-full blur-[140px]"></div>

        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[2px] bg-brand-400"></span>
            <span className="text-brand-400 text-[11px] font-semibold tracking-[0.28em] uppercase">
              Wasiliana Nasi
            </span>
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mb-8 max-w-3xl">
            Tuko hapa{' '}
            <span className="text-brand-400 italic">kukusaidia.</span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl">
            Una swali, unahitaji msaada, au unataka kujua zaidi kuhusu
            ShulePro? Tutumie ujumbe na tutakujibu haraka iwezekanavyo.
          </p>
        </div>
      </section>

      {/* ================== CONTACT INFO CARDS ================== */}
      <section className="relative py-16 border-b border-white/5">
        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid md:grid-cols-3 gap-5">
            {CONTACT_INFO.map((c, i) => {
              const Icon = c.icon
              return (
                <div
                  key={i}
                  className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-400/30 hover:bg-white/[0.04] transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-400/10 border border-brand-400/20 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                    <Icon className="w-5 h-5 text-brand-400" strokeWidth={2} />
                  </div>
                  <div className="text-[10px] tracking-[0.18em] uppercase text-white/40 mb-2">
                    {c.title}
                  </div>
                  <div className="font-display font-bold text-white text-lg mb-1 break-words">
                    {c.value}
                  </div>
                  <div className="text-white/50 text-sm">
                    {c.sub}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================== FORM + INFO ================== */}
      <section className="relative py-20 border-b border-white/5">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>

        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

            {/* LEFT — Text */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-[2px] bg-brand-400"></span>
                <span className="text-brand-400 text-[11px] font-semibold tracking-[0.28em] uppercase">
                  Tuma Ujumbe
                </span>
              </div>

              <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-[1.05] mb-6">
                Tuambie{' '}
                <span className="text-brand-400 italic">unahitaji nini.</span>
              </h2>

              <p className="text-white/60 text-lg leading-relaxed mb-10">
                Jaza fomu na tutakujibu haraka. Kwa masuala ya haraka,
                unaweza kutupigia simu moja kwa moja.
              </p>

              {/* Highlights */}
              <div className="space-y-4">
                {[
                  { icon: Clock, text: 'Majibu ndani ya masaa 24' },
                  { icon: MessageSquare, text: 'Msaada kwa Kiswahili na Kiingereza' },
                  { icon: CheckCircle2, text: 'Hakuna malipo ya msaada' },
                ].map((h, i) => {
                  const Icon = h.icon
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-400/10 border border-brand-400/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-brand-400" strokeWidth={2} />
                      </div>
                      <span className="text-white/70 text-sm">{h.text}</span>
                    </div>
                  )
                })}
              </div>

              {/* Quick contact links */}
              <div className="mt-10 pt-8 border-t border-white/5 space-y-3">
                <a
                  href="mailto:husseinabdulrahman2334@gmail.com"
                  className="flex items-center gap-3 text-white/60 hover:text-brand-400 transition text-sm"
                >
                  <Mail className="w-4 h-4" />
                  husseinabdulrahman2334@gmail.com
                </a>
                <a
                  href="tel:+255658216348"
                  className="flex items-center gap-3 text-white/60 hover:text-brand-400 transition text-sm"
                >
                  <Phone className="w-4 h-4" />
                  +255 658 216 348
                </a>
              </div>
            </div>

            {/* RIGHT — Form */}
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-brand-400/10 rounded-full blur-2xl"></div>

              <form
                onSubmit={handleSubmit}
                className="relative p-7 md:p-9 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur"
              >
                {success && (
                  <div className="mb-6 px-4 py-3 rounded-xl bg-brand-400/10 border border-brand-400/30 text-brand-400 text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Ujumbe wako umetumwa! Tutakujibu hivi karibuni.
                  </div>
                )}

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Jina lako
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Jina kamili"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand-400/50 focus:bg-white/10 transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Barua pepe
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="jina@example.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand-400/50 focus:bg-white/10 transition"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Kichwa cha ujumbe
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      placeholder="Mfano: Msaada wa kuingia"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand-400/50 focus:bg-white/10 transition"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Ujumbe wako
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Andika ujumbe wako hapa..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand-400/50 focus:bg-white/10 transition resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full py-4 bg-brand-400 hover:bg-brand-300 disabled:opacity-60 text-ink-950 font-bold rounded-xl transition flex items-center justify-center gap-2.5"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin"></span>
                        Inatuma...
                      </>
                    ) : (
                      <>
                        Tuma Ujumbe
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition" strokeWidth={2.5} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-white/40 text-xs">
                    Kwa kutuma, unakubali masharti yetu ya matumizi.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ================== FAQ ================== */}
      <section className="relative py-20 border-b border-white/5">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>

        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-brand-400"></span>
              <span className="text-brand-400 text-[11px] font-semibold tracking-[0.28em] uppercase">
                Maswali ya Kawaida
              </span>
            </div>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-[1.05]">
              Una swali?{' '}
              <span className="text-brand-400 italic">Labda tunalo jibu.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {FAQS.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-400/30 hover:bg-white/[0.04] transition"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-400/10 border border-brand-400/20 flex items-center justify-center text-brand-400 font-bold mb-5">
                  {i + 1}
                </div>
                <h3 className="font-display font-bold text-white text-base mb-3 leading-snug">
                  {f.q}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================== CTA ================== */}
      <section className="relative py-20 overflow-hidden">
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