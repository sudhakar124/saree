"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">Loading Map...</div>
});

export default function DeliveryDashboard() {
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();
  
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [driverName, setDriverName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [routeInfo, setRouteInfo] = useState('');
  
  const fetchDeliveries = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/delivery/assigned`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Assign a random tracking ID to deliveries that don't have one
      const dataWithTracking = response.data.map((d: any) => ({
        ...d,
        tracking_number: d.tracking_number || `TRK${Math.floor(10000000 + Math.random() * 90000000)}`
      }));
      setDeliveries(dataWithTracking);
      setFetchError('');
    } catch (err: any) {
      setFetchError(err.response?.data?.detail || 'Failed to fetch deliveries');
    }
  }, [token]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'delivery' && user.role !== 'admin') {
        router.push('/');
      } else {
        fetchDeliveries();
      }
    }
  }, [user, isLoading, router, fetchDeliveries]);

  const updateDeliveryStatus = async (deliveryId: number, status: string, trackingNum?: string) => {
    try {
      await axios.put(`http://localhost:8000/delivery/${deliveryId}/status`, { 
        status, 
        tracking_number: trackingNum || undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDeliveries();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update delivery');
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDelivery) return;

    try {
      await axios.put(`http://localhost:8000/delivery/${selectedDelivery.id}/status`, { 
        status: selectedDelivery.status,
        driver_name: driverName,
        vehicle_number: vehicleNumber,
        route_info: routeInfo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      fetchDeliveries();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to assign details');
    }
  };

  const openAssignModal = (delivery: any) => {
    setSelectedDelivery(delivery);
    setDriverName(delivery.driver_name || '');
    setVehicleNumber(delivery.vehicle_number || '');
    setRouteInfo(delivery.route_info || '');
    setIsModalOpen(true);
  };

  if (isLoading || !user || (user.role !== 'delivery' && user.role !== 'admin')) {
    return <div className="flex justify-center items-center h-screen bg-gray-50 text-black">Loading Delivery Portal...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="bg-teal-600 text-white p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Delivery Dashboard</h1>
          <div className="flex gap-4 items-center">
            <span className="hidden md:inline">Welcome, {user.name}</span>
            <button 
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="px-4 py-2 bg-teal-800 rounded hover:bg-teal-900 transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 text-black">
          <h2 className="text-xl font-bold mb-4">Assigned Deliveries</h2>
          {fetchError && <p className="text-red-600 mb-4">{fetchError}</p>}

          <div className="space-y-4">
            {deliveries.map((d: any) => (
              <div key={d.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg">Order #{d.order_id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      d.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      d.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {d.status.toUpperCase().replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600"><strong>Tracking No:</strong> {d.tracking_number || 'N/A'}</p>
                  <p className="text-sm text-gray-600 mt-1">Assigned on: {new Date(d.created_at).toLocaleDateString()}</p>
                  
                  {/* Display assigned info if exists */}
                  {(d.driver_name || d.vehicle_number) && (
                    <div className="mt-3 p-3 bg-white border border-gray-100 rounded text-sm space-y-1">
                      {d.driver_name && <p><strong>Driver:</strong> {d.driver_name}</p>}
                      {d.vehicle_number && <p><strong>Vehicle:</strong> {d.vehicle_number}</p>}
                      {d.route_info && <p><strong>Route:</strong> {d.route_info}</p>}
                    </div>
                  )}

                  <MapComponent address={d.address} city={d.city} />
                </div>
                
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <button 
                    onClick={() => openAssignModal(d)}
                    className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition font-bold text-sm shadow-sm mb-2"
                  >
                    Assign Driver & Route
                  </button>
                  <select 
                    value={d.status}
                    onChange={(e) => updateDeliveryStatus(d.id, e.target.value, d.tracking_number)}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 w-full"
                    disabled={d.status === 'delivered'}
                  >
                    <option value="assigned">Assigned</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed Attempt</option>
                  </select>
                  
                  {d.status !== 'delivered' && (
                    <input 
                      type="text"
                      placeholder="Add Tracking #"
                      className="p-2 border border-gray-300 rounded text-sm w-full"
                      onBlur={(e) => {
                        if (e.target.value !== d.tracking_number) {
                          updateDeliveryStatus(d.id, d.status, e.target.value);
                        }
                      }}
                      defaultValue={d.tracking_number}
                    />
                  )}
                </div>
              </div>
            ))}
            
            {deliveries.length === 0 && (
              <div className="text-center p-8 text-gray-500 border border-gray-200 rounded-lg bg-white">
                No deliveries assigned to you right now.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-teal-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Assign Details - Order #{selectedDelivery?.order_id}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-200 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Driver Name</label>
                <input 
                  type="text" 
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 outline-none text-black"
                  placeholder="E.g., Raj Kumar"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Vehicle Number</label>
                <input 
                  type="text" 
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 outline-none text-black"
                  placeholder="E.g., MH 01 AB 1234"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Route Info / Notes</label>
                <textarea 
                  value={routeInfo}
                  onChange={(e) => setRouteInfo(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 outline-none text-black h-24 resize-none"
                  placeholder="E.g., Via Western Express Highway"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded font-bold hover:bg-gray-300 transition">Cancel</button>
                <button type="submit" className="flex-1 bg-teal-600 text-white py-3 rounded font-bold hover:bg-teal-700 transition">Save Details</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
