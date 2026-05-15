"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function Cart() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [token, isLoading, router]);

  useEffect(() => {
    if (!token) return;
    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cart/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(response.data);
      } catch (error) {
        console.error("Failed to fetch cart", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, router]);

  const removeItem = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const calculateItemPrice = (item: any) => {
    if (item.product.bulk_price && item.quantity >= item.product.min_order_quantity) {
      return item.product.bulk_price;
    }
    return item.product.price;
  };

  const total = items.reduce((sum, item) => sum + (calculateItemPrice(item) * item.quantity), 0);

  if (loading) return <div className="animate-pulse text-center mt-20">Loading Cart...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-900 border-b pb-4">Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-lg space-y-4">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
          <p className="text-gray-500">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/" className="inline-block bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow space-y-4">
            {items.map((item) => {
              const appliedPrice = calculateItemPrice(item);
              const isBulk = appliedPrice === item.product.bulk_price;
              
              return (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-md flex items-center space-x-6">
                <img 
                  src={item.product.image_url} 
                  alt={item.product.title} 
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900">{item.product.title}</h3>
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                  <p className="text-rose-600 font-bold">
                    ₹{appliedPrice.toLocaleString()} 
                    {isBulk && <span className="text-xs ml-2 bg-rose-100 text-rose-800 px-2 py-1 rounded">Wholesale Price</span>}
                  </p>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-rose-600 p-2 transition"
                >
                  {/* Note: In a real app we'd use Trash2 from lucide-react, but I'll use a text fallback if icon fails */}
                  <span className="text-sm font-bold uppercase">Remove</span>
                </button>
              </div>
              );
            })}
          </div>

          <div className="w-full lg:w-80 h-fit bg-white p-8 rounded-2xl shadow-xl space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
            <div className="space-y-2 border-b pb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-extrabold text-gray-900">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => router.push('/checkout')}
              className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-700 transition duration-300 shadow-lg shadow-rose-100">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
