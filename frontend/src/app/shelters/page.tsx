'use client';
import { useEffect, useState } from 'react';
import MapComponent from '../../components/MapComponent';

export default function SheltersPage() {
  const [shelters, setShelters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/shelters')
      .then(res => res.json())
      .then(data => {
        setShelters(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Convert shelters to markers format
  const mapMarkers = shelters.map(s => ({
    lat: s.lat,
    lng: s.lng,
    title: s.name,
    popup: `
      <div style="color: #1e293b; font-family: sans-serif;">
        <h4 style="margin: 0 0 5px 0; font-weight: bold;">${s.name}</h4>
        <p style="margin: 0 0 5px 0; font-size: 12px; color: #475569;">${s.facilities}</p>
        <span style="font-size: 11px; font-weight: bold; color: ${s.occupancy / s.capacity > 0.8 ? '#ef4444' : '#14b8a6'}">
          Capacity: ${s.occupancy} / ${s.capacity}
        </span>
      </div>
    `
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Shelter Finder</h2>
        <p className="text-slate-400">Offline database of safehouses and medical centers across major cities in India.</p>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading offline shelters database...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shelters List */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-2">
            {shelters.map((s: any) => (
              <div key={s.id} className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl flex flex-col justify-between h-fit hover:border-slate-600 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.name}</h3>
                  <p className="text-xs text-slate-400 mb-1">Coordinates: {s.lat.toFixed(4)}° N, {s.lng.toFixed(4)}° E</p>
                  <div className="mt-3">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Facilities</span>
                    <p className="text-xs text-slate-300 mt-1">{s.facilities}</p>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">Capacity Status</span>
                    <span className="text-xs font-bold text-white">{s.occupancy} / {s.capacity}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className={`h-2 rounded-full ${s.occupancy / s.capacity > 0.8 ? 'bg-red-500' : 'bg-teal-500'}`} style={{ width: `${(s.occupancy / s.capacity) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Pane */}
          <div className="lg:col-span-1 h-[600px]">
            <MapComponent 
              center={[20.5937, 78.9629]} 
              zoom={5} 
              markers={mapMarkers} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
