"use client";

import Link from 'next/link';
import { ShieldCheck, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: number;
  image_url: string;
  category: string;
  bulk_price?: number;
  min_order_quantity?: number;
}

const ProductCard = ({ product }: { product: Product }) => {
  const discountPercentage = product.bulk_price 
    ? Math.round(((product.price - product.bulk_price) / product.price) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
      
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-4 right-4 z-10 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
          {discountPercentage}% Bulk Margin
        </div>
      )}

      <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
        <div className="relative h-72 w-full overflow-hidden shrink-0 bg-slate-100">
          <img 
            src={product.image_url} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute bottom-4 left-4 flex gap-2">
            <div className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
              {product.category}
            </div>
            <div className="bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified
            </div>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors" title={product.title}>
            {product.title}
          </h3>
          
          <div className="space-y-3 mb-6 flex-1 border-b border-slate-100 pb-4">
            {/* Retail Price Reference */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Retail M.R.P:</span>
              <span className="font-semibold text-slate-400 line-through">₹{product.price.toLocaleString()}</span>
            </div>
            
            {/* Wholesale Pricing Structure */}
            {(product.bulk_price && product.min_order_quantity) ? (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-slate-800 font-bold text-sm">Wholesale Price</span>
                  <span className="text-2xl font-black text-rose-600">₹{product.bulk_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200/60">
                  <span className="text-xs text-slate-500 font-medium">MOQ required</span>
                  <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">{product.min_order_quantity} Units</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-end">
                  <span className="text-slate-800 font-bold text-sm">Standard Price</span>
                  <span className="text-2xl font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200/60">
                  <span className="text-xs text-slate-500 font-medium">No MOQ requirement</span>
                </div>
              </div>
            )}
          </div>
          
          <button className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl font-bold text-sm group-hover:bg-rose-600 group-hover:shadow-lg group-hover:shadow-rose-600/20 transition-all duration-300 flex items-center justify-center gap-2">
            View Details <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
