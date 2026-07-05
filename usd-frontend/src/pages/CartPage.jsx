import { useState } from 'react';
import { ShoppingBag, Trash2, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const translations = {
  fr: {
    title: "Votre Panier",
    qty: "Quantité",
    summary: "Résumé de la commande",
    subtotal: "Sous-total",
    shipping: "Livraison",
    free: "Gratuit",
    total: "Total",
    checkout: "Procéder au paiement",
    loadingAuth: "Vérification de l'authentification...",
    emptyCartTitle: "Votre panier est vide",
    emptyCartDesc: "Découvrez nos produits sur le catalogue.",
    purchaseViaChat: "Négocier & Acheter par Messagerie"
  },
  en: {
    title: "Your Cart",
    qty: "Quantity",
    summary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    total: "Total",
    checkout: "Proceed to checkout",
    loadingAuth: "Verifying authentication...",
    emptyCartTitle: "Your cart is empty",
    emptyCartDesc: "Check out our catalog for awesome products.",
    purchaseViaChat: "Negotiate & Purchase via Chat"
  }
};

export default function CartPage() {
  const { lang, user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const t = translations[lang] || translations.fr;

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'MacBook Pro M3',
      quantity: 1,
      price: 199900,
      image: '/hero-laptop.png'
    }
  ]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div>
        <p className="text-gray-500 font-semibold">{t.loadingAuth}</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const formatPrice = (cents) => new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { style: 'currency', currency: 'EUR' }).format(cents / 100);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChatPurchase = () => {
    const message = lang === 'fr'
      ? `Bonjour ! Je souhaite finaliser l'achat des produits de mon panier : \n${cartItems.map(item => `- ${item.name} (Quantité: ${item.quantity})`).join('\n')}\nMontant Total: ${formatPrice(subtotal)}. Merci !`
      : `Hello! I would like to complete my purchase for the items in my cart: \n${cartItems.map(item => `- ${item.name} (Qty: ${item.quantity})`).join('\n')}\nTotal Amount: ${formatPrice(subtotal)}. Thank you!`;
      
    navigate('/messages', { state: { initialMsg: message } });
  };

  return (
    <div className="max-w-7xl mx-auto p-8 lg:p-12 animate-fadeIn">
      <h1 className="text-4xl font-black text-brand-dark mb-12 tracking-tighter flex items-center gap-3">
        <ShoppingBag className="w-10 h-10" /> {t.title}
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-brand-dark mb-2">{t.emptyCartTitle}</h2>
          <p className="text-gray-400">{t.emptyCartDesc}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Cart Content */}
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center p-2">
                     <img src={item.image} alt={item.name} className="object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark">{item.name}</h3>
                    <p className="text-gray-400 text-sm">{t.qty}: {item.quantity}</p>
                    <p className="text-brand-accent font-black mt-1">{formatPrice(item.price)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCartItems([])} 
                  className="text-red-400 hover:bg-red-50 p-3 rounded-2xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-5 h-5"/>
                </button>
              </div>
            ))}
          </div>
          
          {/* Right Column: Order summary and Chat action */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-fit space-y-6">
            <h3 className="text-xl font-bold text-brand-dark">{t.summary}</h3>
            <div className="space-y-3 border-b border-gray-100 pb-6 text-gray-600">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.shipping}</span>
                <span className="text-green-500 font-bold">{t.free}</span>
              </div>
            </div>
            <div className="flex justify-between text-2xl font-black text-brand-dark mb-6">
              <span>{t.total}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            <button 
              onClick={handleChatPurchase}
              className="w-full py-4 bg-brand-dark hover:bg-gray-800 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98] cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{t.purchaseViaChat}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
