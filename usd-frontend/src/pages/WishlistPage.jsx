import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const translations = {
  fr: {
    title: "Mes Favoris",
    emptyTitle: "Votre liste est vide",
    emptyDesc: "Enregistrez vos produits préférés pour les retrouver ici.",
    explore: "Explorer le catalogue"
  },
  en: {
    title: "My Wishlist",
    emptyTitle: "Your wishlist is empty",
    emptyDesc: "Save your favorite products here to find them later.",
    explore: "Explore catalog"
  }
};

export default function WishlistPage() {
  const { lang } = useAuth();
  const t = translations[lang] || translations.fr;

  return (
    <div className="max-w-7xl mx-auto p-8 lg:p-12">
      <h1 className="text-4xl font-black text-brand-dark mb-12 tracking-tighter flex items-center gap-3">
        <Heart className="w-10 h-10 text-red-500 fill-red-500" /> {t.title}
      </h1>
      <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center space-y-6">
        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-300">
           <Heart className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-brand-dark">{t.emptyTitle}</h3>
          <p className="text-gray-400">{t.emptyDesc}</p>
        </div>
        <Link to="/" className="inline-block bg-brand-dark text-white px-8 py-3 rounded-full font-bold">{t.explore}</Link>
      </div>
    </div>
  );
}
