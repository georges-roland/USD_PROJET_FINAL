import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, Award, Users, RefreshCw, BarChart2, DollarSign, Percent, ArrowUpRight } from 'lucide-react';

const translations = {
  fr: {
    title: "Analytiques Avancées",
    subtitle: "Suivi des performances commerciales de USD.Pro.",
    monthlySales: "Ventes Mensuelles (EUR)",
    categoryBreakdown: "Distribution par Catégorie",
    conversionFunnel: "Entonnoir de Conversion",
    kpis: {
      aov: "Panier Moyen",
      refunds: "Taux de Retour",
      retention: "Fidélité Client",
      ltv: "Valeur Vie Client"
    },
    funnel: {
      views: "Visiteurs Catalogues",
      cart: "Ajouts au Panier",
      checkout: "Paiements Initiés",
      purchase: "Paiements Confirmés"
    }
  },
  en: {
    title: "Advanced Analytics",
    subtitle: "Fulfillment & business performance tracking for USD.Pro.",
    monthlySales: "Monthly Sales (EUR)",
    categoryBreakdown: "Category Breakdown",
    conversionFunnel: "Conversion Funnel",
    kpis: {
      aov: "Average Order Value",
      refunds: "Refund Rate",
      retention: "Customer Retention",
      ltv: "Customer Lifetime Value"
    },
    funnel: {
      views: "Catalogue Viewers",
      cart: "Added to Cart",
      checkout: "Checkouts Started",
      purchase: "Purchases Completed"
    }
  }
};

export default function AdminAnalytics() {
  const { lang } = useAuth();
  const t = translations[lang] || translations.fr;

  const [timeframe, setTimeframe] = useState('30');

  // Données fictives haute fidélité pour le reporting
  const salesData = [
    { month: 'Jan', amount: 45000, height: 'h-24' },
    { month: 'Feb', amount: 52000, height: 'h-28' },
    { month: 'Mar', amount: 61000, height: 'h-32' },
    { month: 'Apr', amount: 58000, height: 'h-30' },
    { month: 'May', amount: 72000, height: 'h-40' },
    { month: 'Jun', amount: 89000, height: 'h-48' },
  ];

  const categories = [
    { name: 'Hardware & Laptops', percentage: 55, color: 'bg-brand-accent', amount: '€48,950' },
    { name: 'Accessoires', percentage: 25, color: 'bg-purple-500', amount: '€22,250' },
    { name: 'Services & Support', percentage: 20, color: 'bg-emerald-500', amount: '€17,800' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* En-tête avec sélecteur */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">{t.title}</h2>
          <p className="text-gray-500 text-sm mt-1">{t.subtitle}</p>
        </div>
        <select 
          value={timeframe} 
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-2xl p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent cursor-pointer"
        >
          <option value="7">7 {lang === 'fr' ? 'derniers jours' : 'days ago'}</option>
          <option value="30">30 {lang === 'fr' ? 'derniers jours' : 'days ago'}</option>
          <option value="90">90 {lang === 'fr' ? 'derniers jours' : 'days ago'}</option>
        </select>
      </div>

      {/* KPI Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-2xl text-brand-accent"><DollarSign className="w-6 h-6" /></div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase">{t.kpis.aov}</p>
            <p className="text-2xl font-black text-brand-dark">€1,999.00</p>
            <span className="text-xs text-green-500 font-bold flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> +1.2%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-50 rounded-2xl text-red-500"><Percent className="w-6 h-6" /></div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase">{t.kpis.refunds}</p>
            <p className="text-2xl font-black text-brand-dark">0.85%</p>
            <span className="text-xs text-green-500 font-bold flex items-center gap-0.5">-0.1% {lang === 'fr' ? 'ce mois' : 'this month'}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-50 rounded-2xl text-purple-600"><Users className="w-6 h-6" /></div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase">{t.kpis.retention}</p>
            <p className="text-2xl font-black text-brand-dark">82.4%</p>
            <span className="text-xs text-green-500 font-bold flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> +4.7%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600"><Award className="w-6 h-6" /></div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase">{t.kpis.ltv}</p>
            <p className="text-2xl font-black text-brand-dark">€4,850</p>
            <span className="text-xs text-green-500 font-bold flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> +2.5%</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Sales Chart Bar */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg text-brand-dark flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-accent" /> {t.monthlySales}
            </h3>
            <span className="text-xs text-gray-400 font-medium">Mise à jour il y a 5 min</span>
          </div>
          <div className="flex items-end justify-between h-64 pt-6 px-4 border-b border-gray-100">
            {salesData.map((data) => (
              <div key={data.month} className="flex flex-col items-center gap-3 w-1/6 group cursor-pointer">
                <div className="text-[10px] font-bold text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 px-2 py-1 rounded-md mb-1 shadow-sm">
                  €{(data.amount / 1000).toFixed(0)}k
                </div>
                <div className={`w-full max-w-[40px] bg-brand-light group-hover:bg-brand-accent rounded-t-xl transition-all duration-300 ${data.height}`}></div>
                <span className="text-xs font-bold text-gray-400 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-brand-dark flex items-center gap-2 mb-8">
              <BarChart2 className="w-5 h-5 text-purple-500" /> {t.categoryBreakdown}
            </h3>
            <div className="space-y-6">
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-gray-600">{cat.name}</span>
                    <span className="text-brand-dark font-black">{cat.amount} ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Rapport généré automatiquement</span>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>
      </div>

      {/* Conversion Funnel Card */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-lg text-brand-dark mb-8">{t.conversionFunnel}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100/50 space-y-2 relative overflow-hidden">
            <span className="absolute -bottom-4 -right-2 text-7xl font-black text-blue-100/30">1</span>
            <h4 className="font-bold text-brand-dark text-sm">{t.funnel.views}</h4>
            <p className="text-3xl font-black text-brand-accent tracking-tighter">12,480</p>
            <p className="text-xs text-gray-400 font-medium">100% de base</p>
          </div>

          <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100/50 space-y-2 relative overflow-hidden">
            <span className="absolute -bottom-4 -right-2 text-7xl font-black text-indigo-100/30">2</span>
            <h4 className="font-bold text-brand-dark text-sm">{t.funnel.cart}</h4>
            <p className="text-3xl font-black text-indigo-600 tracking-tighter">3,120</p>
            <p className="text-xs text-indigo-600 font-bold">25.0% {lang === 'fr' ? 'de conversion' : 'conversion'}</p>
          </div>

          <div className="p-6 rounded-3xl bg-purple-50/50 border border-purple-100/50 space-y-2 relative overflow-hidden">
            <span className="absolute -bottom-4 -right-2 text-7xl font-black text-purple-100/30">3</span>
            <h4 className="font-bold text-brand-dark text-sm">{t.funnel.checkout}</h4>
            <p className="text-3xl font-black text-purple-600 tracking-tighter">1,248</p>
            <p className="text-xs text-purple-600 font-bold">40.0% {lang === 'fr' ? 'de conversion' : 'conversion'}</p>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100/50 space-y-2 relative overflow-hidden">
            <span className="absolute -bottom-4 -right-2 text-7xl font-black text-emerald-100/30">4</span>
            <h4 className="font-bold text-brand-dark text-sm">{t.funnel.purchase}</h4>
            <p className="text-3xl font-black text-emerald-600 tracking-tighter">305</p>
            <p className="text-xs text-emerald-600 font-bold">24.4% {lang === 'fr' ? 'de conversion' : 'conversion'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
