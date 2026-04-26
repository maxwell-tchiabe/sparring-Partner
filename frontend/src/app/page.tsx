'use client';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, BarChart2, MessageSquare, BrainCircuit, CheckCircle2, ChevronRight, Zap, Globe, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handleProtectedAction = (path: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(path);
  };

  return (
    <Layout>
      <div className="bg-[#05050A] text-slate-200 min-h-screen selection:bg-cyan-500/30 font-sans overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-40 flex items-center justify-center">
          {/* Animated Background Mesh Gradients */}
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/20 blur-[150px] mix-blend-screen pointer-events-none animate-pulse duration-10000"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/20 blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-7000"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              
              <div className="lg:w-1/2 flex flex-col items-start z-20">
                <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-300 font-semibold mb-8 backdrop-blur-md shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 mr-3 animate-ping"></span>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 absolute mr-3"></span>
                  EvoChat Cognitive Engine 2.0
                </div>
                
                <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tighter mb-8 text-white leading-[1.05]">
                  Learn with <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 drop-shadow-sm">Absolute Clarity.</span>
                </h1>
                
                <p className="text-2xl text-slate-400 mb-10 max-w-xl leading-relaxed font-light">
                  Your intelligent companion that remembers your mistakes, adapts to your accent, and accelerates your fluency organically.
                </p>
                
                <div className="flex flex-wrap items-center gap-6">
                  <button
                    onClick={() => handleProtectedAction('/chat')}
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 px-10 py-5 font-bold text-white shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(6,182,212,0.7)] cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                    <span className="relative z-10 text-lg">Start Free Trial</span>
                    <ArrowRight className="h-6 w-6 ml-3 relative z-10 transition-transform group-hover:translate-x-2" />
                  </button>
                  <button
                    onClick={() => handleProtectedAction('/dashboard')}
                    className="inline-flex items-center justify-center px-10 py-5 rounded-full font-semibold text-slate-300 border border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all cursor-pointer backdrop-blur-sm text-lg"
                  >
                    View Tour
                  </button>
                </div>
              </div>
              
              {/* Premium Glassmorphism Chat Mockup */}
              <div className="lg:w-1/2 w-full mt-16 lg:mt-0 relative perspective-1000 z-10">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 to-indigo-600/30 blur-3xl transform scale-95 pointer-events-none rounded-[3rem]"></div>
                
                <div className="relative rounded-[2.5rem] bg-[#0A0A0F]/80 backdrop-blur-2xl border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] shadow-indigo-500/10 overflow-hidden p-8 hover:-translate-y-4 transition-transform duration-700">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-50"></div>
                  
                  <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-cyan-400/80 font-mono tracking-widest font-bold tracking-[0.2em] bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                      <Zap className="w-3 h-3" />
                      FRENCH ALGORITHM
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {/* User Msg */}
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 rounded-3xl rounded-tr-sm max-w-[85%] shadow-lg shadow-indigo-600/20 transform transition-transform hover:scale-[1.02]">
                        <p className="text-base leading-relaxed tracking-wide font-medium">I'd like to practice ordering food in French.</p>
                      </div>
                    </div>
                    {/* EvoChat Msg */}
                    <div className="flex justify-start">
                      <div className="flex items-end gap-4 max-w-[90%]">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shrink-0 shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]">
                          <BrainCircuit className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 text-slate-200 p-6 rounded-3xl rounded-tl-sm shadow-xl transform transition-transform hover:scale-[1.02]">
                          <p className="text-base font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-cyan-400" />
                            Paris, Bakery Simulation
                          </p>
                          <p className="text-base text-slate-300 leading-relaxed">Bien sûr ! 🥐 Vous êtes à la boulangerie. Que dites-vous pour demander une baguette ?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID: Features Section */}
        <section className="py-40 relative">
          <div className="absolute inset-0 bg-[#0A0AD0]/5 border-t border-white/5 skew-y-3 transform origin-top-left -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-8 text-white tracking-tighter">Beyond flashcards. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 drop-shadow-sm">A Cognitive Ecosystem.</span></h2>
              <p className="text-slate-400 text-xl md:text-2xl leading-relaxed font-light">EvoChat doesn't just grade right or wrong. It maps your syntax, understands your logic gaps, and rewires your long-term memory.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Feature 1 (Large 2x2 style) */}
              <div className="md:col-span-2 md:row-span-2 group rounded-[2.5rem] bg-[#0A0A0F]/80 backdrop-blur-2xl border border-white/10 hover:border-indigo-500/50 p-12 transition-all duration-500 hover:shadow-[0_0_80px_-20px_rgba(79,70,229,0.2)] hover:-translate-y-2 flex flex-col overflow-hidden relative">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 blur-[100px] rounded-full transition-opacity group-hover:opacity-100 opacity-50"></div>
                <div className="z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 flex items-center justify-center mb-10 border border-indigo-500/30 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      <MessageSquare className="w-8 h-8 text-indigo-400 drop-shadow-md" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-white mb-6 tracking-tight">Multimodal Perception</h3>
                    <p className="text-slate-400 text-xl leading-relaxed font-light">Speak natively, share screenshots, or drop in PDFs. EvoChat seamlessly interprets visual, auditory, and textual data to build high-context interactions.</p>
                  </div>
                  <div className="mt-12 opacity-80 group-hover:opacity-100 transition-opacity p-6 bg-white/5 rounded-2xl border border-white/5 font-mono text-sm text-cyan-300">
                    <div>&gt; INITIALIZING AUDIO STREAM...</div>
                    <div className="mt-2 text-indigo-300">&gt; DETECTING ACCENT: NATIVE</div>
                    <div className="mt-2 text-pink-300">&gt; GENERATING CONTEXTUAL REPLY...</div>
                  </div>
                </div>
              </div>
              
              {/* Feature 2 (Top Right) */}
              <div className="md:col-span-2 group rounded-[2.5rem] bg-[#0A0A0F]/80 backdrop-blur-2xl border border-white/10 hover:border-cyan-500/50 p-10 transition-all duration-500 hover:shadow-[0_0_60px_-20px_rgba(6,182,212,0.2)] hover:-translate-y-2 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/20 blur-[80px] rounded-full transition-opacity group-hover:opacity-100 opacity-0"></div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex flex-shrink-0 items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform duration-500">
                  <BrainCircuit className="w-8 h-8 text-cyan-400 drop-shadow-md" />
                </div>
                <div className="z-10">
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Vector Memory</h3>
                  <p className="text-slate-400 text-lg leading-relaxed font-light">State tracking across all sessions. EvoChat organically brings up mistakes you made days ago.</p>
                </div>
              </div>
              
              {/* Feature 3 (Bottom Left - Small) */}
              <div className="group rounded-[2.5rem] bg-[#0A0A0F]/80 backdrop-blur-2xl border border-white/10 hover:border-pink-500/50 p-10 transition-all duration-500 hover:shadow-[0_0_60px_-20px_rgba(236,72,153,0.2)] hover:-translate-y-2 relative overflow-hidden">
                 <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-pink-500/20 blur-[80px] rounded-full transition-opacity group-hover:opacity-100 opacity-0"></div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 flex items-center justify-center mb-8 border border-pink-500/30 group-hover:scale-110 transition-transform duration-500">
                  <BarChart2 className="w-7 h-7 text-pink-400 drop-shadow-md" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Live Insights</h3>
                <p className="text-slate-400 font-light leading-relaxed">Real-time gap analysis and neuro-tracking dashboards.</p>
              </div>

               {/* Feature 4 (Bottom Right - Small) */}
               <div className="group rounded-[2.5rem] bg-[#0A0A0F]/80 backdrop-blur-2xl border border-white/10 hover:border-emerald-500/50 p-10 transition-all duration-500 hover:shadow-[0_0_60px_-20px_rgba(16,185,129,0.2)] hover:-translate-y-2 relative overflow-hidden">
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 blur-[80px] rounded-full transition-opacity group-hover:opacity-100 opacity-0"></div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center mb-8 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="w-7 h-7 text-emerald-400 drop-shadow-md" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Adaptive UX</h3>
                <p className="text-slate-400 font-light leading-relaxed">Pacing adapts dynamically to cognitive load patterns.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-40 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center mb-24">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 font-medium mb-6">Verified Intelligence</div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-center text-white tracking-tighter">Trust the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Network</span></h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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

        {/* MASSIVE CTA SECTION */}
        <section className="py-48 relative flex items-center justify-center">
          {/* Intense Glow Base */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A] to-transparent z-0"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full bg-gradient-to-r from-cyan-600/20 to-indigo-600/20 blur-[150px] mix-blend-screen pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 w-full">
            <div className="p-16 md:p-24 rounded-[3rem] bg-[#0A0A0F]/40 backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] shadow-cyan-500/10 relative overflow-hidden">
               <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 blur-[100px] rounded-full"></div>
               <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 blur-[100px] rounded-full"></div>
               
              <div className="relative z-10">
                <h2 className="text-6xl md:text-7xl font-extrabold mb-8 text-white tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Execute <br/>Evolution.</h2>
                <p className="text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">Stop memorizing static data. Interface directly with the premier cognitive language partner.</p>
                
                <button
                  onClick={() => handleProtectedAction('/chat')}
                  className="group inline-flex items-center justify-center px-12 py-6 rounded-full bg-white text-slate-950 font-bold text-xl hover:bg-slate-100 transition-all cursor-pointer shadow-[0_0_50px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_rgba(255,255,255,0.5)] hover:-translate-y-2 hover:scale-[1.02]"
                >
                  INITIALIZE SESSION
                  <ArrowRight className="ml-4 h-7 w-7 transition-transform duration-300 group-hover:translate-x-2" />
                </button>
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </Layout>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <div className="bg-[#0A0A0F]/50 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 rounded-[2.5rem] p-12 relative transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(6,182,212,0.1)] group">
      <MessageSquare className="absolute top-12 right-12 w-20 h-20 text-white/5 transition-colors group-hover:text-cyan-500/5 rotate-12" />
      <div className="flex items-center space-x-2 mb-10 text-cyan-400">
        {[1, 2, 3, 4, 5].map((i) => (
          <CheckCircle2 key={i} className="w-6 h-6 fill-cyan-400/20 stroke-cyan-400 drop-shadow-sm" />
        ))}
      </div>
      <p className="text-slate-300 text-2xl leading-relaxed mb-12 font-light tracking-wide relative z-10">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-xl group-hover:border-cyan-500/50 transition-colors">
          <span className="text-white font-extrabold text-xl">{author[0]}</span>
        </div>
        <div className="ml-6">
          <p className="text-white font-bold text-xl mb-1">{author}</p>
          <p className="text-sm text-cyan-400 font-semibold tracking-wide uppercase">{role}</p>
        </div>
      </div>
    </div>
  );
}
