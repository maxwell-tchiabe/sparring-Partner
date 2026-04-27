'use client';

import Link from 'next/link';

// Custom Brand Icons (since Lucide brand icons are deprecated)
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

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
              <li><Link href="/terms" className="text-slate-400 hover:text-white transition-colors duration-300">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-white transition-colors duration-300">Privacy Protocol</Link></li>
              <li><Link href="/impressum" className="text-slate-400 hover:text-white transition-colors duration-300">Impressum</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} EvoChat. All cognitive rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link 
              href="https://www.linkedin.com/in/loic-maxwell-tchiabe-softwareentwickler-cloud-ai-java-python-angular/" 
              target="_blank" 
              className="text-slate-500 hover:text-white transition-colors duration-300"
            >
              <LinkedInIcon className="w-5 h-5" />
            </Link>
            <Link 
              href="https://www.youtube.com/@MaxwellTBTech" 
              target="_blank" 
              className="text-slate-500 hover:text-white transition-colors duration-300"
            >
              <YouTubeIcon className="w-5 h-5" />
            </Link>
            <Link 
              href="https://github.com/maxwell-tchiabe" 
              target="_blank" 
              className="text-slate-500 hover:text-white transition-colors duration-300"
            >
              <GitHubIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
