import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';
import { Navigation } from '@/components/common/Navigation';
import { NotificationProvider } from '@/contexts/NotificationContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Language Learning Assistant',
  description:
    'AI-powered language learning platform with multimodal input and personalized learning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <NotificationProvider>
            <div className="flex h-screen overflow-hidden">
              <Navigation />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </NotificationProvider>
        </AppProvider>
      </body>
    </html>
  );
}
