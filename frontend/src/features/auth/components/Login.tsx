import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { useForm } from 'react-hook-form';
import type { LoginFormData, RegisterFormData } from '../types/auth.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from '../schemas/auth.schema';


const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);


  // 🔥 Dynamic schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  // 🔥 Submit handler
  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';

      await api.post(endpoint, data);

      // ✅ Fetch user from cookie session
      const { data: userRes } = await api.get('/auth/me');

      console.log('User:', userRes.data);

      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      navigate('/');

    } catch (error: any) {
      console.error('Auth Error:', error);
      toast.error(error.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Google login 
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const { code } = tokenResponse;

        await api.post('/auth/social-login', { code });

        const { data } = await api.get('/auth/me');

        console.log('User:', data.data);

        toast.success('Authenticated successfully!');
        navigate('/');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Google authentication failed.');
      } finally {
        setLoading(false);
      }
    },
    flow: 'auth-code',
  });


  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a] relative overflow-hidden px-4 font-sans selection:bg-blue-500/30">
      {/* Premium Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse delay-700" />

      {/* Subtle Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Content Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="w-full p-8 rounded-4xl border border-white/10 bg-white/2 backdrop-blur-3xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)] flex flex-col items-center">

          {/* Brand Identity */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] ring-1 ring-white/30 group transition-all duration-500 hover:scale-110 hover:rotate-3">
              <span className="text-white text-3xl font-black italic tracking-tighter group-active:scale-90 transition-transform">F</span>
            </div>
            <h1 className="text-4xl font-black mb-2 tracking-tight text-center bg-clip-text text-transparent bg-linear-to-b from-white to-white/50">
              {isLogin ? 'Welcome Back' : 'Join Fluxx Bite'}
            </h1>
            <p className="text-gray-400 text-sm text-center font-medium max-w-[240px] leading-relaxed">
              {isLogin
                ? 'Enter your credentials to access your global dashboard'
                : 'Start your journey with the next generation of marketplace systems'
              }
            </p>
          </div>

          {/* Local Auth Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 mb-8">
            {!isLogin && (
              <div className="space-y-1.5 transition-all duration-500 animate-in fade-in slide-in-from-top-4">
                <label htmlFor="name" className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <input
                    {...register('name' as any)}
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className={`w-full bg-white/3 border ${(errors as any).name ? 'border-red-500/50' : 'border-white/10'} text-white rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 ${(errors as any).name ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'} focus:border-blue-500/50 transition-all duration-300 placeholder:text-gray-700 font-medium`}
                    aria-invalid={(errors as any).name ? 'true' : 'false'}
                  />
                  {(errors as any).name && (
                    <p className="text-[11px] text-red-400 mt-1.5 ml-1 font-semibold animate-in fade-in slide-in-from-left-2">
                      {(errors as any).name?.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <input
                  {...register('email' as any)}
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full bg-white/3 border ${(errors as any).email ? 'border-red-500/50' : 'border-white/10'} text-white rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 ${(errors as any).email ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'} focus:border-blue-500/50 transition-all duration-300 placeholder:text-gray-700 font-medium`}
                  aria-invalid={(errors as any).email ? 'true' : 'false'}
                />
                {(errors as any).email && (
                  <p className="text-[11px] text-red-400 mt-1.5 ml-1 font-semibold animate-in fade-in slide-in-from-left-2">
                    {(errors as any).email?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="password" className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                {isLogin && (
                  <button type="button" className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative group">
                <input
                  {...register('password' as any)}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-white/3 border ${(errors as any).password ? 'border-red-500/50' : 'border-white/10'} text-white rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 ${(errors as any).password ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'} focus:border-blue-500/50 transition-all duration-300 placeholder:text-gray-700 font-medium`}
                  aria-invalid={(errors as any).password ? 'true' : 'false'}
                />
                {(errors as any).password && (
                  <p className="text-[11px] text-red-400 mt-1.5 ml-1 font-semibold animate-in fade-in slide-in-from-left-2">
                    {(errors as any).password?.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-white text-black py-4 px-6 rounded-2xl font-black tracking-tight transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] hover:shadow-[0_20px_40px_-5px_rgba(255,255,255,0.3)] mt-4"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-3 border-black/10 border-t-black rounded-full animate-spin" />
                    Validating...
                  </>
                ) : (
                  isLogin ? 'Sign In to Portal' : 'Create My Account'
                )}
                {!loading && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12h14m-7-7l7 7-7 7" />
                  </svg>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="w-full flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">Partner Access</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Social Auth Button */}
          <button
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            className="w-full group flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 active:scale-[0.98] border border-white/10 hover:border-white/20 shadow-lg"
          >
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>
            <span className="text-sm">Sign in with Google</span>
          </button>

          {/* Mode Switcher */}
          <div className="mt-10 pt-6 border-t border-white/5 w-full flex justify-center">
            <p className="text-gray-400 text-sm font-medium">
              {isLogin ? "Need a partner account?" : "Already have access?"}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white hover:text-blue-400 font-bold transition-all underline decoration-white/20 underline-offset-8 hover:decoration-blue-400/50"
              >
                {isLogin ? 'Request Access' : 'Sign In Instead'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer Security Note */}
        <div className="mt-8 flex flex-col items-center gap-3 opacity-60">
          <div className="flex items-center gap-3 py-1.5 px-3 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Secure Authentication Node</span>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Credits */}
      <footer className="absolute bottom-8 text-gray-600 font-mono text-[10px] tracking-widest uppercase opacity-40 select-none">
        &copy; 2026 Fluxx Bite • Neural Marketplace Ecosystems
      </footer>
    </div>
  );
};

export default Login;