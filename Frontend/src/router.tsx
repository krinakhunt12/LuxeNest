import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { ProductDetail } from './pages/ProductDetail'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Wishlist } from './pages/Wishlist'
import { Checkout } from './pages/Checkout'
import { Account } from './pages/Account'
import { Auth } from './pages/Auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import AdminLayout from './pages/Admin/AdminLayout'
import Dashboard from './pages/Admin/DashboardContainer'
import AdminProducts from './pages/Admin/ProductsContainer'
import AdminOrders from './pages/Admin/OrdersContainer'
import AdminUsers from './pages/Admin/UsersContainer'
import AdminCategories from './pages/Admin/CategoriesContainer'
import AdminAuth from './pages/Admin/AdminAuth'


const NotFound: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div className="py-40 text-center">
      <h1 className="text-4xl serif">{t('layout.notFound.title')}</h1>
      <p className="mt-4 text-gray-500">{t('layout.notFound.message')}</p>
      <Link to="/" className="mt-8 inline-block text-[#D4AF37] underline">
        {t('layout.notFound.backToHome')}
      </Link>
    </div>
  )
}

const Router: React.FC = () => {
  return (
    <div className="page-transition-enter-active">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>

        <Route path="/login" element={<Auth initialMode="login" />} />
        <Route path="/signup" element={<Auth initialMode="signup" />} />
        <Route path="/admin-login" element={<AdminAuth initialMode="login" />} />
        <Route path="/admin-signup" element={<AdminAuth initialMode="signup" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default Router
