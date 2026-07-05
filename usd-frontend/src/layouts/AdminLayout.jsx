import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, ChevronLeft, ChevronRight, Users, BarChart3, Settings, Home, MessageSquare } from 'lucide-react';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  const menu = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Produits', path: '/admin/products', icon: Package },
    { name: 'Commandes', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Clients', path: '/admin/customers', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Réglages', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`bg-brand-dark text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} p-4 flex flex-col relative`}>
        {/* Logo/Toggle */}
        <div className="flex items-center justify-between mb-10 px-2">
          {!collapsed && <span className="font-black text-xl tracking-tighter">USD<span className="text-brand-accent">.Admin</span></span>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 bg-gray-800 rounded-full hover:bg-brand-accent transition cursor-pointer">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2">
          {menu.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} 
                className={`flex items-center p-3 rounded-2xl transition-all duration-200 ${isActive ? 'bg-brand-accent text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <Icon className="w-6 h-6 shrink-0" />
                {!collapsed && <span className="ml-4 font-semibold">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Action Retour Boutique */}
        <div className="mt-auto pt-6 border-t border-gray-800">
          <Link to="/" className="flex items-center p-3 rounded-2xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200 cursor-pointer">
            <Home className="w-6 h-6 shrink-0" />
            {!collapsed && <span className="ml-4 font-semibold">Retour Boutique</span>}
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
