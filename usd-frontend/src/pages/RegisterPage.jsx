import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, api } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Sun, Moon } from 'lucide-react';

const translations = {
  fr: {
    title: "Rejoignez-nous.",
    subtitle: "Créez votre compte USD Pro.",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email",
    password: "Mot de passe",
    passwordPlaceholder: "Min. 8 caractères",
    loading: "Création en cours...",
    register: "Créer mon compte",
    hasAccount: "Déjà un compte ?",
    loginLink: "Se connecter",
    errorDefault: "Une erreur est survenue lors de l'inscription.",
    divider: "Ou continuer avec"
  },
  en: {
    title: "Join us.",
    subtitle: "Create your USD Pro account.",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    password: "Password",
    passwordPlaceholder: "Min. 8 characters",
    loading: "Creating account...",
    register: "Create account",
    hasAccount: "Already have an account?",
    loginLink: "Log in",
    errorDefault: "An error occurred during registration.",
    divider: "Or continue with"
  }
};

export default function RegisterPage() {
  const { lang } = useAuth();
  const t = translations[lang] || translations.fr;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/register', formData);

      if (response.data.success) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(t.errorDefault);
      }
    } finally {
      setLoading(false);
    }
  };

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
        
        {/* Left Section (55% width, Illustration Image) */}
        <div className="hidden md:flex md:w-[55%] relative overflow-hidden bg-white dark:bg-[#121212]/40">
          <img 
            src="https://img.freepik.com/premium-vector/scalable-hand-drawn-icon-depicting-financial-stability_67813-17465.jpg?w=2000" 
            alt="Financial Stability Tech Illustration"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          {/* Glass Overlay Gradient with neon purple/blue/orange values */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-blue-900/20 to-orange-600/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent"></div>
        </div>

        {/* Right Section (45% width, Registration Form) */}
        <div className="w-full md:w-[45%] p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-[#121212]/40 backdrop-blur-md rounded-r-[30px]">
          
          <div className="space-y-6">
            <header className="space-y-1">
              <span className="text-sm font-semibold text-brand-accent dark:text-purple-400">Hello!</span>
              <h2 className="text-4xl font-extrabold tracking-tighter text-slate-800 dark:text-white">{t.title}</h2>
              <p className="text-sm text-gray-500">{t.subtitle}</p>
            </header>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* First Name & Last Name Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.firstName}</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="John" 
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:focus:ring-brand-purple focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 transition duration-300"
                    />
                    <div className="absolute left-4 top-3.5 text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.lastName}</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Doe" 
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:focus:ring-brand-purple focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 transition duration-300"
                    />
                    <div className="absolute left-4 top-3.5 text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Input with absolute icon */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.email}</label>
                <div className="relative">
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com" 
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:focus:ring-brand-purple focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 transition duration-300"
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Password Input with absolute Lock and Eye icon */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.password}</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password"
                    required
                    minLength="8"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t.passwordPlaceholder} 
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

              {/* Register Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-slate-900 dark:bg-white text-white dark:text-brand-dark rounded-2xl font-bold hover:shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.loading : t.register}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200 dark:border-white/10"></div>
              <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.divider}</span>
              <div className="flex-1 border-t border-gray-200 dark:border-white/10"></div>
            </div>

            {/* Socials */}
            <div className="grid grid-cols-3 gap-4">
              {/* Google */}
              <button className="py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition flex items-center justify-center cursor-pointer">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
              </button>
              {/* Apple */}
              <button className="py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition flex items-center justify-center cursor-pointer">
                <svg className="w-5 h-5 text-slate-800 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.64.73-1.2 1.87-1.05 2.97 1.1.09 2.25-.56 3-1.41z"/>
                </svg>
              </button>
              {/* Facebook */}
              <button className="py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition flex items-center justify-center cursor-pointer">
                <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>

            {/* Bottom redirect */}
            <p className="text-center text-sm text-slate-500 mt-8">
              {t.hasAccount} <Link to="/login" className="text-brand-accent dark:text-purple-400 font-bold hover:underline ml-1">{t.loginLink}</Link>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
