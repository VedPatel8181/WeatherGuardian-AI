'use client';
import { useEffect, useState } from 'react';

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

export default function Home() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsRes, sheltersRes] = await Promise.all([
          fetch('http://localhost:3001/api/alerts'),
          fetch('http://localhost:3001/api/shelters')
        ]);
        const alertsData = await alertsRes.json();
        const sheltersData = await sheltersRes.json();
        setAlerts(alertsData);
        setShelters(sheltersData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Compute stats
  const totalOccupancy = shelters.reduce((acc, s) => acc + s.occupancy, 0);
  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const avgCapacityPercent = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

  // Filter for evacuation orders and warnings
  const criticalAlerts = alerts.filter(a => a.type !== 'All Clear');
  const latestAlert = criticalAlerts.length > 0 ? criticalAlerts[0] : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Area Overview</h2>
          <p className="text-slate-400 mt-1">Real-time risk assessment and system status.</p>
        </div>
        {latestAlert && (
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </div>

      {/* Active Broadcast Warning Banner */}
      {latestAlert && (
        <div className={`p-4 rounded-xl border animate-pulse flex items-center justify-between gap-4 ${
          latestAlert.type === 'Evacuation Order' 
            ? 'bg-red-950/70 border-red-500/50 text-red-200' 
            : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">
                {latestAlert.type}: Active Emergency Broadcast
              </span>
              <p className="text-sm font-medium mt-0.5">{latestAlert.message}</p>
            </div>
          </div>
          <span className="text-xs font-mono opacity-65">{new Date(latestAlert.timestamp).toLocaleTimeString()}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Risk Card 1 */}
        <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Flood Risk</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-red-400">High</span>
          </div>
          <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
            River levels +2m
          </p>
        </div>

        {/* Risk Card 2 */}
        <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Cyclone Risk</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-teal-400">Low</span>
          </div>
          <p className="text-sm text-slate-400 mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            Clear conditions
          </p>
        </div>

        {/* Risk Card 3 */}
        <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Shelter Capacity</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{avgCapacityPercent}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 mt-3">
            <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${avgCapacityPercent}%` }}></div>
          </div>
        </div>

        {/* Risk Card 4 */}
        <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Network Status</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-blue-400">Mesh Active</span>
          </div>
          <p className="text-sm text-slate-400 mt-2">142 nodes connected</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Recent Community Reports</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="p-2 bg-red-500/20 text-red-400 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <div>
                <h4 className="font-medium text-white">Road blocked by fallen tree</h4>
                <p className="text-sm text-slate-400 mt-1">Reported 5 mins ago near Oak Street.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h4 className="font-medium text-white">Water levels rising</h4>
                <p className="text-sm text-slate-400 mt-1">Reported 12 mins ago at Riverside Park.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Emergency Assistant</h3>
            <p className="text-indigo-200/70 text-sm mb-6">AI system is standing by to provide offline guidance, survival checklists, and triage support.</p>
          </div>
          <a href="/assistant" className="w-full text-center block py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/25">
            Open Chatbot
          </a>
        </div>
      </div>
    </div>
  );
}
