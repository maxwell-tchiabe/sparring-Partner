'use client';

import {
  MessageSquare,
  BarChart2,
  Menu,
  X,
  Mic,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export function Header() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProtectedAction = (path: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#05050A]/70 backdrop-blur-xl border-b border-white/10 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl group-hover:bg-cyan-400/40 transition-colors duration-500 rounded-full"></div>
                <img src="/evochat_logo.png" alt="EvoChat Logo" className="h-10 w-10 relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tighter cursor-pointer">EvoChat</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleProtectedAction('/chat')}
              className="group relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/5 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 mr-2 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              Live Chat
            </button>
            <button
              onClick={() => handleProtectedAction('/dashboard')}
              className="group relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/5 cursor-pointer"
            >
              <BarChart2 className="h-4 w-4 mr-2 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              Dashboard
            </button>
            <button
              onClick={() => handleProtectedAction('/voice')}
              className="group relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/5 cursor-pointer"
            >
              <Mic className="h-4 w-4 mr-2 text-slate-400 group-hover:text-pink-400 transition-colors" />
              Voice Assistant
            </button>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <button
                onClick={() => signOut()}
                className="group relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white transition-all rounded-full overflow-hidden bg-slate-800/50 border border-slate-700 hover:border-pink-500/50 hover:bg-slate-800 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <LogOut className="h-4 w-4 mr-2 relative z-10 text-pink-400" />
                <span className="relative z-10">Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all rounded-full overflow-hidden shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.6)] hover:scale-105 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-600"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <LogIn className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10 tracking-wide mt-0.5">Initialize Session</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none transition-all cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-white/10 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        } bg-[#0A0A0F]/95 backdrop-blur-3xl`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          <button
            onClick={() => handleProtectedAction('/chat')}
            className="flex items-center w-full px-4 py-3 text-base font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          >
            <MessageSquare className="h-5 w-5 mr-3 text-cyan-400" />
            Live Chat
          </button>
          <button
            onClick={() => handleProtectedAction('/dashboard')}
            className="flex items-center w-full px-4 py-3 text-base font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          >
            <BarChart2 className="h-5 w-5 mr-3 text-indigo-400" />
            Dashboard
          </button>
          <button
            onClick={() => handleProtectedAction('/voice')}
            className="flex items-center w-full px-4 py-3 text-base font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          >
            <Mic className="h-5 w-5 mr-3 text-pink-400" />
            Voice Assistant
          </button>
          <div className="pt-4 mt-2 border-t border-white/10">
            {user ? (
              <button
                onClick={() => signOut()}
                className="flex items-center w-full px-4 py-3 text-base font-bold text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center w-full px-4 py-3 text-base font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)] transition-all mt-2 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Initialize Session
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
