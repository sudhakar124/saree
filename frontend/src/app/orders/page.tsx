"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Package, ArrowRight, RotateCcw } from 'lucide-react';

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}'}/orders/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, router]);

  const handleReorder = async (order: any) => {
    try {
      // For each item in the past order, add to cart
      for (const item of order.items) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}'}/cart/', 
          { product_id: item.product.id, quantity: item.quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      router.push('/cart');
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to reorder items. Some products may have changed.");
    }
  };

  if (loading) return <div className="animate-pulse text-center mt-20">Loading Orders...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-900 border-b pb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-lg space-y-4">
          <Package className="w-16 h-16 mx-auto text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-800">No orders yet</h2>
          <p className="text-gray-500">You haven't placed any orders yet.</p>
          <Link href="/" className="inline-block bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 p-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-100">
                <div className="flex gap-8 w-full md:w-auto mb-4 md:mb-0">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Order Placed</p>
                    <p className="text-sm font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</p>
                    <p className="text-sm font-semibold">₹{order.total_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Order ID</p>
                    <p className="text-sm font-semibold">#{order.id}</p>
                  </div>
                </div>
                <div className="w-full md:w-auto flex justify-between items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  
                  {order.delivery && order.delivery.tracking_number && (
                    <div className="text-sm text-blue-600">
                      <strong>Tracking:</strong> {order.delivery.tracking_number}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 py-2">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                        {item.product?.image_url && (
                          <img src={item.product.image_url} alt={item.product.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <Link href={`/product/${item.product_id}`} className="font-bold text-rose-600 hover:underline">
                          {item.product?.title || 'Unknown Product'}
                        </Link>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium">₹{(item.price_at_time * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => handleReorder(order)}
                    className="flex items-center gap-2 px-6 py-2 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition font-semibold"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reorder Items
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
