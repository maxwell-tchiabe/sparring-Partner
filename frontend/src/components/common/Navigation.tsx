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
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { startNewSession } = useApp();
  const { user, userRole, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  // Close profile menu on outside click
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

  // Don't render navigation on home or login pages
  if (pathname === '/' || pathname === '/login') {
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

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitials = (userName[0] || '').toUpperCase();

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

        {/* User Profile Section */}
        <div ref={profileMenuRef} className="relative p-4 border-t border-gray-800">
          {isProfileMenuOpen && (
            <div className="absolute bottom-full mb-2 w-[calc(100%-2rem)] bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <ul className="text-sm text-gray-300">
                <li>
                  <Link
                    href="#"
                    className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
                  >
                    <Smartphone className="w-5 h-5 mr-3" />
                    <span>Download mobile App</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    <span>Settings</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
                  >
                    <Send className="w-5 h-5 mr-3" />
                    <span>Contact us</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 bg-gray-700/50 hover:bg-gray-700 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>Log out</span>
                  </button>
                </li>
              </ul>
            </div>
          )}

          {user ? (
            <button
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              className="w-full flex items-center text-left rounded-md hover:bg-gray-800 p-2 transition-colors"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0 ml-3">
                <p className="text-sm font-medium truncate">{userName}</p>
              </div>
              <MoreVertical className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
            </button>
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