import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, api } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, Sun, Moon } from 'lucide-react';

const translations = {
  fr: {
    title: "Welcome Back",
    subtitle: "Hello!",
    email: "Email",
    password: "Mot de passe",
    loading: "Connexion...",
    login: "Sign In",
    errorNetwork: "Une erreur réseau est survenue.",
    noAccount: "Don’t have an account?",
    registerLink: "Create Account",
    recoverPass: "Recover Password?",
    divider: "Or continue with"
  },
  en: {
    title: "Welcome Back",
    subtitle: "Hello!",
    email: "Email",
    password: "Password",
    loading: "Signing in...",
    login: "Sign In",
    errorNetwork: "A network error occurred.",
    noAccount: "Don’t have an account?",
    registerLink: "Create Account",
    recoverPass: "Recover Password?",
    divider: "Or continue with"
  }
};

export default function LoginPage() {
  const { lang, setUser } = useAuth();
  const t = translations[lang] || translations.fr;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', { email, password });

      if (res.data.success) {
        setUser(res.data.user || { 
          email, 
          first_name: email.split('@')[0], 
          role: (email && (email.toLowerCase() === 'janesgiges23@gmail.com' || email.toLowerCase() === 'epolegeorgesroland@gmail.com')) ? 'admin' : 'client' 
        });
        localStorage.setItem('accessToken', res.data.token || res.data.access_token);
        
        // Redirection conditionnelle
        if (res.data.user?.role === 'admin') {
          navigate('/admin');
        } else {
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(t.errorNetwork);
      }
    } finally {
      setLoading(false);
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 dark:bg-brand-dark bg-gray-50 transition-colors duration-500 relative overflow-hidden select-none">
      
      {/* Ambient glowing sphere background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 pointer-events-none filter blur-[80px] dark:block hidden"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/10 pointer-events-none filter blur-[80px] dark:block hidden"></div>

      {/* Theme Switcher floating top right */}
      <button 
        type="button"
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-slate-800 dark:text-yellow-400 hover:scale-105 transition duration-300 cursor-pointer shadow-sm z-50"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Central Split-Screen Card */}
      <div className="w-full max-w-[1200px] min-h-[700px] bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-[30px] shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 animate-fadeIn">
        
        {/* Left Section (55% width, Cyberpunk Art Image) */}
        <div className="hidden md:flex md:w-[55%] relative overflow-hidden bg-white dark:bg-[#121212]/40">
          <img 
            src="https://img.freepik.com/premium-vector/scalable-hand-drawn-icon-depicting-financial-stability_67813-17465.jpg?w=2000" 
            alt="Financial Stability Tech Illustration"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          {/* Glass Overlay Gradient with neon purple/blue/orange values */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/50 via-blue-900/30 to-orange-600/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent"></div>
        </div>

        {/* Right Section (45% width, Login Form) */}
        <div className="w-full md:w-[45%] p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-[#121212]/40 backdrop-blur-md rounded-r-[30px]">
          
          <div className="space-y-6">
            <header className="space-y-1">
              <span className="text-sm font-semibold text-brand-accent dark:text-purple-400">{t.subtitle}</span>
              <h2 className="text-4xl font-extrabold tracking-tighter text-slate-800 dark:text-white">{t.title}</h2>
            </header>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input with absolute icon */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.email}</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@usd.com" 
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:focus:ring-brand-purple focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 transition duration-300"
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Password Input with absolute Lock and Eye icon */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.password}</label>
                  <a href="#" className="text-xs text-brand-accent dark:text-purple-400 hover:underline">{t.recoverPass}</a>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-12 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:focus:ring-brand-purple focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 transition duration-300"
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  {/* Eye toggle button */}
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3 text-gray-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Sign In Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-slate-900 dark:bg-white text-white dark:text-brand-dark rounded-2xl font-bold hover:shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.loading : t.login}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200 dark:border-white/10"></div>
              <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.divider}</span>
              <div className="flex-1 border-t border-gray-200 dark:border-white/10"></div>
            </div>

            {/* Socials */}
            <div className="flex justify-center">
                {/* Bouton Google */}
                <button 
                    onClick={() => window.location.href = `${API_BASE_URL}/oauth2/authorization/google`}
                    className="w-full py-3 bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl flex justify-center items-center hover:bg-gray-100 dark:hover:bg-white/10 transition backdrop-blur-sm">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Google</span>
                </button>
            </div>

            {/* Bottom redirect */}
            <p className="text-center text-sm text-slate-500 mt-8">
              {t.noAccount} <Link to="/register" className="text-brand-accent dark:text-purple-400 font-bold hover:underline ml-1">{t.registerLink}</Link>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
