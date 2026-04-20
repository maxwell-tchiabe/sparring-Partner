'use client';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, BarChart2, MessageSquare, Settings, CheckCircle2, ChevronRight, BrainCircuit } from 'lucide-react';
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
      {/* Background base */}
      <div className="bg-[#05050A] text-slate-200 min-h-screen selection:bg-cyan-500/30 font-sans">
      
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-24 pb-32 flex items-center justify-center">
          {/* Neon mesh gradients behind */}
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[20%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              <div className="lg:w-1/2 flex flex-col items-start">
                <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 font-medium mb-8 backdrop-blur-md">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
                  Next-Gen Cognitive System
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white leading-tight">
                  Master Languages with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">EvoChat</span>.
                </h1>
                
                <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
                  Your intelligent companion that remembers your mistakes, adapts to your accent, and accelerates your fluency. Welcome to the future of learning.
                </p>
                
                <div className="flex flex-wrap items-center gap-5">
                  <button
                    onClick={() => handleProtectedAction('/chat')}
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 px-8 py-4 font-bold text-white shadow-[0_0_40px_-10px_rgba(56,189,248,0.5)] transition-all hover:scale-[1.02] hover:shadow-[0_0_60px_-15px_rgba(56,189,248,0.6)] cursor-pointer"
                  >
                    <span className="mr-2">Start Learning Free</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button
                    onClick={() => handleProtectedAction('/dashboard')}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  >
                    View Dashboard
                  </button>
                </div>
              </div>
              
              {/* Glassmorphism Chat Mockup */}
              <div className="lg:w-1/2 w-full lg:mt-0 mt-12 relative perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 blur-3xl transform scale-90 pointer-events-none"></div>
                
                <div className="relative rounded-2xl bg-[#0F111A]/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden p-6 hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 font-mono tracking-wider">EVOCHAT / FRENCH_MODULE</div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* User Msg */}
                    <div className="flex justify-end">
                      <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm max-w-[85%] shadow-lg">
                        <p className="text-sm leading-relaxed">I'd like to practice ordering food in French.</p>
                      </div>
                    </div>
                    {/* EvoChat Msg */}
                    <div className="flex justify-start">
                      <div className="flex items-end gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shrink-0">
                          <BrainCircuit className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-slate-800/80 backdrop-blur-sm border border-white/5 text-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-lg">
                          <p className="text-sm font-medium mb-1 text-white">Bien sûr ! 🥐</p>
                          <p className="text-sm text-slate-300 leading-relaxed">Nous sommes à la boulangerie. Que dites-vous pour demander une baguette s'il vous plaît ?</p>
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
        <section className="py-32 relative border-t border-white/5 bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Not just a bot. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">A Cognitive System.</span></h2>
              <p className="text-slate-400 text-xl leading-relaxed">Standard apps teach you vocabulary. EvoChat learns how you think, tracks your long-term memory, and guides you to absolute fluency.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 (Large) */}
              <div className="md:col-span-2 group rounded-3xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-slate-700 p-10 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.15)] flex flex-col justify-between overflow-hidden relative">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full transition-opacity group-hover:opacity-100 opacity-50"></div>
                <div className="z-10">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-7 h-7 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Multimodal Perception</h3>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-md">Speak naturally with voice integration, share your screen, send PDFs or images. EvoChat sees, hears, and reads exactly what you do to provide hyper-contextual learning.</p>
                </div>
              </div>
              
              {/* Feature 2 (Small) */}
              <div className="group rounded-3xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-slate-700 p-10 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)] relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/10 blur-[60px] rounded-full transition-opacity group-hover:opacity-100 opacity-0"></div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-8 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Long-Term Memory</h3>
                <p className="text-slate-400 leading-relaxed">Powered by Vector databases to remember your persistent errors across sessions and days.</p>
              </div>
              
              {/* Feature 3 (Small) */}
              <div className="group rounded-3xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-slate-700 p-10 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(236,72,153,0.15)] relative overflow-hidden">
                 <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-pink-500/10 blur-[60px] rounded-full transition-opacity group-hover:opacity-100 opacity-0"></div>
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-8 border border-pink-500/20 group-hover:scale-110 transition-transform">
                  <BarChart2 className="w-7 h-7 text-pink-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Live Insights</h3>
                <p className="text-slate-400 leading-relaxed">Your dashboard adapts to your logic, giving you real-time progression graphs and weak-point analysis.</p>
              </div>

              {/* Feature 4 (Large / CTA) */}
              <div className="md:col-span-2 group rounded-3xl bg-gradient-to-r from-slate-900/80 to-indigo-900/20 backdrop-blur-sm border border-slate-800 hover:border-indigo-500/30 p-10 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer" onClick={() => handleProtectedAction('/chat')}>
                <div className="mb-6 md:mb-0">
                  <h3 className="text-3xl font-bold text-white mb-2">Ready to evolve?</h3>
                  <p className="text-indigo-200 text-lg">Join the waitlist or initialize your first session immediately.</p>
                </div>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white text-slate-900 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]">
                  <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-32 relative border-t border-white/5 bg-[#08080C]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-20 text-white tracking-tight">Trust the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Network</span></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TestimonialCard
                quote="I've tried every language app on the market. EvoChat is the only one that actually feels like a living, breathing tutor analyzing my logic in real time."
                author="Sarah B."
                role="Advanced Polyglot"
              />
              <TestimonialCard
                quote="The insights dashboard caught grammar mistakes I've been making for 5 years. It doesn't just correct you, it explains your cognitive blind spots."
                author="Michael T."
                role="Bilingual Professional"
              />
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-40 relative flex items-center justify-center">
          {/* Subtle glow behind the CTA */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-[#0A0A0F] pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-8 text-white tracking-tight">Start Your Evolution.</h2>
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">Stop memorizing static flashcards. Experience the first truly cognitive language partner.</p>
            
            <button
              onClick={() => handleProtectedAction('/chat')}
              className="group inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-white text-slate-950 font-bold text-lg hover:bg-slate-100 transition-all cursor-pointer shadow-[0_0_40px_-5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_-5px_rgba(255,255,255,0.3)] hover:-translate-y-1"
            >
              Initialize Session
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </button>
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
    <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800 hover:border-slate-700 rounded-3xl p-10 relative transition-colors duration-300">
      <MessageSquare className="absolute top-10 right-10 w-12 h-12 text-white/5" />
      <div className="flex items-center space-x-1.5 mb-8 text-cyan-400">
        {[1, 2, 3, 4, 5].map((i) => (
          <CheckCircle2 key={i} className="w-5 h-5 fill-cyan-400/20" />
        ))}
      </div>
      <p className="text-slate-300 text-xl leading-relaxed mb-10 italic">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-slate-300 font-bold text-lg">{author[0]}</span>
        </div>
        <div className="ml-5">
          <p className="text-white font-bold text-lg">{author}</p>
          <p className="text-md text-cyan-500/80 font-medium">{role}</p>
        </div>
      </div>
    </div>
  );
}
