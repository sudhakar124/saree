"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix leaflet marker icon issue in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapComponent({ address, city }: { address: string, city: string }) {
  // In a real app, we would geocode the address to coordinates.
  // For this demo, we'll just use a generic center (Hyderabad) or try to estimate based on city.
  const position: [number, number] = [17.3850, 78.4867]; // Default Hyderabad

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 mt-4 relative z-0">
      <MapContainer center={position} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon}>
          <Popup>
            Delivery Area: {city} <br /> {address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
