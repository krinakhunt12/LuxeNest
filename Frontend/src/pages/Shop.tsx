import React, { Fragment } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useProducts, useCategories } from "../hooks/useProducts";

import ProductCard from "../components/Products/ProductCard";

export const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const cat = searchParams.get('cat');
  const tag = searchParams.get('tag');
  const query = searchParams.get('q');

  // Build API params
  const apiParams: any = {};
  if (cat) apiParams.category = cat;
  if (query) apiParams.search = query;
  if (tag === 'new') apiParams.isNew = 'true';
  if (tag === 'sale') apiParams.isSale = 'true';
  if (tag === 'best') apiParams.isBestSeller = 'true';

  const { data: productsData, isLoading } = useProducts(apiParams);
  const { data: categories = [] } = useCategories();

  const products = productsData?.data || [];

  const getTitle = () => {
    if (query) return `Results for "${query}"`;
    if (tag) {
      if (tag === 'new') return 'New Arrivals';
      if (tag === 'sale') return 'Special Offers';
      if (tag === 'best') return 'Best Sellers';
    }
    if (cat) {
      const category = categories.find((c: any) => c._id === cat || c.id === cat);
      return category ? `${category.name} Collection` : 'Collection';
    }
    return 'Our Collections';
  };

  if (isLoading) return (
    <div className="py-40 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
      <p className="text-gray-400 font-medium">Loading collection...</p>
    </div>
  );

  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 serif">
            {getTitle()}
          </h1>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <div className="hidden lg:block space-y-10">
            <div>
              <h3 className="font-bold uppercase tracking-widest text-xs mb-6 pb-2 border-b">Categories</h3>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link to="/shop" className="hover:text-[#D4AF37] transition-colors">All Products</Link></li>
                {categories.map((category: any) => (
                  <li key={category._id || category.id}>
                    <Link to={`/shop?cat=${category._id || category.id}`} className={`hover:text-[#D4AF37] transition-colors ${(cat === category._id || cat === category.id) ? 'text-[#D4AF37] font-bold' : ''}`}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold uppercase tracking-widest text-xs mb-6 pb-2 border-b">Featured</h3>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link to="/shop?tag=new" className={`hover:text-[#D4AF37] transition-colors ${tag === 'new' ? 'text-[#D4AF37] font-bold' : ''}`}>New Arrivals</Link></li>
                <li><Link to="/shop?tag=sale" className={`hover:text-[#D4AF37] transition-colors ${tag === 'sale' ? 'text-[#D4AF37] font-bold' : ''}`}>On Sale</Link></li>
                <li><Link to="/shop?tag=best" className={`hover:text-[#D4AF37] transition-colors ${tag === 'best' ? 'text-[#D4AF37] font-bold' : ''}`}>Best Sellers</Link></li>
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-10 text-sm text-gray-400">
              <p>Showing {products.length} products</p>

              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex items-center space-x-2 text-gray-600 font-bold uppercase tracking-widest text-[10px] hover:text-[#D4AF37] transition-colors focus:outline-none bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    <span>Sort By</span>
                    <ChevronDown size={14} />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-100 rounded-2xl shadow-xl focus:outline-none z-50 py-2">
                    {['Latest', 'Price: Low to High', 'Price: High to Low', 'Popularity'].map((option) => (
                      <Menu.Item key={option}>
                        {({ active }) => (
                          <button
                            className={`${active ? 'bg-gray-50 text-[#D4AF37]' : 'text-gray-700'
                              } group flex w-full items-center px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors`}
                          >
                            {option}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((p: any) => (
                <ProductCard
                  key={p._id || p.id}
                  product={p}
                />
              ))}
            </div>

            {products.length === 0 && (
              <div className="py-20 text-center bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
                <Link to="/shop" className="text-[#D4AF37] underline font-bold">Show all products</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};