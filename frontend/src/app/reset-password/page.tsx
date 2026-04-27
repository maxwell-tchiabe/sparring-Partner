'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { Spinner } from '@/components/logos/Spinner';

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { updatePassword, session, loading: authLoading } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();

  // Show nothing or a spinner while auth is initializing
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#05050A]">
          <Spinner className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
      </Layout>
    );
  }

  // Handle case where session is truly missing after initialization
  if (!session) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#05050A] p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Recovery Session Missing</h1>
          <p className="text-slate-500 max-w-sm mb-10 leading-relaxed font-medium">
            We couldn't find a valid reset session. Your link may have expired or was already used.
          </p>
          <button 
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all cursor-pointer"
          >
            Back to Portal
          </button>
        </div>
      </Layout>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      passwordSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = err.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {} as Record<string, string>);
        setErrors(newErrors);
      }
      return;
    }

    setLoading(true);
    try {
      await updatePassword(formData.password);
      showNotification('success', 'Password updated successfully! You can now sign in.');
      router.push('/login');
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : 'Failed to update password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#05050A] p-8">
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mx-auto">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Security Override</span>
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
                New Identity
              </h1>
              <p className="text-lg text-slate-500 mt-4 font-medium max-w-md mx-auto leading-relaxed">
                Define your new access credentials to regain control of your cognitive ecosystem.
              </p>
            </div>
          </header>

          <main className="flex justify-center pb-20">
            <div className="w-full max-w-[440px]">
              <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {errors.form && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl">
                      {errors.form}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                      New Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="block w-full pl-11 pr-12 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all sm:text-sm"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[11px] text-rose-400 ml-1">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                      Confirm New Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="block w-full pl-11 pr-12 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all sm:text-sm"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[11px] text-rose-400 ml-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex cursor-pointer justify-center py-4 px-4 rounded-xl text-sm font-black uppercase tracking-widest text-white overflow-hidden transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-700 group-hover:from-indigo-500 group-hover:to-violet-600 transition-all" />
                    <span className="relative flex items-center gap-2">
                      {loading ? (
                        <>
                          <Spinner className="animate-spin h-4 w-4 text-white" />
                          Updating...
                        </>
                      ) : (
                        <>
                          Update Password
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
