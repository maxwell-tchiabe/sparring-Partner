'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import {
  MessageSquare,
  BarChart2,
  Settings,
  User,
  Plus,
  Mic,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { ChatHistory } from '@/components/chat/ChatHistory';
import { supabase } from '@/lib/supabase';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { startNewSession } = useApp();
  const { user, userRole, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Don't render navigation on home or login pages
  if (pathname === '/' || pathname === '/login') {
    return null;
  }

  const handleNewChat = () => {
    startNewSession();
    router.push('/chat');
    if (isMobile) setIsOpen(false); // Close nav on mobile after selection
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    {
      name: 'Chat',
      href: '/chat',
      icon: MessageSquare,
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: BarChart2,
    },
    {
      name: 'Voice Assistant',
      href: '/voice',
      icon: Mic,
    },
    {
      name: 'Admin',
      href: '/admin',
      icon: Settings,
      adminOnly: true,
    },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 md:hidden m-4 p-2 rounded-lg ${
          isOpen ? 'right-4 bg-gray-800' : 'right-4 bg-indigo-600'
        } text-white shadow-lg transition-all`}
        aria-label="Toggle navigation"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Navigation sidebar */}
      <nav
        className={cn(
          'fixed md:relative flex flex-col h-screen bg-gray-900 text-white w-64 z-40 transition-transform duration-300 ease-in-out',
          isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0',
          isMobile && 'shadow-xl'
        )}
      >
        <div className="flex-shrink-0 p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">LangAI</h1>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-shrink-0 py-4">
            <ul className="space-y-2 px-2">
              {navItems.map((item) => {
                if (item.adminOnly && userRole !== 'admin') return null;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => isMobile && setIsOpen(false)}
                      className={cn(
                        'flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md transition-colors',
                        pathname === item.href && 'bg-gray-800 text-white'
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="px-2 py-2">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
            >
              <Plus className="mr-3 h-5 w-5" />
              <span>New Chat</span>
            </button>
          </div>

          <div className="flex-1 px-2 border-t border-gray-800">
            <ChatHistory />
          </div>
        </div>

        <div className="flex-shrink-0 p-4 border-t border-gray-800">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex cursor-pointer items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
            >
              <User className="mr-3 h-5 w-5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
