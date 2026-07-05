import { useState, useEffect } from 'react';
import { api, useAuth } from '../../context/AuthContext';
import { Search, UserCheck, Calendar, Mail } from 'lucide-react';

const translations = {
  fr: {
    title: "Gestion des Clients",
    subtitle: "Consultez et gérez les comptes clients enregistrés.",
    loading: "Chargement de la base clients...",
    search: "Rechercher un client (nom, email)...",
    colClient: "Client",
    colEmail: "Email",
    colJoined: "Rejoint le",
    totalCustomers: "Total Clients",
    noCustomers: "Aucun client trouvé."
  },
  en: {
    title: "Customer Management",
    subtitle: "View and manage registered customer accounts.",
    loading: "Loading customer database...",
    search: "Search client (name, email)...",
    colClient: "Client",
    colEmail: "Email",
    colJoined: "Joined on",
    totalCustomers: "Total Customers",
    noCustomers: "No customers found."
  }
};

export default function AdminCustomers() {
  const { lang } = useAuth();
  const t = translations[lang] || translations.fr;

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/users')
      .then(res => {
        if (res.data.success) {
          setCustomers(res.data.users);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { dateStyle: 'long' }).format(new Date(dateString));
  };

  const filteredCustomers = customers.filter(c => 
    c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">{t.title}</h2>
          <p className="text-gray-500 text-sm mt-1">{t.subtitle}</p>
        </div>
        <div className="bg-blue-50 text-brand-accent px-5 py-3 rounded-2xl flex items-center gap-3">
          <UserCheck className="w-5 h-5" />
          <span className="font-bold text-sm">{t.totalCustomers} : {customers.length}</span>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative w-full max-w-md">
        <input 
          type="text" 
          placeholder={t.search} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent focus:outline-none shadow-sm transition"
        />
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
      </div>

      {/* Table / Grid */}
      {loading ? (
        <p className="animate-pulse text-gray-500 font-semibold">{t.loading}</p>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="p-16 text-center text-gray-400">
              {t.noCustomers}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider bg-gray-50/50">
                    <th className="p-6">{t.colClient}</th>
                    <th className="p-6">{t.colEmail}</th>
                    <th className="p-6">{t.colJoined}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.map(customer => (
                    <tr key={customer.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold text-sm uppercase">
                          {customer.first_name?.[0]}{customer.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-brand-dark">{customer.first_name} {customer.last_name}</p>
                          <p className="text-xs font-medium text-gray-400">ID: {customer.id.split('-')[0]}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(customer.created_at)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
