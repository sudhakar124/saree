"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const { token, logout } = useAuth();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/products/${id}`);
        setProduct(response.data);
        // Default to 1 instead of forcing MOQ
        setQuantity(1);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      router.push('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/cart/`, 
        { product_id: product.id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push('/cart');
    } catch (error: any) {
      console.error("Failed to add to cart", error);
      if (error.response?.status === 401) {
        logout();
        alert("Your session has expired. Please log in again.");
        router.push('/login');
      } else {
        alert(error.response?.data?.detail || "Failed to add to cart. Please try again.");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="animate-pulse flex justify-center mt-20">Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="space-y-8">
      <Link href="/" className="inline-flex items-center text-rose-600 font-semibold hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-xl">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-6 flex flex-col justify-between">
          <div>
            <div className="space-y-2 mb-6">
              <span className="text-rose-600 font-bold uppercase tracking-wider text-sm">{product.category}</span>
              <h1 className="text-4xl font-extrabold text-gray-900">{product.title}</h1>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Retail Price:</span>
                <span className="text-2xl font-bold text-gray-400 line-through">₹{product.price.toLocaleString()}</span>
              </div>
              {product.bulk_price && (
                <div className="flex justify-between items-center bg-rose-50 p-3 rounded-lg border border-rose-100">
                  <span className="text-rose-800 font-bold">Wholesale Price:</span>
                  <span className="text-3xl font-extrabold text-rose-600">₹{product.bulk_price.toLocaleString()}</span>
                </div>
              )}
              {product.min_order_quantity > 1 && (
                <div className="text-sm text-gray-500 text-right">
                  Minimum Order Quantity: <strong>{product.min_order_quantity} units</strong>
                </div>
              )}
            </div>
            
            <div className="border-t border-b border-gray-100 py-6 mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-20 text-center py-2 border border-gray-300 rounded-lg font-bold"
                  min={1}
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                >
                  +
                </button>
              </div>
              {product.min_order_quantity > 1 && quantity < product.min_order_quantity && (
                <p className="text-orange-500 text-sm mt-1">Note: Order at least {product.min_order_quantity} units to get the wholesale price.</p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || quantity < 1}
              className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 hover:bg-rose-700 transition duration-300 shadow-lg shadow-rose-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-6 h-6" />
              <span>{addingToCart ? 'Adding...' : `Add to Cart - ₹${(quantity * (product.bulk_price || product.price)).toLocaleString()}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
