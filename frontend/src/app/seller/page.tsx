"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SellerDashboard() {
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [fetchError, setFetchError] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    title: '', description: '', price: 0, image_url: '', category: '', 
    bulk_price: 0, min_order_quantity: 1, inventory_count: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/seller/login');
      } else if (user.role !== 'seller' && user.role !== 'admin') {
        router.push('/');
      } else {
        if (activeTab === 'overview') {
          fetchStats();
        } else if (activeTab === 'products') {
          fetchProducts();
        } else if (activeTab === 'orders') {
          fetchOrders();
        }
      }
    }
  }, [user, isLoading, router, activeTab]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}'}/seller/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      setFetchError('');
    } catch (err: any) {
      setFetchError(err.response?.data?.detail || 'Failed to fetch seller dashboard data');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}'}/seller/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
      setFetchError('');
    } catch (err: any) {
      setFetchError(err.response?.data?.detail || 'Failed to fetch products');
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      setIsUploading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}'}/products/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.url;
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = newProduct.image_url;
    
    if (selectedFile) {
      const uploadedUrl = await handleFileUpload(selectedFile);
      if (!uploadedUrl) return;
      imageUrl = uploadedUrl;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}'}/seller/products', { ...newProduct, image_url: imageUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAddingProduct(false);
      setNewProduct({
        title: '', description: '', price: 0, image_url: '', category: '', 
        bulk_price: 0, min_order_quantity: 1, inventory_count: 0
      });
      setSelectedFile(null);
      fetchProducts();
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to add product');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = editingProduct.image_url;
    
    if (selectedFile) {
      const uploadedUrl = await handleFileUpload(selectedFile);
      if (!uploadedUrl) return;
      imageUrl = uploadedUrl;
    }

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/seller/products/${editingProduct.id}`, { ...editingProduct, image_url: imageUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      setEditingProduct(null);
      setSelectedFile(null);
      fetchProducts();
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/seller/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete product');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}'}/seller/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setFetchError('');
    } catch (err: any) {
      setFetchError(err.response?.data?.detail || 'Failed to fetch orders');
    }
  };

  if (isLoading || !user || (user.role !== 'seller' && user.role !== 'admin')) {
    return <div className="flex justify-center items-center h-screen bg-gray-50 text-black">Loading Seller Portal...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          <div className="flex gap-4 items-center">
            <span>Welcome, {user.name}</span>
            <button 
              onClick={() => {
                logout();
                router.push('/seller/login');
              }}
              className="px-4 py-2 bg-blue-800 rounded hover:bg-blue-900 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex border-b">
          <button 
            className={`flex-1 py-3 font-semibold ${activeTab === 'overview' ? 'bg-gray-100 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`flex-1 py-3 font-semibold ${activeTab === 'products' ? 'bg-gray-100 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={`flex-1 py-3 font-semibold ${activeTab === 'orders' ? 'bg-gray-100 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>
        
        <div className="p-6 text-black">
          {fetchError && <p className="text-red-600 mb-4">{fetchError}</p>}

          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center">
                  <span className="text-gray-500 text-sm font-bold uppercase">Total Products</span>
                  <span className="text-3xl font-bold text-blue-600 mt-2">{stats ? stats.total_products : 0}</span>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center">
                  <span className="text-gray-500 text-sm font-bold uppercase">Total Orders</span>
                  <span className="text-3xl font-bold text-yellow-500 mt-2">{stats?.total_orders || 0}</span>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center">
                  <span className="text-gray-500 text-sm font-bold uppercase">Total Revenue</span>
                  <span className="text-3xl font-bold text-green-600 mt-2">₹{stats ? stats.total_revenue : 0}</span>
                </div>
              </div>
              
              {stats && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                  <p className="text-blue-800">{stats.message} ({stats.seller_email})</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Product Catalog</h2>
                <button 
                  onClick={() => setIsAddingProduct(!isAddingProduct)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {isAddingProduct ? 'Cancel' : '+ Add Product'}
                </button>
              </div>

              {isAddingProduct && (
                <form onSubmit={handleAddProduct} className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                  <h3 className="font-semibold mb-4 text-lg text-blue-800">Add New Product</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Title" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="w-full p-2 border rounded" />
                    <input type="text" placeholder="Category" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Retail Price" required value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Bulk Price" required value={newProduct.bulk_price || ''} onChange={e => setNewProduct({...newProduct, bulk_price: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Min Order Quantity" required value={newProduct.min_order_quantity || ''} onChange={e => setNewProduct({...newProduct, min_order_quantity: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Inventory Count" required value={newProduct.inventory_count || ''} onChange={e => setNewProduct({...newProduct, inventory_count: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Product Photo</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => setSelectedFile(e.target.files?.[0] || null)} 
                        className="w-full p-2 border rounded bg-white" 
                      />
                      <p className="text-xs text-gray-500 mt-1">Or provide a URL below</p>
                    </div>
                    <input type="text" placeholder="Image URL (optional if file uploaded)" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="w-full p-2 border rounded md:col-span-2" />
                    <textarea placeholder="Description" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-2 border rounded md:col-span-2" rows={3}></textarea>
                  </div>
                  <button type="submit" disabled={isUploading} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold disabled:bg-gray-400">
                    {isUploading ? 'Uploading Image...' : 'Save Product'}
                  </button>
                </form>
              )}

              {isEditing && editingProduct && (
                <form onSubmit={handleUpdateProduct} className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200">
                  <h3 className="font-semibold mb-4 text-lg text-blue-800">Edit Product: {editingProduct.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                      <input type="text" required value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                      <input type="text" required value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Retail Price (₹)</label>
                      <input type="number" required value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Bulk Price (₹)</label>
                      <input type="number" required value={editingProduct.bulk_price} onChange={e => setEditingProduct({...editingProduct, bulk_price: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Min Order Quantity</label>
                      <input type="number" required value={editingProduct.min_order_quantity} onChange={e => setEditingProduct({...editingProduct, min_order_quantity: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Inventory Count</label>
                      <input type="number" required value={editingProduct.inventory_count} onChange={e => setEditingProduct({...editingProduct, inventory_count: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Change Photo</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => setSelectedFile(e.target.files?.[0] || null)} 
                        className="w-full p-2 border rounded bg-white" 
                      />
                      <p className="text-xs text-gray-500 mt-1 italic">Leave empty to keep current photo or provide new URL below</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Image URL</label>
                      <input type="text" required value={editingProduct.image_url} onChange={e => setEditingProduct({...editingProduct, image_url: e.target.value})} className="w-full p-2 border rounded" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                      <textarea required value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full p-2 border rounded" rows={3}></textarea>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={isUploading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold shadow-sm disabled:bg-gray-400">
                      {isUploading ? 'Uploading Image...' : 'Update Product'}
                    </button>
                    <button type="button" onClick={() => { setIsEditing(false); setEditingProduct(null); setSelectedFile(null); }} className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 font-semibold shadow-sm">Cancel</button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-3 border-b">ID</th>
                      <th className="p-3 border-b">Title</th>
                      <th className="p-3 border-b">Category</th>
                      <th className="p-3 border-b">Price</th>
                      <th className="p-3 border-b">Inventory</th>
                      <th className="p-3 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p: any) => (
                      <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-3">{p.id}</td>
                        <td className="p-3 font-medium">{p.title}</td>
                        <td className="p-3">{p.category}</td>
                        <td className="p-3">₹{p.price}</td>
                        <td className="p-3 font-bold">{p.inventory_count}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { setIsEditing(true); setEditingProduct(p); setIsAddingProduct(false); }}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold hover:bg-blue-200 transition"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-bold hover:bg-red-200 transition"
                            >
                              Delete
                            </button>
                          </div>
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

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Customer Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-3 border-b">Order ID</th>
                      <th className="p-3 border-b">Customer</th>
                      <th className="p-3 border-b">Address</th>
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
                        <td className="p-3 text-sm">{o.address}, {o.city} - {o.zip_code}</td>
                        <td className="p-3">₹{o.total_amount.toFixed(2)}</td>
                        <td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            o.status === 'completed' || o.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            o.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            o.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            o.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {o.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-3 text-center text-gray-500">No orders found.</td>
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
