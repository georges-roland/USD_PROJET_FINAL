import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Save, ShieldCheck, Key, Globe, CreditCard } from 'lucide-react';

const translations = {
  fr: {
    title: "Paramètres de la Boutique",
    subtitle: "Configurez les intégrations API, les clés Stripe et les règles générales.",
    successMsg: "Configuration enregistrée avec succès !",
    general: "Général",
    payments: "Paiements & API keys",
    shopName: "Nom de la boutique",
    vatRate: "Taux de TVA (%)",
    currency: "Devise par défaut",
    stripePub: "Stripe Publishable Key (Clé Publique)",
    stripeSec: "Stripe Secret Key (Clé Secrète)",
    stripeMode: "Mode Test / Sandbox Stripe",
    save: "Enregistrer la configuration"
  },
  en: {
    title: "Store Settings",
    subtitle: "Configure API integrations, Stripe credentials, and store settings.",
    successMsg: "Settings saved successfully!",
    general: "General Settings",
    payments: "Payments & API Keys",
    shopName: "Store Name",
    vatRate: "VAT Rate (%)",
    currency: "Default Currency",
    stripePub: "Stripe Publishable Key",
    stripeSec: "Stripe Secret Key",
    stripeMode: "Stripe Sandbox Mode",
    save: "Save Configurations"
  }
};

export default function AdminSettings() {
  const { lang } = useAuth();
  const t = translations[lang] || translations.fr;

  const [shopName, setShopName] = useState('USD.Pro');
  const [vatRate, setVatRate] = useState('20');
  const [currency, setCurrency] = useState('EUR');
  const [stripePub, setStripePub] = useState('');
  const [stripeSec, setStripeSec] = useState('');
  const [sandboxMode, setSandboxMode] = useState(true);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load from localStorage if present
  useEffect(() => {
    const savedName = localStorage.getItem('settings_shop_name');
    const savedVat = localStorage.getItem('settings_vat_rate');
    const savedCur = localStorage.getItem('settings_currency');
    const savedPub = localStorage.getItem('settings_stripe_pub');
    const savedSec = localStorage.getItem('settings_stripe_sec');
    const savedMode = localStorage.getItem('settings_stripe_mode');

    if (savedName) setShopName(savedName);
    if (savedVat) setVatRate(savedVat);
    if (savedCur) setCurrency(savedCur);
    if (savedPub) setStripePub(savedPub);
    if (savedSec) setStripeSec(savedSec);
    if (savedMode) setSandboxMode(savedMode === 'true');
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    setTimeout(() => {
      localStorage.setItem('settings_shop_name', shopName);
      localStorage.setItem('settings_vat_rate', vatRate);
      localStorage.setItem('settings_currency', currency);
      localStorage.setItem('settings_stripe_pub', stripePub);
      localStorage.setItem('settings_stripe_sec', stripeSec);
      localStorage.setItem('settings_stripe_mode', String(sandboxMode));

      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* En-tête */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-brand-accent rounded-2xl"><Settings className="w-7 h-7" /></div>
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">{t.title}</h2>
          <p className="text-gray-500 text-sm mt-1">{t.subtitle}</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-bold text-center flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          {t.successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Général */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-brand-dark flex items-center gap-2 border-b border-gray-50 pb-4">
            <Globe className="w-5 h-5 text-gray-400" /> {t.general}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">{t.shopName}</label>
              <input 
                type="text" 
                value={shopName} 
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">{t.vatRate}</label>
              <input 
                type="number" 
                value={vatRate} 
                onChange={(e) => setVatRate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">{t.currency}</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition cursor-pointer"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Payments & Stripe */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-brand-dark flex items-center gap-2 border-b border-gray-50 pb-4">
            <CreditCard className="w-5 h-5 text-gray-400" /> {t.payments}
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-gray-400" /> {t.stripePub}
              </label>
              <input 
                type="text" 
                value={stripePub} 
                onChange={(e) => setStripePub(e.target.value)}
                placeholder="pk_test_..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-gray-400" /> {t.stripeSec}
              </label>
              <input 
                type="password" 
                value={stripeSec} 
                onChange={(e) => setStripeSec(e.target.value)}
                placeholder="sk_test_..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition" 
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="text-sm font-semibold text-brand-dark">{t.stripeMode}</p>
                <p className="text-xs text-gray-400">{lang === 'fr' ? 'Utiliser l\'environnement de test Stripe' : 'Use Stripe mock test environment'}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={sandboxMode} 
                  onChange={(e) => setSandboxMode(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
              </label>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="bg-brand-dark text-white font-bold py-4 px-8 rounded-full hover:bg-gray-800 transition flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Save className="w-5 h-5" />
          {saving ? (lang === 'fr' ? 'Enregistrement...' : 'Saving...') : t.save}
        </button>
      </form>
    </div>
  );
}
