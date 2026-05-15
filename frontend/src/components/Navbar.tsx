"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, LogOut, User as UserIcon, LayoutDashboard, Package, Truck, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, token, logout, isLoading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 w-full z-50 flex flex-col">
      {/* Top Announcement Bar for B2B */}
      <div className="bg-slate-900 text-white text-xs font-semibold tracking-wide py-2 px-4 flex justify-center items-center gap-2">
        <Info className="w-4 h-4 text-rose-500" />
        <span>B2B EXCLUSIVE: FREE SHIPPING ON WHOLESALE ORDERS OVER ₹50,000</span>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 border-b ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-gray-200 py-3' : 'bg-white border-transparent py-5'} px-6`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
            Saree<span className="text-rose-600">Wholesale</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-bold text-slate-600 hover:text-rose-600 uppercase tracking-widest transition">
              Catalog
            </Link>
            
            {isLoading ? (
              <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
                <div className="h-5 w-20 bg-slate-100 animate-pulse rounded"></div>
              </div>
            ) : token ? (
              <div className="flex items-center gap-6 border-l pl-6 border-slate-200">
                {user?.role === 'admin' && (
                  <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-rose-600 transition">
                    <LayoutDashboard className="w-4 h-4" /> Admin
                  </Link>
                )}
                {user?.role === 'seller' && (
                  <Link href="/seller" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-rose-600 transition">
                    <LayoutDashboard className="w-4 h-4" /> Seller
                  </Link>
                )}
                {user?.role === 'delivery' && (
                  <Link href="/delivery" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-rose-600 transition">
                    <Truck className="w-4 h-4" /> Delivery
                  </Link>
                )}
                {(user?.role === 'buyer' || user?.role === 'seller') && (
                  <Link href="/orders" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-rose-600 transition">
                    <Package className="w-4 h-4" /> Orders
                  </Link>
                )}
                
                <Link href="/cart" className="relative group p-2 text-slate-600 hover:text-rose-600 transition">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                    0
                  </span>
                </Link>
                
                <div className="flex items-center gap-4 ml-4">
                  <Link href="/profile" className="flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-rose-600 transition">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-rose-600 border border-slate-200">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <span>{user?.name?.split(' ')[0]}</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="text-slate-400 hover:text-rose-600 transition"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
                <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-rose-600 uppercase tracking-widest transition">
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors duration-300 shadow-md"
                >
                  Join B2B
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
