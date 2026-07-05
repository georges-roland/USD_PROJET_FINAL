import { useState, useEffect } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const translations = {
  fr: {
    title: "Mon Profil",
    subtitle: "Gérez vos informations et consultez votre historique d'achats.",
    personalInfo: "Informations Personnelles",
    firstName: "Prénom :",
    lastName: "Nom :",
    email: "Email :",
    orderHistory: "Historique des Commandes",
    loading: "Chargement de vos commandes...",
    emptyOrders: "Vous n'avez pas encore passé de commande.",
    orderPlaced: "Commande passée le ",
    ref: "Ref:"
  },
  en: {
    title: "My Profile",
    subtitle: "Manage your details and view your purchase history.",
    personalInfo: "Personal Information",
    firstName: "First Name:",
    lastName: "Last Name:",
    email: "Email:",
    orderHistory: "Order History",
    loading: "Loading your orders...",
    emptyOrders: "You haven't placed any orders yet.",
    orderPlaced: "Order placed on ",
    ref: "Ref:"
  }
};

export default function ProfilePage() {
  const { user, lang } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = translations[lang] || translations.fr;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/sales/orders');
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Erreur de récupération des commandes", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  if (!user) return <Navigate to="/" />;

  const formatPrice = (cents, currency) => {
    return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { style: 'currency', currency }).format(cents / 100);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-[80vh]">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-brand-dark mb-2">{t.title}</h1>
        <p className="text-gray-500">{t.subtitle}</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-10">
        <h2 className="text-2xl font-bold text-brand-dark mb-4">{t.personalInfo}</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p><span className="font-semibold">{t.firstName}</span> {user.first_name}</p>
          <p><span className="font-semibold">{t.lastName}</span> {user.last_name}</p>
          <p><span className="font-semibold">{t.email}</span> {user.email}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-brand-dark mb-6">{t.orderHistory}</h2>
        {loading ? (
          <p className="animate-pulse">{t.loading}</p>
        ) : orders.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 border border-dashed border-gray-200">
            {t.emptyOrders}
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-4">
                  <div>
                    <p className="text-sm text-gray-500">{t.orderPlaced} <span className="font-semibold text-gray-700">{formatDate(order.created_at)}</span></p>
                    <p className="text-xs text-gray-400 font-mono mt-1">{t.ref} {order.id.split('-')[0]}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide">
                      {order.status}
                    </span>
                    <p className="text-xl font-black text-brand-dark mt-2">{formatPrice(order.total_amount, order.currency_code)}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <p className="font-medium text-gray-800"><span className="text-gray-400 mr-2">{item.quantity}x</span> {item.name}</p>
                      <p className="text-gray-500">{formatPrice(item.unitPrice * item.quantity, order.currency_code)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
