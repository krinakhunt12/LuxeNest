import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logger } from '../../utils/logger';
import Layout from './Layout';

interface LayoutContainerProps {
  children: React.ReactNode;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
}

const LayoutContainer: React.FC<LayoutContainerProps> = ({ 
  children, 
  cartCount, 
  wishlistCount, 
  onOpenCart 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    logger.debug('Location changed', { pathname: location.pathname });
  }, [location]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      logger.debug('Search overlay opened');
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      logger.info('Search submitted', { query });
      navigate(`/shop?q=${encodeURIComponent(query)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(prev => {
      const newValue = !prev;
      logger.debug('Menu toggled', { isOpen: newValue });
      return newValue;
    });
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(prev => {
      const newValue = !prev;
      logger.debug('Search toggled', { isOpen: newValue });
      return newValue;
    });
  };

  const handleTrendingClick = (tag: string) => {
    logger.info('Trending item clicked', { tag });
    setSearchQuery(tag);
    handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <Layout
      isAuthPage={isAuthPage}
      isMenuOpen={isMenuOpen}
      isSearchOpen={isSearchOpen}
      searchQuery={searchQuery}
      isScrolled={isScrolled}
      searchInputRef={searchInputRef}
      onMenuToggle={handleMenuToggle}
      onSearchToggle={handleSearchToggle}
      onSearchQueryChange={setSearchQuery}
      onSearchSubmit={handleSearchSubmit}
      onTrendingClick={handleTrendingClick}
      cartCount={cartCount}
      wishlistCount={wishlistCount}
      onOpenCart={onOpenCart}
    >
      {children}
    </Layout>
  );
};

export default LayoutContainer;

