'use client';
import { ChatHistory } from '@/components/chat/ChatHistory';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  BarChart2,
  LogOut,
  Menu,
  MessageSquare,
  Mic,
  MoreVertical,
  Plus,
  Send,
  Settings,
  Smartphone,
  User,
  X,
  BrainCircuit,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ComingSoonBadge } from './ComingSoonBadge';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { startNewSession } = useApp();
  const { user, userRole, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuRef]);

  if (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/reset-password' ||
    pathname === '/terms' ||
    pathname === '/privacy' ||
    pathname === '/impressum'
  ) {
    return null;
  }

  const handleNewChat = async () => {
    const sessionId = await startNewSession();
    router.push(`/chat/${sessionId}`);
    if (isMobile) setIsOpen(false);
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
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart2 },
    { name: 'Voice Assistant', href: '/voice', icon: Mic },
    { name: 'Admin', href: '/admin', icon: Settings, adminOnly: true },
  ];

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitials = (userName[0] || '').toUpperCase();

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 md:hidden m-4 p-2 rounded-lg ${
          isOpen
            ? 'right-4 bg-slate-800 border border-white/10'
            : 'right-4 bg-gradient-to-br from-cyan-500 to-indigo-600'
        } text-white shadow-lg transition-all cursor-pointer`}
        aria-label="Toggle navigation"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Navigation sidebar */}
      <nav
        className={cn(
          'fixed md:relative flex flex-col h-screen bg-[#0A0A0F] border-r border-white/5 text-white w-64 z-40 transition-transform duration-300 ease-in-out',
          isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0',
          isMobile && 'shadow-2xl'
        )}
      >
        {/* Logo area */}
        <div className="flex-shrink-0 p-4 border-b border-white/5 flex items-center">
          <div className="relative">
            <img
              src="/evochat_logo.png"
              alt="EvoChat Logo"
              className="h-8 w-8 mr-3 object-contain rounded-md shadow-[0_0_12px_-2px_rgba(6,182,212,0.5)]"
            />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">EvoChat</h1>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Nav items */}
          <div className="flex-shrink-0 py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => {
                if (item.adminOnly && userRole !== 'admin') return null;
                const isActive = pathname === item.href;
                const isComingSoon = item.name === 'Voice Assistant';

                const content = (
                  <>
                    <item.icon className={cn('mr-3 h-5 w-5', isActive ? 'text-cyan-400' : 'text-slate-500', isComingSoon && 'text-slate-700')} />
                    <span>{item.name}</span>
                    {isComingSoon && <ComingSoonBadge />}
                    {isActive && !isComingSoon && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                    )}
                  </>
                );

                return (
                  <li key={item.name}>
                    {isComingSoon ? (
                      <div className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 cursor-not-allowed select-none transition-all duration-200">
                        {content}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => isMobile && setIsOpen(false)}
                        className={cn(
                          'flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-600/10 text-cyan-400 border border-cyan-500/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        )}
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* New Chat button */}
          <div className="px-2 py-2">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl transition-all duration-200 cursor-pointer group"
            >
              <Plus className="mr-3 h-5 w-5 text-cyan-500 group-hover:rotate-90 transition-transform duration-300" />
              <span>New Session</span>
            </button>
          </div>

          {/* Chat history */}
          <div className="flex-1 px-2 border-t border-white/5 overflow-hidden">
            <ChatHistory onChatSelect={() => isMobile && setIsOpen(false)} />
          </div>
        </div>

        {/* User Profile Section */}
        <div ref={profileMenuRef} className="relative p-3 border-t border-white/5">
          {isProfileMenuOpen && (
            <div className="absolute bottom-full mb-2 left-3 right-3 bg-[#0F111A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
              <ul className="text-sm text-slate-300 p-1">
                <li>
                  <div className="flex items-center px-4 py-3 text-slate-600 cursor-not-allowed select-none">
                    <Smartphone className="w-4 h-4 mr-3 text-slate-700" />
                    <span>Download App</span>
                    <ComingSoonBadge />
                  </div>
                </li>
                <li>
                  <div className="flex items-center px-4 py-3 text-slate-600 cursor-not-allowed select-none">
                    <Settings className="w-4 h-4 mr-3 text-slate-700" />
                    <span>Settings</span>
                    <ComingSoonBadge />
                  </div>
                </li>
                <li>
                  <div className="flex items-center px-4 py-3 text-slate-600 cursor-not-allowed select-none">
                    <Send className="w-4 h-4 mr-3 text-slate-700" />
                    <span>Contact us</span>
                    <ComingSoonBadge />
                  </div>
                </li>
                <li className="border-t border-white/5 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-pink-400 hover:bg-pink-500/10 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span>Log out</span>
                  </button>
                </li>
              </ul>
            </div>
          )}

          {user ? (
            <button
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              className="w-full flex items-center text-left rounded-xl hover:bg-white/5 p-2 transition-colors cursor-pointer"
            >
              <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-[0_0_10px_-2px_rgba(6,182,212,0.4)]">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0 ml-3">
                <p className="text-sm font-medium truncate text-slate-200">{userName}</p>
                <p className="text-xs text-slate-500 truncate">Active</p>
              </div>
              <MoreVertical className="w-4 h-4 text-slate-500 ml-2 flex-shrink-0" />
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center px-4 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <User className="mr-3 h-5 w-5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}