'use client';
import { useEffect, useRef, useState } from 'react';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: { lat: number; lng: number; title: string; popup?: string }[];
  routes?: [number, number][];
}

export default function MapComponent({ 
  center = [20.5937, 78.9629], // Default to center of India
  zoom = 5, 
  markers = [], 
  routes = [] 
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    // Dynamic loading of Leaflet resources
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setLeafletLoaded(true);
      document.head.appendChild(script);
    } else {
      if (typeof window !== 'undefined' && (window as any).L) {
        setLeafletLoaded(true);
      } else {
        const interval = setInterval(() => {
          if ((window as any).L) {
            setLeafletLoaded(true);
            clearInterval(interval);
          }
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Destroy previous map instance
    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView(center, zoom);

    // CartoDB Dark Matter tiles (sleek dark mode)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapInstance.current);

    // Custom marker icon due to Next.js issues with default Leaflet icon paths
    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add markers
    markers.forEach(m => {
      if (m.lat && m.lng) {
        const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(mapInstance.current);
        if (m.popup) {
          marker.bindPopup(m.popup);
        } else if (m.title) {
          marker.bindPopup(`<b>${m.title}</b>`);
        }
      }
    });

    // Add routes
    if (routes.length > 0) {
      const polyline = L.polyline(routes, { color: '#3b82f6', weight: 5, opacity: 0.8 }).addTo(mapInstance.current);
      mapInstance.current.fitBounds(polyline.getBounds());
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [leafletLoaded, center, zoom, markers, routes]);

  return (
    <div className="w-full h-full relative min-h-[350px] rounded-2xl overflow-hidden border border-slate-700 bg-slate-900">
      {!leafletLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-950/80 z-20 font-medium">
          <svg className="animate-spin h-5 w-5 mr-3 text-indigo-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Loading interactive India map...
        </div>
      )}
      <div ref={mapRef} className="w-full h-full z-10" style={{ minHeight: '350px' }} />
    </div>
  );
}
