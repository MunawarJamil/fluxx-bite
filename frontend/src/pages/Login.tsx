import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const { code } = tokenResponse;
        const response = await api.post('/auth/social-login', { code });

        if (response.data.success) {
          localStorage.setItem('user', JSON.stringify(response.data.data));
          toast.success('Authenticated successfully!');
          navigate('/');
        }
      } catch (error: any) {
        console.error('Login Error:', error);
        toast.error(error.response?.data?.message || 'Google authentication failed.');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Login Error:', error);
      toast.error('Google authentication was interrupted.');
    },
    flow: 'auth-code',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await api.post(endpoint, payload);

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Auth Error:', error);
      toast.error(error.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/10 ring-1 ring-white/20">
            <span className="text-white text-2xl font-black italic tracking-tighter">F</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-400 text-sm text-center mb-8 font-medium">
            {isLogin 
              ? 'Log in to access your dashboard' 
              : 'Join Fluxx Bite to get started'
            }
          </p>

          {/* Local Auth Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4 mb-6">
            {!isLogin && (
              <div className="transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/3 border border-white/10 text-white rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
                />
              </div>
            )}
            
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-white/3 border border-white/10 text-white rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
            />
            
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-white/3 border border-white/10 text-white rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-6 rounded-xl font-bold tracking-wide transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="w-full flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Or Continue With</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {/* Social Auth Button */}
          <button
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            className="w-full group flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-black py-3.5 px-6 rounded-xl font-bold transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-xl"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google OAuth
          </button>

          {/* Mode Switcher */}
          <p className="mt-8 text-gray-400 text-sm font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white hover:text-blue-400 font-bold transition-colors underline decoration-white/20 underline-offset-4"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

        {/* Footer Security Note */}
        <div className="mt-8 flex flex-col items-center gap-2 opacity-40">
           <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Secure & Encrypted Session
          </div>
        </div>
      </div>

      {/* Decorative Bottom Credits */}
      <footer className="absolute bottom-6 text-gray-600 font-mono text-[9px] tracking-thinner uppercase opacity-40">
        &copy; 2026 Fluxx Bite • Advanced Marketplace Systems
      </footer>
    </div>
  );
};

export default Login;