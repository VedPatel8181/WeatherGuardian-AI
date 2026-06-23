'use client';
import { useEffect, useState } from 'react';
import MapComponent from '../../components/MapComponent';

interface Alert {
  id: number;
  type: string;
  message: string;
  timestamp: string;
}

interface Shelter {
  id: number;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  occupancy: number;
  facilities: string;
}

export default function IndiaMapPage() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);

  const fetchData = async () => {
    try {
      const [sheltersRes, alertsRes] = await Promise.all([
        fetch('http://localhost:3001/api/shelters'),
        fetch('http://localhost:3001/api/alerts')
      ]);
      const sheltersData = await sheltersRes.json();
      const alertsData = await alertsRes.json();
      setShelters(sheltersData);
      setAlerts(alertsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching map data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const focusLocation = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    setMapZoom(13);
  };

  // Convert shelters to markers format for MapComponent
  const mapMarkers = shelters.map(s => ({
    lat: s.lat,
    lng: s.lng,
    title: s.name,
    popup: `
      <div style="color: #1e293b; font-family: sans-serif; min-width: 150px;">
        <h4 style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px;">${s.name}</h4>
        <p style="margin: 0 0 5px 0; font-size: 12px; color: #475569;">${s.facilities}</p>
        <div style="font-size: 11px; font-weight: bold; color: ${s.occupancy / s.capacity > 0.8 ? '#ef4444' : '#14b8a6'}">
          Occupancy: ${s.occupancy}/${s.capacity} (${Math.round((s.occupancy/s.capacity)*100)}%)
        </div>
      </div>
    `
  }));

  // Dynamic warnings mapped to city names
  const cityCoordinates: { [key: string]: [number, number] } = {
    'ahmedabad': [23.0225, 72.5714],
    'sabarmati': [23.0485, 72.5723],
    'delhi': [28.6139, 77.2090],
    'mumbai': [19.0760, 72.8777],
    'dharavi': [19.0380, 72.8538],
    'chennai': [13.0827, 80.2707],
    'kolkata': [22.5726, 88.3639],
    'bengaluru': [12.9716, 77.5946]
  };

  // Map active alerts onto coordinates
  alerts.forEach(alert => {
    if (alert.type === 'All Clear') return;
    
    const textLower = alert.message.toLowerCase();
    let matchedLocation = null;
    let locationName = '';

    for (const key in cityCoordinates) {
      if (textLower.includes(key)) {
        matchedLocation = cityCoordinates[key];
        locationName = key.charAt(0).toUpperCase() + key.slice(1);
        break;
      }
    }

    if (matchedLocation) {
      mapMarkers.push({
        lat: matchedLocation[0],
        lng: matchedLocation[1],
        title: `🚨 WARNING: ${alert.type} (${locationName})`,
        popup: `
          <div style="color: #ef4444; font-family: sans-serif; min-width: 180px;">
            <h4 style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px; color: #b91c1c;">🚨 Active ${alert.type}</h4>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #374151; font-weight: 500;">${alert.message}</p>
            <span style="font-size: 10px; color: #9ca3af; font-mono">Broadcasted: ${new Date(alert.timestamp).toLocaleTimeString()}</span>
          </div>
        `
      });
    }
  });

  // Display caution indicators for overloaded shelters (>80% full)
  shelters.forEach(s => {
    if (s.occupancy / s.capacity >= 0.8) {
      mapMarkers.push({
        lat: s.lat + 0.003,
        lng: s.lng - 0.003,
        title: `⚠️ CAPACITY ALERT: ${s.name}`,
        popup: `
          <div style="color: #ea580c; font-family: sans-serif; min-width: 150px;">
            <h4 style="margin: 0 0 5px 0; font-weight: bold; font-size: 13px; color: #c2410c;">⚠️ Capacity Limit Exceeded</h4>
            <p style="margin: 0; font-size: 11px; color: #4b5563;">Occupancy is currently at ${Math.round((s.occupancy/s.capacity)*100)}%. Please divert intake.</p>
          </div>
        `
      });
    }
  });

  // Add the base warning zones (static and active incidents)
  mapMarkers.push({
    lat: 23.0485,
    lng: 72.5723,
    title: 'WARNING: Sabarmati Riverfront Flood Zone',
    popup: `
      <div style="color: #ef4444; font-family: sans-serif; min-width: 150px;">
        <h4 style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px; color: #b91c1c;">🚨 Critical Flood Alert</h4>
        <p style="margin: 0; font-size: 12px; color: #4b5563;">River level is +2.4m above warning level. Avoid water frontages.</p>
      </div>
    `
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">India Map Tracker</h2>
        <p className="text-slate-400">Real-time geographical situational awareness for Indian divisions.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 bg-slate-800/50 border border-slate-700 p-5 rounded-2xl flex flex-col justify-between overflow-y-auto max-h-[600px] custom-scrollbar">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Location Directory</h3>
            
            {loading ? (
              <div className="text-slate-400 text-sm">Loading active safehouses...</div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Active Incident (Gujarat)</span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  </div>
                  <h4 className="font-bold text-white mt-1 text-sm">Sabarmati Riverfront</h4>
                  <p className="text-xs text-slate-300 mt-1">Water level critical. High risk zone.</p>
                  <button 
                    onClick={() => focusLocation(23.0485, 72.5723)} 
                    className="text-xs text-red-400 underline mt-2 hover:text-red-300 block text-left">
                    Locate on Map
                  </button>
                </div>

                <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Active Incident (Mumbai)</span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  </div>
                  <h4 className="font-bold text-white mt-1 text-sm">Dharavi Flooding</h4>
                  <p className="text-xs text-slate-300 mt-1">Heavy rains causing localized flash floods.</p>
                  <button 
                    onClick={() => focusLocation(19.0380, 72.8538)} 
                    className="text-xs text-red-400 underline mt-2 hover:text-red-300 block text-left">
                    Locate on Map
                  </button>
                </div>

                {alerts.length > 0 && (
                  <div className="border-t border-slate-700 my-2 pt-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Active Broadcast Alerts</span>
                    <div className="space-y-2">
                      {alerts.filter(a => a.type !== 'All Clear').slice(0, 3).map(alert => (
                        <div key={alert.id} className="p-2 bg-amber-950/20 border border-amber-500/20 rounded-lg text-xs">
                          <span className="font-semibold text-amber-400 block uppercase text-[10px]">{alert.type}</span>
                          <p className="text-slate-300 mt-0.5 leading-tight">{alert.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-700 my-2 pt-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Shelters & Safehouses</span>
                </div>

                {shelters.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => focusLocation(s.lat, s.lng)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl cursor-pointer transition-all">
                    <h4 className="font-semibold text-white text-sm">{s.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{s.facilities}</p>
                    <div className="mt-2 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Capacity:</span>
                      <span className={`font-bold ${s.occupancy / s.capacity > 0.8 ? 'text-red-400' : 'text-teal-400'}`}>
                        {s.occupancy}/{s.capacity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-500">
            Click on any directory item to focus the map viewport to that coordinate.
          </div>
        </div>

        {/* Map Display */}
        <div className="lg:col-span-3 h-full min-h-[500px]">
          <MapComponent 
            center={mapCenter} 
            zoom={mapZoom} 
            markers={mapMarkers} 
          />
        </div>
      </div>
    </div>
  );
}
