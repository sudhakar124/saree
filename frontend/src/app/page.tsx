"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import { CheckCircle2, Filter, Search } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/products/');
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const priceRanges = [
    { label: 'All Prices', value: 'All' },
    { label: 'Under ₹5,000', value: 'under_5000' },
    { label: '₹5,000 - ₹15,000', value: '5000_15000' },
    { label: 'Over ₹15,000', value: 'over_15000' }
  ];

  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' }
  ];

  let filteredProducts = products;

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())));
  }

  if (selectedCategory !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }

  if (selectedPriceRange !== 'All') {
    filteredProducts = filteredProducts.filter(p => {
      if (selectedPriceRange === 'under_5000') return p.price < 5000;
      if (selectedPriceRange === '5000_15000') return p.price >= 5000 && p.price <= 15000;
      if (selectedPriceRange === 'over_15000') return p.price > 15000;
      return true;
    });
  }

  filteredProducts = [...filteredProducts];
  if (selectedSort === 'price_asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === 'price_desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (selectedSort === 'featured') {
    filteredProducts.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Catalog Section with Sidebar Layout */}
      <section id="catalog">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 shrink-0 space-y-8">
            <div className="sticky top-32 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <Filter className="w-5 h-5 text-slate-700" />
                <h2 className="text-xl font-bold text-slate-900">Filters</h2>
              </div>

              {/* Search */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Search</h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search sarees..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category as string)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-rose-50 text-rose-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {category as string}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Ranges */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setSelectedPriceRange(range.value)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                        selectedPriceRange === range.value
                          ? 'bg-rose-50 text-rose-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {range.label}
                      {selectedPriceRange === range.value && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Product Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Wholesale Catalog <span className="text-slate-400 font-normal text-lg">({filteredProducts.length} items)</span>
              </h2>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider hidden sm:block">Sort By:</span>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">We couldn't find any products matching your current filters. Try adjusting your search criteria.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedPriceRange('All');
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-md"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
