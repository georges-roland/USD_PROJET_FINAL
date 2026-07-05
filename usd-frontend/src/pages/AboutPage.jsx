import { ShieldCheck, Globe, Zap, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const translations = {
  fr: {
    title: "À propos de USD.Pro",
    sub: "Nous redéfinissons le commerce technologique en Afrique avec une plateforme haute performance et un service client d'exception.",
    values: [
      { title: "Expertise Locale", desc: "Basé au Cameroun, pour les innovateurs locaux." },
      { title: "Sécurité Totale", desc: "Transactions cryptées et produits certifiés." },
      { title: "Livraison Éclair", desc: "Vos commandes chez vous en moins de 24h." },
      { title: "Support Dédié", desc: "Une équipe à votre écoute 24/7." }
    ]
  },
  en: {
    title: "About USD.Pro",
    sub: "We are redefining tech commerce in Africa with a high-performance platform and exceptional customer service.",
    values: [
      { title: "Local Expertise", desc: "Based in Cameroon, for local innovators." },
      { title: "Total Security", desc: "Encrypted transactions and certified products." },
      { title: "Lightning Delivery", desc: "Your orders delivered to your door in less than 24h." },
      { title: "Dedicated Support", desc: "A team at your service 24/7." }
    ]
  }
};

export default function AboutPage() {
  const { lang } = useAuth();
  const t = translations[lang] || translations.fr;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-brand-dark mb-4 tracking-tighter">{t.title}</h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto">{t.sub}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[Globe, ShieldCheck, Zap, Users].map((Icon, i) => {
            const val = t.values[i];
            return (
              <div key={i} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all">
                <Icon className="w-12 h-12 text-brand-accent mb-6" />
                <h3 className="text-xl font-bold text-brand-dark mb-2">{val.title}</h3>
                <p className="text-gray-500 text-sm">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
