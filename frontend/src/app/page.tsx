'use client';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowRight, BarChart2, MessageSquare, BrainCircuit,
  CheckCircle2, Zap, Globe, Sparkles, Mic, BookOpen, TrendingUp, Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComingSoonBadge } from '@/components/common/ComingSoonBadge';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handleProtectedAction = (path: string) => {
    if (!user) { router.push('/login'); return; }
    router.push(path);
  };

  return (
    <Layout>
      <div className="bg-[#05050A] text-slate-200 min-h-screen selection:bg-violet-500/30 font-sans overflow-hidden">

        <section className="relative pt-28 pb-32 overflow-hidden">

          <div className="pointer-events-none absolute -top-40 -left-40 w-[55vw] h-[55vw] rounded-full bg-violet-700/20 blur-[160px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-[45vw] h-[45vw] rounded-full bg-cyan-500/15 blur-[130px]" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-indigo-600/10 blur-[100px]" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">

              <div className="lg:w-[52%] flex flex-col items-start">

                <div className="inline-flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm text-violet-300 font-semibold mb-8 backdrop-blur-md shadow-[0_0_24px_-6px_rgba(139,92,246,0.4)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
                  </span>
                  Cognitive Engine 2.0 · Now Live
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-extrabold tracking-tighter leading-[1.05] mb-7 text-white">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">AI coaching</span>
                  <br />
                  for real fluency
                </h1>

                <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-lg leading-relaxed font-light">
                  EvoChat listens, remembers your weak spots, and builds immersive scenarios — all without taking a single manual note.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <button
                    id="hero-cta-primary"
                    onClick={() => handleProtectedAction('/chat')}
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 px-9 py-4 font-bold text-white text-base shadow-[0_0_36px_-8px_rgba(139,92,246,0.6)] transition-all hover:scale-105 hover:shadow-[0_0_56px_-10px_rgba(139,92,246,0.8)] cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10">Start for free</span>
                    <ArrowRight className="h-5 w-5 ml-2 relative z-10 transition-transform group-hover:translate-x-1.5" />
                  </button>
                  <button
                    id="hero-cta-secondary"
                    onClick={() => handleProtectedAction('/dashboard')}
                    className="inline-flex items-center justify-center px-9 py-4 rounded-full font-semibold text-slate-300 border border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all cursor-pointer backdrop-blur-sm text-base"
                  >
                    See how it works
                  </button>
                </div>

                {/* Trust indicators — like the "31-day free trial" row */}
                <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
                  {["No credit card required", "Cancel anytime"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* ══ RIGHT: Central mockup + floating feature cards ══ */}
              <div className="lg:w-[48%] w-full relative mt-10 lg:mt-0 min-h-[520px] flex items-center justify-center">

                {/* Glow behind mockup */}
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-indigo-600/20 blur-3xl rounded-[3rem] pointer-events-none" />

                {/* ── Central Chat Mockup card ── */}
                <div className="relative w-full max-w-sm mx-auto z-10 rounded-[2rem] bg-[#0D0D14]/90 backdrop-blur-2xl border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden hover:-translate-y-3 transition-transform duration-700">

                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" />

                  {/* Window chrome */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-violet-300/80 font-mono tracking-[0.18em] bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
                      <Zap className="w-3 h-3" /> SESSION ACTIVE
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="p-6 space-y-5">
                    {/* User bubble */}
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[86%] shadow-lg shadow-violet-600/20 text-sm leading-relaxed font-medium">
                        I'd like to practice ordering food in French.
                      </div>
                    </div>

                    {/* AI bubble */}
                    <div className="flex justify-start gap-3">
                      <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-violet-400 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(139,92,246,0.6)]">
                        <BrainCircuit className="w-4.5 h-4.5 text-white" />
                      </div>
                      <div className="bg-slate-900/90 backdrop-blur-md border border-white/8 px-5 py-4 rounded-2xl rounded-tl-sm shadow-xl text-sm">
                        <p className="font-bold text-xs text-violet-300 flex items-center gap-1.5 mb-2 tracking-wide">
                          <Globe className="w-3.5 h-3.5" /> Paris · Boulangerie
                        </p>
                        <p className="text-slate-300 leading-relaxed">Bien sûr ! 🥐 Comment demandez-vous une baguette ?</p>
                      </div>
                    </div>

                    {/* Analysing bar */}
                    <div className="flex items-center gap-2 text-xs text-cyan-400/70 font-mono pl-12">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                          <div key={i} className="w-0.5 rounded-full bg-cyan-400/60 animate-pulse" style={{ height: `${6 + (i % 3) * 4}px`, animationDelay: `${i * 80}ms` }} />
                        ))}
                      </div>
                      Analysing accent…
                    </div>
                  </div>
                </div>

                {/* ── Floating Feature Cards ── */}

                {/* Card 1 — top-left: Vector Memory */}
                <div className="absolute -top-6 -left-4 lg:-left-10 z-20 w-52 rounded-2xl bg-[#0D0D14]/95 backdrop-blur-xl border border-white/10 shadow-2xl p-4 hover:-translate-y-1 transition-transform duration-500 group">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform">
                      <BrainCircuit className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-xs font-bold text-white">Vector Memory</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Tracks errors across every session — automatically.</p>
                  <div className="mt-3 flex gap-1">
                    {[80, 55, 92, 68, 75].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-cyan-500/30" style={{ height: `${h * 0.2}px` }} />
                    ))}
                  </div>
                </div>

                {/* Card 2 — top-right: Live Insights */}
                <div className="absolute -top-6 -right-4 lg:-right-10 z-20 w-48 rounded-2xl bg-[#0D0D14]/95 backdrop-blur-xl border border-white/10 shadow-2xl p-4 hover:-translate-y-1 transition-transform duration-500 group">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 flex items-center justify-center border border-pink-500/30 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-4 h-4 text-pink-400" />
                    </div>
                    <span className="text-xs font-bold text-white">Live Insights</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Real-time gap analysis dashboard.</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500" />
                    </div>
                    <span className="text-[10px] text-pink-300 font-mono">72%</span>
                  </div>
                </div>

                {/* Card 3 — bottom-left: Real-time Voice */}
                <div className="absolute -bottom-8 -left-4 lg:-left-10 z-20 w-56 rounded-2xl bg-[#0D0D14]/95 backdrop-blur-xl border border-white/10 shadow-2xl p-4 hover:translate-y-1 transition-transform duration-500 group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-600/10 flex items-center justify-center border border-violet-500/30 group-hover:scale-110 transition-transform">
                        <Mic className="w-4 h-4 text-violet-400" />
                      </div>
                      <span className="text-xs font-bold text-white">Voice Interaction</span>
                    </div>
                    <ComingSoonBadge 
                      text="COMING SOON" 
                      showDot 
                      className="ml-0 px-2 py-0.5 text-amber-300 whitespace-nowrap" 
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">Real-time voice conversation with instant AI response.</p>
                  {/* Animated waveform */}
                  <div className="flex items-end justify-between gap-0.5 h-7">
                    {[3, 7, 5, 10, 6, 12, 8, 14, 9, 11, 6, 8, 4, 10, 7].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full bg-gradient-to-t from-violet-500 to-fuchsia-400 opacity-80 animate-pulse"
                        style={{ height: `${h * 2}px`, animationDelay: `${i * 60}ms`, animationDuration: `${700 + (i % 4) * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Card 4 — bottom-right: Adaptive UX */}
                <div className="absolute -bottom-8 -right-4 lg:-right-10 z-20 w-48 rounded-2xl bg-[#0D0D14]/95 backdrop-blur-xl border border-white/10 shadow-2xl p-4 hover:translate-y-1 transition-transform duration-500 group">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-xs font-bold text-white">Adaptive UX</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Pacing adjusts to your cognitive rhythm.</p>
                  <div className="mt-2 flex gap-1 items-center">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-3 h-3 fill-emerald-400/80 text-emerald-400" />
                    ))}
                  </div>
                </div>

              </div>
              {/* end RIGHT */}
            </div>
          </div>

        </section>

        <section className="py-36 relative">
          <div className="absolute inset-0 border-t border-white/5 -z-10" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 font-medium mb-5">Core Capabilities</div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white tracking-tighter">
                Beyond flashcards.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">A Cognitive Ecosystem.</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-light">
                EvoChat doesn't just grade right or wrong — it maps your syntax, understands your logic gaps, and rewires your long-term memory.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* Feature 1 — large */}
              <div className="md:col-span-2 md:row-span-2 group rounded-[2rem] bg-[#0A0A0F]/80 backdrop-blur-2xl border border-white/8 hover:border-violet-500/40 p-10 transition-all duration-500 hover:shadow-[0_0_60px_-20px_rgba(139,92,246,0.25)] hover:-translate-y-2 flex flex-col overflow-hidden relative">
                <div className="absolute -right-16 -top-16 w-72 h-72 bg-violet-500/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-600/10 flex items-center justify-center mb-8 border border-violet-500/30 group-hover:scale-110 transition-transform duration-500">
                      <MessageSquare className="w-7 h-7 text-violet-400" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-white mb-4 tracking-tight">Multimodal Perception</h3>
                    <p className="text-slate-400 text-lg leading-relaxed font-light">Speak natively, share screenshots, or drop in PDFs. EvoChat seamlessly interprets visual, auditory, and textual data to build high-context interactions.</p>
                  </div>
                  <div className="mt-10 p-5 bg-white/4 rounded-xl border border-white/5 font-mono text-xs text-cyan-300 space-y-1.5">
                    <div>&gt; INITIALIZING AUDIO STREAM…</div>
                    <div className="text-indigo-300">&gt; DETECTING ACCENT: NATIVE</div>
                    <div className="text-pink-300">&gt; GENERATING CONTEXTUAL REPLY…</div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="md:col-span-2 group rounded-[2rem] bg-[#0A0A0F]/80 backdrop-blur-2xl border border-white/8 hover:border-cyan-500/40 p-8 transition-all duration-500 hover:shadow-[0_0_50px_-20px_rgba(6,182,212,0.2)] hover:-translate-y-2 relative overflow-hidden flex items-center gap-7">
                <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-cyan-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform duration-500">
                  <BrainCircuit className="w-7 h-7 text-cyan-400" />
                </div>
                <div className="z-10">
                  <h3 className="text-xl font-bold text-white mb-2">Vector Memory</h3>
                  <p className="text-slate-400 leading-relaxed font-light">State tracking across all sessions. EvoChat organically brings back mistakes you made days ago.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-[2rem] bg-[#0A0A0F]/80 backdrop-blur-2xl border border-white/8 hover:border-pink-500/40 p-8 transition-all duration-500 hover:shadow-[0_0_50px_-20px_rgba(236,72,153,0.2)] hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-pink-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 flex items-center justify-center mb-6 border border-pink-500/30 group-hover:scale-110 transition-transform duration-500">
                  <BarChart2 className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Live Insights</h3>
                <p className="text-slate-400 font-light leading-relaxed text-sm">Real-time gap analysis and neuro-tracking dashboards.</p>
              </div>

              {/* Feature 4 */}
              <div className="group rounded-[2rem] bg-[#0A0A0F]/80 backdrop-blur-2xl border border-white/8 hover:border-emerald-500/40 p-8 transition-all duration-500 hover:shadow-[0_0_50px_-20px_rgba(16,185,129,0.2)] hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-36 h-36 bg-emerald-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center mb-6 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Adaptive UX</h3>
                <p className="text-slate-400 font-light leading-relaxed text-sm">Pacing adapts dynamically to your cognitive load patterns.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-36 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center mb-20">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 font-medium mb-5">Verified Intelligence</div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white tracking-tighter">
                Trust the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Network</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TestimonialCard
                quote="I've tried every language app on the market. EvoChat is the only one that actually feels like a living, breathing tutor analyzing my logic in real time. It's wildly different."
                author="Sarah B."
                role="Advanced Polyglot"
              />
              <TestimonialCard
                quote="The insights dashboard caught grammar mistakes I've been making for 5 years. It doesn't just correct you, it maps out your cognitive blind spots."
                author="Michael T."
                role="Bilingual Professional"
              />
            </div>
          </div>
        </section>

        <section className="py-40 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A] to-transparent z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] md:w-[45vw] md:h-[45vw] rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-[150px] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 w-full">
            <div className="p-14 md:p-20 rounded-[2.5rem] bg-[#0A0A0F]/40 backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute -top-32 -right-32 w-72 h-72 bg-violet-500/20 blur-[100px] rounded-full" />
              <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-cyan-500/20 blur-[100px] rounded-full" />
              <div className="relative z-10">
                <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                  Execute <br />Evolution.
                </h2>
                <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed font-light">
                  Stop memorizing static data. Interface directly with the premier cognitive language partner.
                </p>
                <button
                  id="cta-initialize"
                  onClick={() => handleProtectedAction('/chat')}
                  className="group inline-flex items-center justify-center px-11 py-5 rounded-full bg-white text-slate-950 font-bold text-lg hover:bg-slate-100 transition-all cursor-pointer shadow-[0_0_50px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_rgba(255,255,255,0.5)] hover:-translate-y-2"
                >
                  INITIALIZE SESSION
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="bg-[#0A0A0F]/50 backdrop-blur-xl border border-white/8 hover:border-violet-500/30 rounded-[2rem] p-10 relative transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(139,92,246,0.1)] group">
      <MessageSquare className="absolute top-10 right-10 w-16 h-16 text-white/4 group-hover:text-violet-500/5 rotate-12 transition-colors" />
      <div className="flex items-center gap-1.5 mb-8 text-violet-400">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="w-5 h-5 fill-violet-400/30 stroke-violet-400" />
        ))}
      </div>
      <p className="text-slate-300 text-xl leading-relaxed mb-10 font-light tracking-wide relative z-10">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shrink-0 shadow-xl group-hover:border-violet-500/40 transition-colors w-12 h-12">
          <span className="text-white font-extrabold text-lg">{author[0]}</span>
        </div>
        <div className="ml-4">
          <p className="text-white font-bold">{author}</p>
          <p className="text-xs text-violet-400 font-semibold tracking-wider uppercase">{role}</p>
        </div>
      </div>
    </div>
  );
}

