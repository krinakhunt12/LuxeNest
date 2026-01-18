import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingBag,
  Search,
  Heart,
  User,
  Menu as MenuIcon,
  X,
  ChevronDown,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  LogOut,
  Settings,
  Package,
  LayoutDashboard
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Transition, Popover } from '@headlessui/react';
import { Fragment } from 'react';
import { useCategories } from '../../hooks/useProducts';




interface LayoutProps {
  children: React.ReactNode;
  isAuthPage: boolean;
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  searchQuery: string;
  isScrolled: boolean;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onMenuToggle: () => void;
  onSearchToggle: () => void;
  onSearchQueryChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onTrendingClick: (tag: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  isAuthPage,
  isMenuOpen,
  isSearchOpen,
  searchQuery,
  isScrolled,
  searchInputRef,
  onMenuToggle,
  onSearchToggle,
  onSearchQueryChange,
  onSearchSubmit,
  onTrendingClick,
  cartCount,
  wishlistCount,
  onOpenCart,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const { data: categories = [] } = useCategories();


  if (isAuthPage) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="absolute top-8 left-8 z-50">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-[#1F2937] serif">
            LuxeNest<span className="text-[#D4AF37]">.</span>
          </Link>
        </div>
        <main className="flex-grow">
          {children}
        </main>
      </div>
    );
  }

  const trendingItems = [
    t('layout.search.trendingItems.velvetSofa'),
    t('layout.search.trendingItems.loungeChair'),
    t('layout.search.trendingItems.oakDesk'),
    t('layout.search.trendingItems.lighting'),
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center px-4 md:px-8 animate-fade-in">
          <button
            onClick={onSearchToggle}
            className="absolute top-8 right-8 p-4 hover:bg-gray-100 rounded-full transition-all hover-scale hover-rotate-90"
            aria-label="Close search"
          >
            <X size={32} />
          </button>
          <div className="w-full max-w-3xl text-center animate-fade-in-up">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8 animate-fade-in-down">
              {t('layout.search.title')}
            </h2>
            <form onSubmit={onSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('layout.search.placeholder')}
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="w-full bg-transparent border-b-2 border-gray-100 py-6 text-2xl md:text-5xl font-light serif outline-none focus:border-[#D4AF37] transition-all"
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-[#D4AF37]" aria-label="Submit search">
                <Search size={32} />
              </button>
            </form>
            <div className="mt-12 flex flex-wrap justify-center gap-4 animate-fade-in-up animate-delay-300">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {t('layout.search.trending')}
              </span>
              {trendingItems.map((tag, index) => (
                <button
                  key={tag}
                  onClick={() => onTrendingClick(tag)}
                  className="text-xs uppercase tracking-widest hover:text-[#D4AF37] transition-all hover-scale"
                  style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                  aria-label={`Search for ${tag}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-[#1F2937] text-white py-2 px-4 md:px-8 flex justify-between items-center text-xs">
        <div className="hidden md:flex items-center space-x-6">
          <span className="flex items-center">
            <Phone size={14} className="mr-2" /> {t('layout.topBar.phone')}
          </span>
          <span className="flex items-center">
            <Mail size={14} className="mr-2" /> {t('layout.topBar.email')}
          </span>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center space-x-3">
            <Instagram size={14} className="cursor-pointer hover:text-[#D4AF37]" />
            <Facebook size={14} className="cursor-pointer hover:text-[#D4AF37]" />
            <Twitter size={14} className="cursor-pointer hover:text-[#D4AF37]" />
          </div>
          {!isAuthenticated ? (
            <div className="flex space-x-3">
              <Link to="/login" className="cursor-pointer hover:underline">
                {t('layout.topBar.logIn')}
              </Link>
              <span className="text-gray-500">|</span>
              <Link to="/signup" className="cursor-pointer hover:underline">
                {t('layout.topBar.joinNow')}
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <User size={14} />
              <span className="text-xs">Welcome, {user?.name?.split(' ')[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 py-5'} animate-fade-in-down`}>
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <button className="md:hidden" onClick={onMenuToggle} aria-label="Toggle menu">
            <MenuIcon size={24} />
          </button>


          <Link to="/" className="text-2xl md:text-3xl font-bold tracking-tighter text-[#1F2937] serif">
            LuxeNest<span className="text-[#D4AF37]">.</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium wide uppercase tracking-wider">
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">
              {t('layout.header.home')}
            </Link>
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button className={`hover:text-[#D4AF37] transition-colors flex items-center outline-none uppercase ${open ? 'text-[#D4AF37]' : ''}`}>
                    {t('layout.header.shop')} <ChevronDown size={14} className={`ml-1 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-50 top-full left-0 mt-3 w-[600px] bg-white shadow-2xl border-t-2 border-[#D4AF37] p-8 -ml-20 rounded-b-2xl">
                      <div className="grid grid-cols-3 gap-8">
                        <div>
                          <h4 className="font-bold mb-4 text-[#1F2937] uppercase text-xs tracking-widest">{t('layout.header.rooms')}</h4>
                          <ul className="space-y-3 normal-case font-normal text-gray-500 text-sm">
                            {categories.map((cat: any) => (
                              <li key={cat._id || cat.id}>
                                <Link to={`/shop?cat=${cat._id || cat.id}`} className="hover:text-[#D4AF37] transition-colors flex items-center justify-between group">
                                  <div className="flex items-center">
                                    <span className="w-1 h-1 bg-[#D4AF37] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    {cat.name}
                                  </div>
                                  <span className="text-[10px] text-gray-400 group-hover:text-[#D4AF37] transition-colors font-bold">{cat.count || 0}</span>
                                </Link>
                              </li>
                            ))}
                            {categories.length === 0 && (
                              <li className="text-gray-400 italic">No categories available</li>
                            )}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold mb-4 text-[#1F2937] uppercase text-xs tracking-widest">{t('layout.header.featured')}</h4>
                          <ul className="space-y-3 normal-case font-normal text-gray-500 text-sm">
                            <li>
                              <Link to="/shop?tag=new" className="hover:text-[#D4AF37] transition-colors flex items-center group">
                                <span className="w-1 h-1 bg-[#D4AF37] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                {t('layout.header.newArrivals')}
                              </Link>
                            </li>
                            <li>
                              <Link to="/shop?tag=sale" className="hover:text-[#D4AF37] transition-colors flex items-center group">
                                <span className="w-1 h-1 bg-[#D4AF37] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                {t('layout.header.onSale')}
                              </Link>
                            </li>
                            <li>
                              <Link to="/shop?tag=best" className="hover:text-[#D4AF37] transition-colors flex items-center group">
                                <span className="w-1 h-1 bg-[#D4AF37] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                {t('layout.header.bestSellers')}
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <img src="https://picsum.photos/seed/promo/400/300" alt="Promo" className="w-full h-32 object-cover mb-3 rounded-lg shadow-sm" />
                          <p className="text-[11px] normal-case text-gray-400 leading-relaxed">
                            {t('layout.header.promoText')}
                          </p>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            <Link to="/about" className="hover:text-[#D4AF37] transition-colors">
              {t('layout.header.about')}
            </Link>
            <Link to="/contact" className="hover:text-[#D4AF37] transition-colors">
              {t('layout.header.contact')}
            </Link>
          </nav>

          <div className="flex items-center space-x-5">
            <button
              onClick={onSearchToggle}
              className="hover:text-[#D4AF37] transition-colors"
              aria-label="Open search"
            >
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="hover:text-[#D4AF37] relative transition-all hover-scale">
              <Heart size={20} className="transition-transform hover:scale-110" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-pulse cart-count-pop">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button onClick={onOpenCart} className="hover:text-[#D4AF37] relative transition-all hover-scale" aria-label={`Open cart (${cartCount} items)`}>
              <ShoppingBag size={22} className="transition-transform hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold cart-count-pop animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
            {isAuthenticated ? (
              <Menu as="div" className="relative">
                <Menu.Button className="hover:text-[#D4AF37] transition-colors flex items-center space-x-1 outline-none">
                  <User size={22} />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 focus:outline-none">
                    <div className="px-4 py-2 border-b border-gray-50 mb-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="text-sm font-bold text-[#1F2937] truncate">{user?.email}</p>
                    </div>
                    {user?.role === 'ADMIN' && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/admin"
                            className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${active ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-[#D4AF37]'
                              } font-bold`}
                          >
                            <LayoutDashboard size={16} />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/account"
                          className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${active ? 'bg-gray-50 text-[#D4AF37]' : 'text-gray-700'
                            }`}
                        >
                          <Settings size={16} />
                          <span>My Account</span>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/account"
                          className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${active ? 'bg-gray-50 text-[#D4AF37]' : 'text-gray-700'
                            }`}
                        >
                          <Package size={16} />
                          <span>My Orders</span>
                        </Link>
                      )}
                    </Menu.Item>
                    <hr className="my-2 border-gray-50" />
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            logout();
                            toast.success('Logged out successfully');
                          }}
                          className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors w-full text-left ${active ? 'bg-red-50 text-red-600' : 'text-red-600'
                            }`}
                          aria-label="Logout"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium hover:text-[#D4AF37] transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="text-sm font-medium bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#1F2937] transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 animate-fade-in">
          <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-white p-6 shadow-2xl animate-slide-in-left">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold serif">LuxeNest</span>
              <button onClick={onMenuToggle} aria-label="Close menu"><X size={24} /></button>
            </div>
            <nav className="flex flex-col space-y-6 text-lg uppercase tracking-wide">
              <Link to="/" onClick={onMenuToggle}>{t('layout.mobileMenu.home')}</Link>
              <Link to="/shop" onClick={onMenuToggle}>{t('layout.mobileMenu.shop')}</Link>
              <Link to="/about" onClick={onMenuToggle}>{t('layout.mobileMenu.aboutUs')}</Link>
              <Link to="/contact" onClick={onMenuToggle}>{t('layout.mobileMenu.contact')}</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/account" onClick={onMenuToggle}>My Account</Link>
                  <button
                    onClick={() => {
                      logout();
                      toast.success('Logged out successfully');
                      onMenuToggle();
                    }}
                    className="text-left text-red-600"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={onMenuToggle}>Login</Link>
                  <Link to="/signup" onClick={onMenuToggle}>Sign Up</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#1F2937] text-white pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-6 serif tracking-tight">
                LuxeNest<span className="text-[#D4AF37]">.</span>
              </h3>
              <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
                {t('layout.footer.description')}
              </p>
              <div className="flex space-x-4">
                <Instagram className="cursor-pointer hover:text-[#D4AF37]" />
                <Facebook className="cursor-pointer hover:text-[#D4AF37]" />
                <Twitter className="cursor-pointer hover:text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase text-sm tracking-widest text-[#D4AF37]">
                {t('layout.footer.quickLinks')}
              </h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li>
                  <Link to="/shop" className="hover:text-white transition-colors">
                    {t('layout.footer.shopAll')}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    {t('layout.footer.ourStory')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    {t('layout.footer.contactUs')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase text-sm tracking-widest text-[#D4AF37]">
                {t('layout.footer.account')}
              </h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    {t('layout.footer.login')}
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-white transition-colors">
                    {t('layout.footer.signUp')}
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="hover:text-white transition-colors">
                    {t('layout.footer.wishlist')}
                  </Link>
                </li>
                <li>
                  <Link to="/admin-login" className="text-[#D4AF37] font-bold hover:underline transition-colors">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase text-sm tracking-widest text-[#D4AF37]">
                {t('layout.footer.newsletter')}
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                {t('layout.footer.newsletterDescription')}
              </p>
              <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder={t('layout.footer.emailPlaceholder')}
                  className="bg-transparent border border-gray-600 px-4 py-3 text-sm focus:border-[#D4AF37] outline-none"
                />
                <button className="bg-[#D4AF37] text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                  {t('layout.footer.joinUs')}
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>{t('layout.footer.copyright')}</p>
          </div>
        </div>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;

