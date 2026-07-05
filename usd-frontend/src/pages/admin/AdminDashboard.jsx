import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, useAuth } from '../../context/AuthContext';
import { LayoutDashboard, ShoppingCart, Users, LineChart, ChevronDown, ArrowUpRight, ArrowDownRight, Package, CalendarDays, MessageSquare } from 'lucide-react';

const translations = {
  fr: {
    views: "Vues du site (Aujourd'hui)",
    revenue: "Chiffre d'Affaires (Mensuel)",
    pendingOrders: "Commandes en attente",
    pendingSub: "Nécessite votre attention",
    totalProducts: "Total Produits (Catalogue)",
    activeCustomers: "Clients Actifs",
    conversionRate: "Taux de Conversion",
    vsYesterday: "vs hier",
    revenueOverview: "Aperçu des Revenus",
    thisWeek: "Cette Semaine",
    allTime: "Tout le temps",
    recentOrders: "Commandes récentes",
    viewAll: "Voir tout",
    noOrders: "Aucune commande récente.",
    welcome: "Bienvenue, Admin 👋",
    overview: "Aperçu Général",
    chartPlaceholder: "Espace réservé pour le graphique des ventes (Chart.js)",
    loading: "Chargement des statistiques...",
    messages: "Messages Client",
    unreadText: "Nouveaux messages !",
    readText: "Pas de message non-lu"
  },
  en: {
    views: "Site Views (Today)",
    revenue: "Site Revenue (Monthly)",
    pendingOrders: "Pending Orders",
    pendingSub: "Requires your attention",
    totalProducts: "Total Products (Catalog)",
    activeCustomers: "Active Customers",
    conversionRate: "Conversion Rate",
    vsYesterday: "vs yesterday",
    revenueOverview: "Revenue Overview",
    thisWeek: "This Week",
    allTime: "All Time",
    recentOrders: "Recent Orders",
    viewAll: "View all",
    noOrders: "No recent orders.",
    welcome: "Welcome, Admin 👋",
    overview: "General Overview",
    chartPlaceholder: "Placeholder for sales chart (Chart.js)",
    loading: "Loading statistics...",
    messages: "Client Messages",
    unreadText: "New messages!",
    readText: "No unread messages"
  }
};

export default function AdminDashboard() {
  const { lang } = useAuth();
  const navigate = useNavigate();
  const t = translations[lang] || translations.fr;

  const [metrics, setMetrics] = useState({ totalRevenue: 0, pendingOrders: 0, totalProducts: 0, totalCustomers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/stats');
        setMetrics(statsRes.data.metrics);

        const ordersRes = await api.get('/sales/all-orders');
        if (ordersRes.data.success) {
          setRecentOrders(ordersRes.data.orders.slice(0, 5));
        }

        const supportRes = await api.get('/support');
        if (supportRes.data.success) {
          const unread = supportRes.data.messages.filter(m => !m.is_read && m.sender === 'client').length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (cents, currency = 'EUR') => {
    const finalCurrency = currency && typeof currency === 'string' && currency.length === 3 ? currency : 'EUR';
    return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { style: 'currency', currency: finalCurrency }).format((cents || 0) / 100);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { dateStyle: 'short' }).format(new Date(dateString));
  };

  if (loading) return <p className="animate-pulse text-gray-500 font-semibold p-8">{t.loading}</p>;

  const kpis = [
    { label: t.views, value: "1,248", change: 12.5, icon: LayoutDashboard },
    { label: t.revenue, value: formatPrice(metrics.totalRevenue), change: 5.4, icon: LineChart },
    { label: t.pendingOrders, value: metrics.pendingOrders, subText: t.pendingSub, icon: ShoppingCart, link: '/admin/orders' },
    { label: t.messages, value: unreadCount, subText: unreadCount > 0 ? t.unreadText : t.readText, icon: MessageSquare, link: '/admin/messages' },
  ];

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-1">{t.overview}</h2>
          <h1 className="text-4xl font-extrabold text-brand-dark mb-4 tracking-tighter">{t.welcome}</h1>
        </div>
        <div className="bg-white border border-gray-200 px-5 py-3 rounded-xl flex items-center gap-2.5 text-sm font-semibold text-gray-700 shadow-sm">
          <CalendarDays className="w-5 h-5 text-gray-400" />
          <span>Aujourd'hui</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          const isClickable = !!kpi.link;
          return (
            <div 
              key={kpi.label} 
              onClick={() => isClickable && navigate(kpi.link)}
              className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3 relative overflow-hidden transition-all duration-200 ${isClickable ? 'cursor-pointer hover:shadow-md hover:border-brand-accent/30' : ''}`}
            >
              <Icon className="absolute top-6 right-6 w-10 h-10 text-gray-100 z-0" />
              <div className="relative z-10 space-y-1.5">
                <p className="text-gray-500 text-sm font-semibold mb-1">{kpi.label}</p>
                <p className="text-4xl font-black text-brand-dark tracking-tighter leading-tight">{kpi.value}</p>
                {kpi.change && (
                  <p className={`text-sm font-bold flex items-center gap-1 ${kpi.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {kpi.change}% <span className="font-medium text-gray-400">{t.vsYesterday}</span>
                  </p>
                )}
                {kpi.subText && <p className="text-xs font-medium text-gray-400">{kpi.subText}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <h3 className="font-bold text-lg text-brand-dark">{t.revenueOverview}</h3>
            <div className="flex items-center gap-3">
              <button className="text-xs font-bold text-brand-accent bg-blue-50 px-3 py-1 rounded-full">{t.allTime}</button>
            </div>
          </div>
          <div className="h-80 w-full flex items-end justify-between gap-4 p-6 border border-gray-100 rounded-xl bg-gray-50/50">
            {[
              { month: 'Jan', revenue: 45000, height: 'h-[40%]' },
              { month: 'Feb', revenue: 52000, height: 'h-[50%]' },
              { month: 'Mar', revenue: 61000, height: 'h-[65%]' },
              { month: 'Apr', revenue: 58000, height: 'h-[60%]' },
              { month: 'May', revenue: 72000, height: 'h-[75%]' },
              { month: 'Jun', revenue: 89000, height: 'h-[90%]' },
            ].map(item => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="text-[10px] font-black text-white bg-brand-dark px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatPrice(item.revenue)}
                </div>
                <div className={`w-full bg-blue-100 group-hover:bg-brand-accent rounded-xl transition-all duration-300 ${item.height}`}></div>
                <span className="text-xs font-bold text-gray-400 mt-1">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <h3 className="font-bold text-lg text-brand-dark">{t.recentOrders}</h3>
            <button onClick={() => navigate('/admin/orders')} className="text-xs text-brand-accent font-semibold hover:underline cursor-pointer">{t.viewAll}</button>
          </div>
          <div className="space-y-4">
            {recentOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 transition-colors hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-brand-accent p-2 rounded-lg"><ShoppingCart className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm font-bold text-brand-dark font-mono">#{o.id}</p>
                    <p className="text-xs text-gray-400 font-medium">{formatDate(o.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-brand-dark">{formatPrice(o.total_amount, o.currency_code)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${o.status === "PENDING" ? "bg-yellow-50 text-yellow-800 border border-yellow-100" : "bg-green-50 text-green-800 border border-green-100"}`}>{o.status}</span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && <p className="text-center text-gray-400 text-sm py-8">{t.noOrders}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
