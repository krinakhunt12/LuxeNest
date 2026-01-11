import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Router from './router';
import LayoutContainer from './components/Layout';
import CartDrawer from './components/Cart/CartDrawer';
import AIAssistant from './components/Common/AIAssistant';
import { AuthProvider } from './contexts/AuthContext';
import { useCartStore } from './store/useCartStore';
import { useWishlistStore } from './store/useWishlistStore';
import { logger } from './utils/logger';
import ErrorBoundary from './components/Common/ErrorBoundary';
import GlobalLoader from './components/Common/GlobalLoader';
import './index.css';


const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    logger.debug('Page scrolled to top', { pathname, search });
  }, [pathname, search]);
  return null;
};

const AppContent: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  const { getItems, getTotalItems, removeItem, updateQuantity } = useCartStore();
  const { getItems: getWishlistItems } = useWishlistStore();

  const cart = getItems();
  const cartCount = getTotalItems();
  const wishlistCount = getWishlistItems().length;

  const handleUpdateQty = (id: string, delta: number, color?: string) => {
    const item = cart.find(i => i.id === id && i.selectedColor === color);
    if (item) {
      updateQuantity(id, item.quantity + delta, color);
    }
  };

  const isAdminPath = location.pathname.startsWith('/admin');
  const isAuthPath = location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/admin-login' ||
    location.pathname === '/admin-signup';

  const routerContent = <Router />;

  return (
    <>
      <ScrollToTop />
      {isAdminPath || isAuthPath ? (
        routerContent
      ) : (
        <LayoutContainer
          cartCount={cartCount}
          onOpenCart={() => setIsCartOpen(true)}
          wishlistCount={wishlistCount}
        >
          <GlobalLoader />
          {routerContent}
        </LayoutContainer>

      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={(id, color) => removeItem(id, color)}
        onUpdateQty={(id, delta, color) => handleUpdateQty(id, delta, color)}
      />

      {!isAdminPath && <AIAssistant />}
    </>
  );
};

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
