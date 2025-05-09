"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MessageSquare, BarChart2, Settings, User, Plus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { ChatHistory } from '@/components/chat/ChatHistory';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, startNewSession } = useApp();

  const handleNewChat = () => {
    startNewSession();
    router.push('/chat');
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
      name: 'Admin',
      href: '/admin',
      icon: Settings,
      adminOnly: true,
    },
  ];

  return (    <nav className="flex flex-col h-screen bg-gray-900 text-white w-64">
      <div className="flex-shrink-0 p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Language Assistant</h1>
      </div>
        <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-shrink-0 py-4">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => {
              // Skip admin items for non-admin users
              if (item.adminOnly && user?.role !== 'admin') {
                return null;
              }
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
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
            className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
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
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
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
  );
}
