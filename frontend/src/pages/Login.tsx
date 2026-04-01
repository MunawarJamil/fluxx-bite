import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { code } = tokenResponse;

        // Send the authorization code to the backend
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/social-login`, {
          code,
        });

        if (response.data.success) {
          // Store token in localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.data));

          toast.success('Logged in successfully!');
          navigate('/');
        }
      } catch (error: any) {
        console.error('Login Error:', error);
        toast.error(error.response?.data?.message || 'Google login failed. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Google Login Error:', error);
      toast.error('Google login was interrupted.');
    },
    flow: 'auth-code',
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a] relative overflow-hidden px-4">
      {/* Background Gradients for Premium Feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md p-8 rounded-3xl border border-white/5 bg-white/[0.03] backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col items-center relative z-10">
        {/* Logo/Brand Icon Placeholder */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
          <span className="text-white text-3xl font-bold tracking-tight">F</span>
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome Back</h1>
        <p className="text-gray-400 text-center mb-8 font-medium">
          Access your account instantly through Google authentication
        </p>

        {/* Social Login Button */}
        <button
          onClick={() => handleLogin()}
          className="w-full group relative flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-white/10"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0 transition-transform group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {/* Footer Info */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-semibold">
            <span className="w-8 h-px bg-white/10" />
            Secure & Encrypted
            <span className="w-8 h-px bg-white/10" />
          </div>
          <p className="text-[10px] text-gray-600 text-center max-w-[240px] leading-relaxed">
            By continuing, you agree to our <span className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors underline decoration-dotted">Terms of Service</span> and <span className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors underline decoration-dotted">Privacy Policy</span>.
          </p>
        </div>
      </div>

      {/* Decorative Bottom Text */}
      <footer className="mt-12 text-gray-600 font-mono text-[10px] tracking-thinner uppercase opacity-40">
        Fluxx Bite &copy; 2026 • Advanced Authentication System
      </footer>
    </div>
  );
};

export default Login;