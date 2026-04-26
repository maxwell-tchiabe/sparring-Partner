import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#05050A] text-slate-400 overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[40px] bg-cyan-500/10 blur-[50px]"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center cursor-pointer mb-6 group inline-flex">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 blur-md group-hover:bg-cyan-400/40 transition-colors duration-500 rounded-full"></div>
                <img src="/evochat_logo.png" alt="EvoChat Logo" className="h-10 w-10 mr-3 relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tighter">EvoChat</h3>
            </div>
            <p className="text-base text-slate-500 mb-8 max-w-sm leading-relaxed">
              The next generation cognitive system for accelerated language acquisition. We remember so you don't have to.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/chat" className="text-slate-400 hover:text-white transition-colors duration-300">Live Chat</Link></li>
              <li><Link href="/voice" className="text-slate-400 hover:text-white transition-colors duration-300">Voice Assistant</Link></li>
              <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors duration-300">Cognitive Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300">Terms of Service</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300">Privacy Protocol</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300">Security Command</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} EvoChat. All cognitive rights reserved.</p>
          <div className="flex space-x-4">
            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-mono text-slate-400 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Systems Operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
