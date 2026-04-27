'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Spinner } from '@/components/logos/Spinner';
import { GoogleLogo } from '@/components/logos/GoogleLogo';

// Define validation schema
const authSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
});

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const router = useRouter();

  const { showNotification } = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    try {
      authSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = err.errors.reduce(
          (acc, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
          },
          {} as Record<string, string>
        );
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isForgotPassword) {
      if (!formData.email) {
        setErrors({ email: 'Email is required' });
        return;
      }
      setLoading(true);
      try {
        await resetPassword(formData.email);
        showNotification(
          'success',
          'Password reset link sent! Please check your email.'
        );
        setIsForgotPassword(false);
      } catch (err) {
        setErrors({
          form: err instanceof Error ? err.message : 'Failed to send reset link',
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        router.push('/chat');
      } else {
        await signUp(formData.email, formData.password);
        showNotification(
          'success',
          'Registration successful! Please check your email to verify your account.'
        );
      }
    } catch (err) {
      setErrors({
        form:
          err instanceof Error ? err.message : 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] perspective-1000">
      <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-3xl font-black text-center text-white mb-8 tracking-tight">
            {isForgotPassword ? 'Reset Access' : isLogin ? 'Sign In' : 'Create Account'}
          </h2>

          {errors.form && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl animate-in fade-in zoom-in duration-300">
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 bg-rose-500 rounded-full" />
                {errors.form}
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`block w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border ${
                    errors.email ? 'border-rose-500/50' : 'border-white/10 group-hover:border-white/20'
                  } rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all sm:text-sm`}
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-[11px] font-medium text-rose-400 ml-1">{errors.email}</p>
              )}
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-slate-500">
                    Password
                  </label>
                  {isLogin && (
                    <button 
                      type="button" 
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[10px] uppercase tracking-widest font-black text-cyan-500/70 hover:text-cyan-400 transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                    className={`block w-full pl-11 pr-12 py-3.5 bg-white/[0.03] border ${
                      errors.password ? 'border-rose-500/50' : 'border-white/10 group-hover:border-white/20'
                    } rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all sm:text-sm`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-[11px] font-medium text-rose-400 ml-1">{errors.password}</p>
                )}
                {!isLogin && !errors.password && (
                  <p className="mt-2 text-[10px] text-slate-500 leading-relaxed italic ml-1">
                    Combine 8+ characters, uppercase & numbers.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex cursor-pointer justify-center py-4 px-4 rounded-xl text-sm font-black uppercase tracking-widest text-white overflow-hidden transition-all active:scale-[0.98] disabled:opacity-70"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 group-hover:from-cyan-500 group-hover:to-blue-600 transition-all" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from),_transparent_70%)] transition-opacity" />
              
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <Spinner className="animate-spin h-4 w-4 text-white" />
                    Processing
                  </>
                ) : (
                  <>
                    {isForgotPassword ? 'Send Recovery Link' : isLogin ? 'Enter System' : 'Initialize Account'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {!isForgotPassword && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                  <span className="px-4 bg-[#0A0A0F] text-slate-500">Secure Link</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-300 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 hover:text-white transition-all active:scale-[0.98] cursor-pointer"
                >
                  <GoogleLogo className="w-4 h-4 mr-3" />
                  Auth with Google
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center flex flex-col gap-3">
            <button
               type="button"
               onClick={() => {
                 if (isForgotPassword) {
                   setIsForgotPassword(false);
                 } else {
                   setIsLogin(!isLogin);
                 }
                 setErrors({});
               }}
               className="text-xs font-bold text-slate-500 hover:text-cyan-400 transition-colors group cursor-pointer"
             >
               {isForgotPassword ? (
                 <>Back to <span className="text-cyan-500 group-hover:underline underline-offset-4 decoration-2 decoration-cyan-500/30">Sign In</span></>
               ) : isLogin ? (
                 <>New here? <span className="text-cyan-500 group-hover:underline underline-offset-4 decoration-2 decoration-cyan-500/30">Create an identity</span></>
               ) : (
                 <>Existing member? <span className="text-cyan-500 group-hover:underline underline-offset-4 decoration-2 decoration-cyan-500/30">Access system</span></>
               )}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
