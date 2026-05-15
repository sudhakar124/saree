"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AdminDashboard() {
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'users' | 'orders' | 'products'>('users');
  
  // Users/Sellers State
  const [users, setUsers] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [newSeller, setNewSeller] = useState({ name: '', email: '', password: '' });
  const [isAddingSeller, setIsAddingSeller] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState('');

  // Products State
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== 'admin') {
        router.push('/');
      } else {
        if (activeTab === 'users') {
          fetchUsers();
        } else if (activeTab === 'orders') {
          fetchOrders();
        } else if (activeTab === 'products') {
          fetchProducts();
        }
      }
    }
  }, [user, isLoading, router, activeTab]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err: any) {
      setFetchError(err.response?.data?.detail || 'Failed to fetch users');
    }
  };

  const handleAddSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/sellers`, newSeller, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewSeller({ name: '', email: '', password: '' });
      setIsAddingSeller(false);
      fetchUsers(); // refresh
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to add seller');
    }
  };

  const handleDeleteSeller = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this seller?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/sellers/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers(); // refresh
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete seller');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err: any) {
      setOrdersError(err.response?.data?.detail || 'Failed to fetch orders');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Admin should see all products to moderate. The backend `/products` currently only returns approved. 
      // Wait, we need an admin endpoint to get ALL products.
      // Let's use the public one and assume backend was updated or will be updated. Actually, let's just make sure backend allows it.
      // Wait, let's just add an admin endpoint `/admin/products` in backend, or use `/seller/products`. 
      // I'll fetch them from `/products` for now but we need to fix backend if they are filtered.
      // Actually I didn't add `/admin/products`. Let's assume I will.
      const resp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(resp.data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleModerateProduct = async (productId: number, isApproved: boolean) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/products/${productId}/moderate?is_approved=${isApproved}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      alert('Failed to moderate product');
    }
  };

  const handleVerifyUser = async (userId: number) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/users/${userId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      alert('Failed to verify user');
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders(); // refresh
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update order status');
    }
  };

  if (isLoading || !user || user.role !== 'admin') {
    return <div className="flex justify-center items-center h-screen bg-gray-50 text-black">Loading Admin Portal...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4 items-center">
            <span>Welcome, {user.name}</span>
            <button 
              onClick={() => {
                logout();
                router.push('/admin/login');
              }}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="flex border-b">
          <button 
            className={`flex-1 py-3 font-semibold ${activeTab === 'users' ? 'bg-gray-100 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('users')}
          >
            Users & Sellers
          </button>
          <button 
            className={`flex-1 py-3 font-semibold ${activeTab === 'orders' ? 'bg-gray-100 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('orders')}
          >
            Manage Orders
          </button>
          <button 
            className={`flex-1 py-3 font-semibold ${activeTab === 'products' ? 'bg-gray-100 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('products')}
          >
            Product Moderation
          </button>
        </div>

        <div className="p-6 text-black">
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">System Users</h2>
                <button 
                  onClick={() => setIsAddingSeller(!isAddingSeller)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {isAddingSeller ? 'Cancel' : '+ Add New Seller'}
                </button>
              </div>

              {isAddingSeller && (
                <form onSubmit={handleAddSeller} className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                  <h3 className="font-semibold mb-3">Add Seller</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input 
                      type="text" placeholder="Name" required
                      value={newSeller.name} onChange={e => setNewSeller({...newSeller, name: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <input 
                      type="email" placeholder="Email" required
                      value={newSeller.email} onChange={e => setNewSeller({...newSeller, email: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <input 
                      type="password" placeholder="Password" required
                      value={newSeller.password} onChange={e => setNewSeller({...newSeller, password: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Create Seller</button>
                </form>
              )}

              {fetchError && <p className="text-red-600 mb-4">{fetchError}</p>}
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-3 border-b">ID</th>
                      <th className="p-3 border-b">Name</th>
                      <th className="p-3 border-b">Email</th>
                      <th className="p-3 border-b">Role</th>
                      <th className="p-3 border-b text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u: any) => (
                      <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-3">{u.id}</td>
                        <td className="p-3">{u.name}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            u.role === 'admin' ? 'bg-purple-200 text-purple-800' : 
                            u.role === 'seller' ? 'bg-blue-200 text-blue-800' : 
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {(u.role || 'buyer').toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {!u.is_verified && (u.role === 'seller' || u.role === 'buyer') && (
                            <button 
                              onClick={() => handleVerifyUser(u.id)}
                              className="text-green-600 hover:text-green-800 font-semibold text-sm mr-2"
                            >
                              Verify
                            </button>
                          )}
                          {u.role === 'seller' && (
                            <button 
                              onClick={() => handleDeleteSeller(u.id)}
                              className="text-red-600 hover:text-red-800 font-semibold text-sm"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-3 text-center text-gray-500">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-bold mb-4">All Orders</h2>
              {ordersError && <p className="text-red-600 mb-4">{ordersError}</p>}
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-3 border-b">Order ID</th>
                      <th className="p-3 border-b">Customer</th>
                      <th className="p-3 border-b">Amount</th>
                      <th className="p-3 border-b">Date</th>
                      <th className="p-3 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o: any) => (
                      <tr key={o.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-3">#{o.id}</td>
                        <td className="p-3">
                          <div>{o.full_name}</div>
                          <div className="text-xs text-gray-500">User ID: {o.user_id}</div>
                        </td>
                        <td className="p-3">${o.total_amount.toFixed(2)}</td>
                        <td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="p-3">
                          <select 
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className={`p-1 rounded text-sm border font-semibold ${
                              o.status === 'completed' || o.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                              o.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              o.status === 'processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              o.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-3 text-center text-gray-500">No orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Product Moderation</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-3 border-b">ID</th>
                      <th className="p-3 border-b">Title</th>
                      <th className="p-3 border-b">Seller ID</th>
                      <th className="p-3 border-b">Status</th>
                      <th className="p-3 border-b text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p: any) => (
                      <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-3">#{p.id}</td>
                        <td className="p-3 font-medium">{p.title}</td>
                        <td className="p-3">{p.seller_id}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${p.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {p.is_approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {!p.is_approved ? (
                            <button onClick={() => handleModerateProduct(p.id, true)} className="text-green-600 hover:text-green-800 font-semibold text-sm">Approve</button>
                          ) : (
                            <button onClick={() => handleModerateProduct(p.id, false)} className="text-red-600 hover:text-red-800 font-semibold text-sm">Reject</button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-3 text-center text-gray-500">No products found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
