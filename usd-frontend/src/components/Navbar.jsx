import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Menu, X, Heart, User, MessageSquare, Search } from 'lucide-react';

export default function Navbar() {
  const { user, logout, lang, changeLang } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black text-brand-dark tracking-tighter">
          USD<span className="text-brand-accent">.Pro</span>
        </Link>

        {/* NAVIGATION DESKTOP: Central Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-brand-dark">Accueil</Link>
          <Link to="/catalog" className="text-sm font-semibold text-gray-700 hover:text-brand-dark">Catalogue</Link>
          <Link to="/about" className="text-sm font-semibold text-gray-700 hover:text-brand-dark">À propos</Link>
        </div>

        {/* NAVIGATION DESKTOP: Right Utility Controls */}
        <div className="hidden md:flex items-center space-x-5">
          <button className="text-gray-400 hover:text-brand-dark cursor-pointer"><Search className="w-5 h-5" /></button>
          <Link to="/wishlist" className="text-gray-400 hover:text-red-500" title="Favoris"><Heart className="w-5 h-5" /></Link>
          <Link to="/cart" className="relative text-gray-400 hover:text-brand-dark" title="Panier">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-brand-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">2</span>
          </Link>
          
          {user && user.role !== 'admin' && (
            <Link to="/messages" className="text-gray-400 hover:text-brand-dark" title="Messagerie">
              <MessageSquare className="w-5 h-5" />
            </Link>
          )}

          {/* Toggle Langue */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button onClick={() => changeLang('fr')} className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all ${lang === 'fr' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'} cursor-pointer`}>FR</button>
            <button onClick={() => changeLang('en')} className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all ${lang === 'en' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'} cursor-pointer`}>EN</button>
          </div>

          {/* Authentification */}
          {user ? (
            <div className="flex items-center gap-4 border-l pl-4 border-gray-100">
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm font-bold text-brand-accent hover:underline">Admin</Link>
              )}
              <span className="text-sm font-bold text-gray-700">Hi, {user.first_name}</span>
              <button onClick={handleLogout} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-100 transition cursor-pointer">
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l pl-4 border-gray-100">
              <Link to="/login" className="text-gray-400 hover:text-brand-dark transition-colors" title="Connexion">
                <User className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE HAMBURGER MENU BUTTON */}
        <button 
          onClick={toggleMenu} 
          className="md:hidden p-2 text-gray-500 hover:text-brand-dark focus:outline-none cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6 animate-fadeIn" /> : <Menu className="w-6 h-6 animate-fadeIn" />}
        </button>

      </div>

      {/* MOBILE DROPDOWN DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg z-50 animate-fadeIn">
          <div className="px-5 pt-3 pb-8 space-y-5 flex flex-col">
            
            {/* Main Links */}
            <div className="flex flex-col space-y-3 font-semibold text-gray-600 border-b border-gray-100 pb-4">
              <Link to="/" onClick={toggleMenu} className="hover:text-brand-dark py-1">Accueil</Link>
              <Link to="/catalog" onClick={toggleMenu} className="hover:text-brand-dark py-1">Catalogue</Link>
              <Link to="/about" onClick={toggleMenu} className="hover:text-brand-dark py-1">À propos</Link>
            </div>

            {/* Client Utility Panel */}
            <div className="flex flex-col space-y-4">
              <Link to="/wishlist" onClick={toggleMenu} className="flex items-center gap-2.5 text-gray-500 font-bold">
                <Heart className="w-5 h-5 text-gray-400" />
                <span>Favoris</span>
              </Link>
              <Link to="/cart" onClick={toggleMenu} className="flex items-center justify-between text-gray-500 font-bold">
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                  <span>Panier</span>
                </div>
                <span className="bg-brand-accent text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-sm">2</span>
              </Link>
              {user && user.role !== 'admin' && (
                <Link to="/messages" onClick={toggleMenu} className="flex items-center gap-2.5 text-gray-500 font-bold">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <span>Messagerie</span>
                </Link>
              )}
            </div>

            {/* Language switch on Mobile */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-xs font-semibold text-gray-400">Language</span>
              <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button onClick={() => { changeLang('fr'); toggleMenu(); }} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'fr' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'} cursor-pointer`}>FR</button>
                <button onClick={() => { changeLang('en'); toggleMenu(); }} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'en' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'} cursor-pointer`}>EN</button>
              </div>
            </div>

            {/* Session Actions on Mobile */}
            <div className="border-t border-gray-100 pt-4">
              {user ? (
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">Hi, {user.first_name}</span>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={toggleMenu} className="text-xs font-bold text-brand-accent hover:underline">Admin</Link>
                    )}
                  </div>
                  <button onClick={handleLogout} className="w-full text-center py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition cursor-pointer">
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={toggleMenu} className="text-center py-3 bg-gray-50 rounded-xl font-bold text-gray-700 hover:bg-gray-100">Connexion</Link>
                  <Link to="/register" onClick={toggleMenu} className="text-center py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-black">S'inscrire</Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
