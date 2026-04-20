import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-[#05050A] border-t border-white/5 text-slate-400">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center cursor-pointer mb-2">
              <div className="flex items-center">
                <img src="/evochat_logo.png" alt="EvoChat Logo" className="h-8 w-8 mr-2 hover:scale-105 transition-transform rounded-md shadow-[0_0_10px_-2px_rgba(6,182,212,0.4)]" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">EvoChat</h3>
            </div>
            <p className="text-sm text-slate-500">© 2026 EvoChat. All cognitive rights reserved.</p>
          </div>
          <div className="flex space-x-8">
            <Link href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors">
              Data Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-cyan-400 transition-colors">
              Contact Command
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
