import React from 'react';
import { CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const translations = {
  fr: {
    card: "Carte Bancaire",
    cardDesc: "Visa, Mastercard, AMEX",
    paypalDesc: "Connexion sécurisée PayPal",
    cashappDesc: "Paiement rapide avec CashApp",
    venmoDesc: "Paiement social Venmo"
  },
  en: {
    card: "Credit Card",
    cardDesc: "Visa, Mastercard, AMEX",
    paypalDesc: "Secure PayPal Connection",
    cashappDesc: "Fast payment with CashApp",
    venmoDesc: "Social payment Venmo"
  }
};

// PayPal Icon SVG
const PayPalIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#003087]" fill="currentColor">
    <path d="M20.07 6.78c-.22 2.62-1.92 5.92-5.46 5.92H11.5c-.32 0-.58.23-.63.55l-1.07 6.81c-.02.13-.13.22-.26.22H6.38c-.16 0-.28-.15-.25-.3l2.25-14.3c.05-.32.32-.55.65-.55h4.63c2.78 0 4.88.59 5.86 2.37.38.69.57 1.54.55 2.28z" />
    <path opacity="0.7" d="M17.07 9.78c-.22 2.62-1.92 5.92-5.46 5.92H8.5c-.32 0-.58.23-.63.55l-1.07 6.81c-.02.13-.13.22-.26.22H3.38c-.16 0-.28-.15-.25-.3l2.25-14.3c.05-.32.32-.55.65-.55h4.63c2.78 0 4.88.59 5.86 2.37.38.69.57 1.54.55 2.28z" fill="#0079C1" />
  </svg>
);

// CashApp Icon SVG
const CashAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#00D632]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

// Venmo Icon SVG
const VenmoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#008CFF]" fill="currentColor">
    <path d="M18.8 3.5L12.5 20.5H7.7L3 3.5H8.2L10.7 14.2L13.8 3.5H18.8Z" />
  </svg>
);

export default function PaymentMethods({ selectedMethod, setSelectedMethod }) {
  const { lang } = useAuth();
  const t = translations[lang] || translations.fr;

  const methods = [
    {
      id: 'card',
      name: t.card,
      desc: t.cardDesc,
      icon: <CreditCard className="w-8 h-8 text-brand-dark" />
    },
    {
      id: 'paypal',
      name: "PayPal",
      desc: t.paypalDesc,
      icon: <PayPalIcon />
    },
    {
      id: 'cashapp',
      name: "Cash App",
      desc: t.cashappDesc,
      icon: <CashAppIcon />
    },
    {
      id: 'venmo',
      name: "Venmo",
      desc: t.venmoDesc,
      icon: <VenmoIcon />
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethod(method.id)}
              className={`flex items-start gap-4 p-5 text-left rounded-3xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-brand-light border-brand-accent ring-2 ring-brand-accent shadow-md'
                  : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
              }`}
            >
              <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-center">
                {method.icon}
              </div>
              <div className="space-y-1">
                <p className="font-bold text-brand-dark text-base">{method.name}</p>
                <p className="text-gray-400 text-xs leading-snug">{method.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
