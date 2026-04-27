'use client';

import { Layout } from '@/components/layout/Layout';
import { Sparkles, FileText } from 'lucide-react';

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, subtitle, lastUpdated, children }: LegalLayoutProps) {
  return (
    <Layout>
      <div className="min-h-screen bg-[#05050A] text-slate-300">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <header className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <FileText className="w-3 h-3 text-violet-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">Legal Document</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 italic">
              {title}
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto italic">
              {subtitle}
            </p>
            {lastUpdated && (
              <div className="mt-8 text-[10px] font-bold text-slate-600 uppercase tracking-widest border-t border-white/5 pt-4 inline-block">
                Last Updated: {lastUpdated}
              </div>
            )}
          </header>

          <main className="prose prose-invert prose-slate max-w-none 
            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
            prose-p:leading-relaxed prose-p:text-slate-400
            prose-li:text-slate-400
            prose-strong:text-violet-400 prose-strong:font-bold
            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
          ">
            {children}
          </main>

          <div className="mt-20 pt-10 border-t border-white/5 text-center">
            <div className="inline-flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <p className="text-sm text-slate-500 text-left leading-relaxed">
                EvoChat is committed to transparency and data sovereignty. <br />
                If you have questions about these documents, please <span className="text-violet-400">contact our legal desk</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
