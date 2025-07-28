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
import { LogoA } from '../logos/LogoA';

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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <div className="flex items-center">
                  <LogoA
                    width={100}
                    height={100}
                    className="hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-xl font-bold text-gray-900">LangAI</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => handleProtectedAction('/chat')}
              className="inline-flex cursor-pointer items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              <MessageSquare className="h-5 w-5 mr-1" />
              Live Chat
            </button>
            <button
              onClick={() => handleProtectedAction('/dashboard')}
              className="inline-flex cursor-pointer items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              <BarChart2 className="h-5 w-5 mr-1" />
              Dashboard
            </button>
            <button
              onClick={() => handleProtectedAction('/voice')}
              className="inline-flex cursor-pointer items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              <Mic className="h-5 w-5 mr-1" />
              Voice Assistant
            </button>
            {user ? (
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
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
        <div className="md:hidden bg-white shadow-md">
          <div className="pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleProtectedAction('/chat')}
              className="flex items-center w-full pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Live Chat
            </button>
            <button
              onClick={() => handleProtectedAction('/dashboard')}
              className="flex items-center w-full pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => handleProtectedAction('/voice')}
              className="flex items-center w-full pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
            >
              <Mic className="h-5 w-5 mr-2" />
              Voice Assistant
            </button>
            {user ? (
              <button
                onClick={() => signOut()}
                className="flex items-center w-full pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center w-full pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
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
