import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AdminGuard from './components/AdminGuard';

// Pages Publiques
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));

// Pages Admin
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

const PageLoader = () => (
  <div className="min-h-[80vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<div className="min-h-screen bg-brand-light"><Navbar /><main><CatalogPage /></main></div>} />
            <Route path="/about" element={<div className="min-h-screen bg-brand-light"><Navbar /><main><AboutPage /></main></div>} />
            <Route path="/cart" element={<AdminGuard><div className="min-h-screen bg-brand-light"><Navbar /><main><CartPage /></main></div></AdminGuard>} />
            <Route path="/wishlist" element={<AdminGuard><div className="min-h-screen bg-brand-light"><Navbar /><main><WishlistPage /></main></div></AdminGuard>} />
            <Route path="/messages" element={<AdminGuard><div className="min-h-screen bg-brand-light"><Navbar /><main><MessagesPage /></main></div></AdminGuard>} />
            <Route path="/login" element={<div className="min-h-screen bg-brand-light"><Navbar /><main><LoginPage /></main></div>} />
            <Route path="/register" element={<div className="min-h-screen bg-brand-light"><Navbar /><main><RegisterPage /></main></div>} />
            <Route path="/profile" element={<div className="min-h-screen bg-brand-light"><Navbar /><main><ProfilePage /></main></div>} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;