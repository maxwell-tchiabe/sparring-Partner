'use client';

import { AuthForm } from '@/components/auth/AuthForm';
import { Layout } from '@/components/layout/Layout';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#05050A] p-8">
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Personal Access</span>
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
                Welcome Back
              </h1>
              <p className="text-lg text-slate-500 mt-4 font-medium max-w-md mx-auto leading-relaxed">
                Continue your cognitive language journey with EvoChat's AI-powered sparring partner.
              </p>
            </div>
          </header>

          <main className="flex justify-center pb-20">
            <AuthForm />
          </main>
        </div>
      </div>
    </Layout>
  );
}
