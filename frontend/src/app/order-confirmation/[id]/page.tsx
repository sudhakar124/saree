"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Package } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function OrderConfirmation() {
  const params = useParams();
  const orderId = params.id;
  const { token, isLoading } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrderData(response.data);
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
        fetchOrder();
    }
  }, [orderId, token, router]);

  if (loading) return <div className="animate-pulse text-center mt-20">Loading Order Details...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white p-10 rounded-3xl shadow-xl border-t-8 border-green-500 text-center space-y-8">
      <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-4" />
      
      <h1 className="text-4xl font-extrabold text-gray-900">Order Successful!</h1>
      <p className="text-lg text-gray-600 max-w-lg mx-auto">
        Thank you for shopping at Saree Emporium! Your beautiful sarees are being prepared for dispatch.
      </p>

      <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
        <Package className="w-48 h-48 absolute -right-10 -bottom-10 text-gray-100 rotate-12" />
        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest z-10">Order Reference ID</span>
        <span className="text-4xl font-black text-rose-600 z-10">#{orderId}</span>
      </div>
      
      {orderData && (
        <div className="text-left bg-gray-50 rounded-2xl p-6 mt-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Shipping Details</h3>
            <p className="text-gray-700"><strong>Name:</strong> {orderData.full_name}</p>
            <p className="text-gray-700"><strong>Address:</strong> {orderData.address}, {orderData.city} - {orderData.zip_code}</p>
            <p className="text-gray-700 mt-2"><strong>Total Amount Paid:</strong> ₹{orderData.total_amount.toLocaleString()}</p>
        </div>
      )}

      <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/"
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
