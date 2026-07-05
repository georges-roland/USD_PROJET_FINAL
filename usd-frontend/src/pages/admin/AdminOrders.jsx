import { useState, useEffect } from 'react';
import { api, useAuth } from '../../context/AuthContext';

const translations = {
  fr: {
    title: "Suivi des Commandes",
    subtitle: "Gérez les expéditions et le traitement client.",
    loading: "Chargement des commandes...",
    colRef: "Réf / Date",
    colClient: "Client",
    colAmount: "Montant",
    colStatus: "Statut",
    colAction: "Action",
    optPending: "En attente (PENDING)",
    optShipped: "Expédiée (SHIPPED)",
    optDelivered: "Livrée (DELIVERED)",
    optCancelled: "Annulée (CANCELLED)",
    errorStatus: "Erreur lors de la mise à jour du statut"
  },
  en: {
    title: "Order Tracking",
    subtitle: "Manage shipments and customer fulfillment.",
    loading: "Loading orders...",
    colRef: "Ref / Date",
    colClient: "Client",
    colAmount: "Amount",
    colStatus: "Status",
    colAction: "Action",
    optPending: "Pending (PENDING)",
    optShipped: "Shipped (SHIPPED)",
    optDelivered: "Delivered (DELIVERED)",
    optCancelled: "Cancelled (CANCELLED)",
    errorStatus: "Error updating order status"
  }
};

export default function AdminOrders() {
  const { lang } = useAuth();
  const t = translations[lang] || translations.fr;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/sales/all-orders');
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/sales/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert(t.errorStatus);
      console.error(err);
    }
  };

  const formatPrice = (cents, currency = 'EUR') => {
    const finalCurrency = currency && typeof currency === 'string' && currency.length === 3 ? currency : 'EUR';
    return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { style: 'currency', currency: finalCurrency }).format((cents || 0) / 100);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateString));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-brand-dark">{t.title}</h2>
        <p className="text-gray-500 text-sm">{t.subtitle}</p>
      </div>

      {loading ? (
        <p className="animate-pulse text-gray-500 font-semibold">{t.loading}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                <th className="pb-4 font-semibold">{t.colRef}</th>
                <th className="pb-4 font-semibold">{t.colClient}</th>
                <th className="pb-4 font-semibold">{t.colAmount}</th>
                <th className="pb-4 font-semibold">{t.colStatus}</th>
                <th className="pb-4 font-semibold text-right">{t.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="py-4">
                    <p className="font-mono text-xs text-gray-500">#{order.id}</p>
                    <p className="text-sm font-medium text-brand-dark">{formatDate(order.created_at)}</p>
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-brand-dark">{order.first_name} {order.last_name}</p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                  </td>
                  <td className="py-4 font-bold text-brand-dark">
                    {formatPrice(order.total_amount, order.currency_code)}
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <select 
                      className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-accent focus:border-brand-accent block w-full p-2.5 font-semibold cursor-pointer"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="PENDING">{t.optPending}</option>
                      <option value="SHIPPED">{t.optShipped}</option>
                      <option value="DELIVERED">{t.optDelivered}</option>
                      <option value="CANCELLED">{t.optCancelled}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
