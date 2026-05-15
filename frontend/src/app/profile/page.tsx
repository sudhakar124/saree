"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Profile() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
        <button
          onClick={handleLogout}
          className="bg-rose-100 text-rose-600 px-4 py-2 rounded-lg font-medium hover:bg-rose-200 transition"
        >
          Logout
        </button>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Full Name</p>
          <p className="text-lg text-gray-900">{user.name}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Email</p>
          <p className="text-lg text-gray-900">{user.email}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Account Role</p>
          <p className="text-lg text-gray-900 capitalize">{user.role}</p>
        </div>

        {(user as any).business_name && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 font-medium">Business Name</p>
            <p className="text-lg text-gray-900">{(user as any).business_name}</p>
          </div>
        )}

        {(user as any).gst_number && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 font-medium">GST Number</p>
            <p className="text-lg text-gray-900">{(user as any).gst_number}</p>
          </div>
        )}
      </div>
    </div>
  );
}
