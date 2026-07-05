import { useState, useEffect } from 'react';
import { api, useAuth } from '../../context/AuthContext';
import { Search, ChevronDown, Package, PlusCircle, Pencil, Trash2, CalendarDays, MoreHorizontal, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

const translations = {
  fr: {
    title: "Gestion des Produits",
    subtitle: "Gérez vos produits de boutique",
    newProductBtn: "+ Nouveau Produit",
    searchPlaceholder: "Rechercher des produits...",
    allCategories: "Toutes les catégories",
    manageCategories: "Gérer les catégories",
    filter: "Filtrer",
    colThumbnail: "Miniature",
    colProduct: "Produit",
    colCategory: "Catégorie",
    colPrice: "Prix",
    colStock: "Stock",
    colState: "État",
    colActions: "Actions",
    confirmDelete: "Supprimer ce produit définitivement ?",
    errorDelete: "Erreur de suppression",
    errorSave: "Erreur lors de l'enregistrement",
    modalSub: "Ajoutez un nouveau produit à votre boutique",
    modalTitleNew: "Nouveau Produit",
    modalTitleEdit: "Modifier le Produit",
    labelImage: "Image du produit",
    uploadPlaceholder: "Téléverser une image",
    uploadLimit: "PNG, JPG jusqu'à 5 Mo",
    labelSku: "SKU",
    labelName: "Nom du produit",
    labelCategory: "Catégorie",
    labelPrice: "Prix ($)",
    labelStock: "Quantité en stock",
    labelDesc: "Description",
    descPlaceholder: "Description du produit...",
    btnCancel: "Annuler",
    btnSave: "Enregistrer le produit",
    selectCategory: "Sélectionner une catégorie"
  },
  en: {
    title: "Product Management",
    subtitle: "Manage your store products",
    newProductBtn: "+ New Product",
    searchPlaceholder: "Search products...",
    allCategories: "All Categories",
    manageCategories: "Manage Categories",
    filter: "Filter",
    colThumbnail: "Thumbnail",
    colProduct: "Product",
    colCategory: "Category",
    colPrice: "Price",
    colStock: "Stock",
    colState: "Status",
    colActions: "Actions",
    confirmDelete: "Permanently delete this product?",
    errorDelete: "Error deleting product",
    errorSave: "Error saving product",
    modalSub: "Add a new product to your store",
    modalTitleNew: "New Product",
    modalTitleEdit: "Edit Product",
    labelImage: "Product Image",
    uploadPlaceholder: "Upload an Image",
    uploadLimit: "PNG, JPG up to 5MB",
    labelSku: "SKU",
    labelName: "Product Name",
    labelCategory: "Category",
    labelPrice: "Price ($)",
    labelStock: "Stock quantity",
    labelDesc: "Description",
    descPlaceholder: "Product description...",
    btnCancel: "Cancel",
    btnSave: "Save Product",
    selectCategory: "Select a category"
  }
};

export default function AdminProducts() {
  const { lang } = useAuth();
  const t = translations[lang] || translations.fr;

  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', sku: '', category: '', price: '', stock_quantity: '', description: '' });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/catalog/products?lang=fr');
      setProducts(res.data.products);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({ name: product.name, sku: product.sku, category: product.category || '', price: product.price / 100, stock_quantity: product.stock_quantity, description: product.description });
    } else {
      setEditingId(null);
      setFormData({ name: '', sku: '', category: '', price: '', stock_quantity: '', description: '' });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await api.delete(`/catalog/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) { console.error(err); alert(t.errorDelete); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('sku', formData.sku);
    payload.append('category', formData.category);
    payload.append('price', Math.round(parseFloat(formData.price) * 100)); // En centimes
    payload.append('stock_quantity', formData.stock_quantity);
    payload.append('description', formData.description);
    if (imageFile) payload.append('image', imageFile);

    try {
      if (editingId) {
        await api.put(`/catalog/products/${editingId}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/catalog/products', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setIsModalOpen(false); fetchProducts();
    } catch (err) { console.error(err); alert(t.errorSave); }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-1">{t.subtitle}</h2>
          <h1 className="text-4xl font-extrabold text-brand-dark mb-4 tracking-tighter">{t.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-white border border-gray-200 px-5 py-3 rounded-xl flex items-center gap-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"><CalendarDays className="w-5 h-5 text-gray-400"/> May 12 — May 18, 2024 <ChevronDown className="w-4 h-4 text-gray-400"/></button>
          <button onClick={() => handleOpenModal()} className="bg-brand-accent text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-600 transition flex items-center gap-2.5 group shadow-sm"><PlusCircle className="w-5 h-5 group-hover:scale-105 transition-transform" /> {t.newProductBtn}</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-gray-100 mb-8">
          <div className="w-full md:w-96 relative">
            <input type="text" placeholder={t.searchPlaceholder} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-accent focus:outline-none shadow-sm bg-white" />
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-4">
            <button className="text-xs text-brand-accent font-semibold hover:underline">{t.manageCategories}</button>
            <div className="relative group cursor-pointer text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <Package className="w-4 h-4 text-gray-400 mr-2 inline" /> {t.allCategories} <ChevronDown className="w-4 h-4 ml-1.5 text-gray-400 inline" />
            </div>
            <button className="bg-white border border-gray-200 p-3 rounded-xl flex items-center gap-2 text-sm font-medium text-gray-700 shadow-sm">{t.filter} <ChevronDown className="w-4 h-4" /></button>
          </div>
        </div>

        {loading ? <p className="animate-pulse">...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="pb-4 font-semibold">{t.colThumbnail}</th>
                  <th className="pb-4 font-semibold">{t.colProduct}</th>
                  <th className="pb-4 font-semibold">{t.colCategory}</th>
                  <th className="pb-4 font-semibold">{t.colPrice}</th>
                  <th className="pb-4 font-semibold">{t.colStock}</th>
                  <th className="pb-4 font-semibold">{t.colState}</th>
                  <th className="pb-4 font-semibold text-right">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => {
                  const stockStatus = p.stock_quantity > 20 ? "In Stock" : p.stock_quantity > 5 ? "Low Stock" : "Out of Stock";
                  const StatusIcon = stockStatus === "In Stock" ? CheckCircle2 : stockStatus === "Low Stock" ? AlertTriangle : AlertCircle;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        {p.image_url ? <img src={`http://localhost:5000${p.image_url}`} alt={p.name} className="w-16 h-16 object-cover rounded-lg border border-gray-100" /> : <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 font-medium">No Img</div>}
                      </td>
                      <td className="py-4"><p className="font-bold text-brand-dark">{p.name}</p><p className="text-xs text-gray-400 font-mono">SKU: {p.sku}</p></td>
                      <td className="py-4 text-sm text-gray-600 font-medium">{p.category || 'EUR'}</td>
                      <td className="py-4 font-extrabold text-brand-dark">${(p.price / 100).toFixed(2)}</td>
                      <td className="py-4 font-bold text-brand-dark">{p.stock_quantity}</td>
                      <td className="py-4"><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit ${stockStatus === "In Stock" ? "bg-green-50 text-green-800 border border-green-100" : stockStatus === "Low Stock" ? "bg-yellow-50 text-yellow-800 border border-yellow-100" : "bg-red-50 text-red-800 border border-red-100"}`}><StatusIcon className="w-3.5 h-3.5"/> {stockStatus}</span></td>
                      <td className="py-4 text-right space-x-2.5 flex items-center justify-end">
                        <button onClick={() => handleOpenModal(p)} className="bg-gray-100 text-brand-dark p-2 rounded-lg hover:bg-gray-200 transition-colors"><Pencil className="w-4 h-4"/></button>
                        <button onClick={() => handleDelete(p.id)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4"/></button>
                        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modale Nouveau Produit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl w-full max-w-4xl shadow-2xl space-y-10 relative border border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            <div className="pb-6 border-b border-gray-100 space-y-2">
              <h2 className="text-sm font-semibold text-brand-accent mb-1">{t.modalSub}</h2>
              <h3 className="text-3xl font-extrabold tracking-tighter text-brand-dark">{editingId ? t.modalTitleEdit : t.modalTitleNew}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-gray-700">{t.labelImage}</label>
                  <label className="border-4 border-dashed border-gray-100 bg-gray-50 rounded-2xl p-6 text-center cursor-pointer hover:border-gray-200 transition relative h-72 flex flex-col items-center justify-center">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => setImageFile(e.target.files[0])} 
                    />
                    <PlusCircle className="w-12 h-12 text-gray-200 mb-4"/>
                    <div className="space-y-2">
                      <span className="bg-white text-gray-600 px-4 py-2 text-sm rounded-lg font-semibold border border-gray-200 shadow-sm hover:bg-gray-50 inline-block">
                        {imageFile ? imageFile.name : t.uploadPlaceholder}
                      </span>
                      <p className="text-xs text-gray-400">{t.uploadLimit}</p>
                    </div>
                  </label>
                </div>
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-gray-700">{t.labelSku}</label>
                  <input type="text" required value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} placeholder={t.labelSku} className="w-full px-5 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-gray-700">{t.labelName}</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder={t.labelName} className="w-full px-5 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                </div>
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-gray-700">{t.labelCategory}</label>
                  <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-accent focus:outline-none appearance-none">
                    <option value="">{t.selectCategory}</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="LIVRE">LIVRE (£)</option>
                    <option value="YEN">YEN (¥)</option>
                    <option value="RUBLE">RUBLE (₽)</option>
                    <option value="DINAR">DINAR (د.ع)</option>
                    <option value="DIRHAM">DIRHAM (د.إ)</option>
                    <option value="BITCOIN">BITCOIN (₿)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <label className="block text-sm font-semibold text-gray-700">{t.labelPrice}</label>
                    <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder={t.labelPrice} className="w-full px-5 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                  </div>
                  <div className="space-y-2.5">
                    <label className="block text-sm font-semibold text-gray-700">{t.labelStock}</label>
                    <input type="number" required value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})} placeholder={t.labelStock} className="w-full px-5 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2.5 col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">{t.labelDesc}</label>
                  <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder={t.descPlaceholder} className="w-full px-5 py-3 border border-gray-200 rounded-xl text-sm h-32 resize-none focus:ring-2 focus:ring-brand-accent focus:outline-none"></textarea>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-10 border-t border-gray-100">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl">{t.btnCancel}</button>
              <button type="submit" className="px-10 py-2.5 bg-brand-dark text-white font-bold rounded-full hover:bg-gray-800 shadow-sm">{t.btnSave}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
