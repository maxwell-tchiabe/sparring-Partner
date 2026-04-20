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
    <header className="sticky top-0 z-50 bg-[#05050A]/80 backdrop-blur-lg border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <img src="/evochat_logo.png" alt="EvoChat Logo" className="h-10 w-10 mr-2 hover:scale-105 transition-transform rounded-md shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]" />
                <span className="text-xl font-bold text-white tracking-tight">EvoChat</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => handleProtectedAction('/chat')}
              className="inline-flex cursor-pointer items-center px-1 pt-1 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <MessageSquare className="h-5 w-5 mr-1" />
              Live Chat
            </button>
            <button
              onClick={() => handleProtectedAction('/dashboard')}
              className="inline-flex cursor-pointer items-center px-1 pt-1 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <BarChart2 className="h-5 w-5 mr-1" />
              Dashboard
            </button>
            <button
              onClick={() => handleProtectedAction('/voice')}
              className="inline-flex cursor-pointer items-center px-1 pt-1 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <Mic className="h-5 w-5 mr-1" />
              Voice Assistant
            </button>
            {user ? (
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-300 hover:text-pink-400 transition-colors cursor-pointer"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <LogIn className="h-5 w-5 mr-1" />
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-cyan-400 hover:bg-white/5 focus:outline-none transition-colors cursor-pointer"
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
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0F] border-b border-white/5">
          <div className="pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleProtectedAction('/chat')}
              className="flex items-center w-full pl-3 pr-4 py-3 text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Live Chat
            </button>
            <button
              onClick={() => handleProtectedAction('/dashboard')}
              className="flex items-center w-full pl-3 pr-4 py-3 text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => handleProtectedAction('/voice')}
              className="flex items-center w-full pl-3 pr-4 py-3 text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Mic className="h-5 w-5 mr-2" />
              Voice Assistant
            </button>
            {user ? (
              <button
                onClick={() => signOut()}
                className="flex items-center w-full pl-3 pr-4 py-3 text-base font-medium text-slate-300 hover:text-pink-400 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center w-full pl-3 pr-4 py-3 text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
