import { useState, useEffect } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { Search, ShoppingCart, CheckCircle2, AlertCircle, MessageCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const translations = {
  fr: { title: "Nos Produits", search: "Rechercher...", empty: "Aucun produit trouvé.", buy: "Acheter", processing: "Traitement...", loginReq: "Connectez-vous.", success: "Commande confirmée !", error: "Erreur.", help: "Aide", send: "Envoyer", msgSuccess: "Message envoyé !", noImg: "Aucune image" },
  en: { title: "Our Products", search: "Search...", empty: "No products found.", buy: "Buy", processing: "Processing...", loginReq: "Please log in.", success: "Order confirmed!", error: "Error.", help: "Help", send: "Send", msgSuccess: "Message sent!", noImg: "No image" }
};

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatus, setOrderStatus] = useState(null); 
  const [purchasingId, setPurchasingId] = useState(null);
  
  const { user, lang } = useAuth();
  const navigate = useNavigate();
  const t = translations[lang] || translations.fr;

  const fetchProducts = async (search = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/catalog/products?lang=${lang}&search=${search}`);
      setProducts(response.data.products);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchProducts(searchTerm); }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, lang]);

  const formatPrice = (cents) => new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { style: 'currency', currency: 'EUR' }).format(cents / 100);

  const handlePurchase = (product) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const message = lang === 'fr'
      ? `Bonjour ! Je souhaite acheter le produit suivant : ${product.name} au prix de ${formatPrice(product.price)}. Pouvons-nous finaliser la commande ?`
      : `Hello! I would like to buy the following product: ${product.name} for ${formatPrice(product.price)}. Can we finalize the order?`;
      
    navigate('/messages', { state: { initialMsg: message } });
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {orderStatus && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl font-bold text-sm z-50 flex items-center ${orderStatus.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {orderStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
          {orderStatus.message}
        </div>
      )}

      {/* En-tête simplifié */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <h1 className="text-4xl font-black text-brand-dark tracking-tighter">{t.title}</h1>
        <div className="w-full md:w-96 relative">
          <input type="text" placeholder={t.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-accent focus:outline-none shadow-sm" />
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {loading ? <p className="animate-pulse font-semibold">Chargement...</p> : (
        products.length === 0 ? <div className="text-center py-20 text-gray-400">{t.empty}</div> :
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex flex-col 
                         transition-all duration-300 ease-in-out 
                         hover:-translate-y-2 hover:shadow-2xl hover:border-brand-accent/30"
            >
              <div className="bg-gray-50 rounded-2xl h-48 w-full mb-4 flex items-center justify-center overflow-hidden">
                {product.image_url ? <img src={`http://localhost:5000${product.image_url}`} alt={product.name} className="w-full h-full object-cover" /> : <span className="text-gray-300 text-sm">{t.noImg}</span>}
              </div>
              <h2 className="text-lg font-bold text-brand-dark mb-1">{product.name}</h2>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xl font-black text-brand-dark">{formatPrice(product.price)}</span>
                {user?.role !== 'admin' && (
                  <button onClick={() => handlePurchase(product)} disabled={purchasingId === product.id} className="bg-brand-accent text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 transition">
                    {purchasingId === product.id ? t.processing : t.buy}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
