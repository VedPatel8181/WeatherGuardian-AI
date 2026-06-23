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

interface Drone {
  id: string;
  status: string;
  target: string;
  battery: number;
}

export default function AdminPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [alertType, setAlertType] = useState('Evacuation Order');
  const [alertMessage, setAlertMessage] = useState('Please evacuate the lower areas immediately due to rising water levels.');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Drone simulation state
  const [activeSimulation, setActiveSimulation] = useState<{
    droneId: string;
    shelterName: string;
    supplyType: string;
    progress: number;
    status: string;
  } | null>(null);

  // Fetch all initial data
  const fetchData = async () => {
    try {
      const [alertsRes, sheltersRes, dronesRes] = await Promise.all([
        fetch('http://localhost:3001/api/alerts'),
        fetch('http://localhost:3001/api/shelters'),
        fetch('http://localhost:3001/api/drones')
      ]);
      const alertsData = await alertsRes.json();
      const sheltersData = await sheltersRes.json();
      const dronesData = await dronesRes.json();

      setAlerts(alertsData);
      setShelters(sheltersData);
      setDrones(dronesData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 5 seconds to keep the admin view updated with simulated reports
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Broadcast alert
  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertMessage.trim()) return;

    try {
      const res = await fetch('http://localhost:3001/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: alertType, message: alertMessage })
      });
      if (res.ok) {
        showToast(`Successfully broadcasted: ${alertType}`, 'success');
        setAlertMessage('');
        fetchData();
      } else {
        showToast('Failed to broadcast alert', 'error');
      }
    } catch (err) {
      showToast('Connection error during alert broadcast', 'error');
    }
  };

  // Dismiss alert
  const handleDismissAlert = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/alerts/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('Alert successfully dismissed', 'success');
        fetchData();
      } else {
        showToast('Failed to dismiss alert', 'error');
      }
    } catch (err) {
      showToast('Connection error during alert deletion', 'error');
    }
  };

  // Update shelter occupancy
  const handleUpdateOccupancy = async (id: number, newOccupancy: number) => {
    // Optimistic UI update
    setShelters(prev => prev.map(s => s.id === id ? { ...s, occupancy: newOccupancy } : s));
    try {
      const res = await fetch(`http://localhost:3001/api/shelters/${id}/occupancy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occupancy: newOccupancy })
      });
      if (!res.ok) {
        showToast('Failed to update occupancy in backend', 'error');
        fetchData(); // rollback
      }
    } catch (err) {
      showToast('Connection error during occupancy update', 'error');
      fetchData(); // rollback
    }
  };

  // Reset a drone
  const handleResetDrone = async (droneId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/drones/${droneId}/reset`, {
        method: 'POST'
      });
      if (res.ok) {
        showToast(`Drone ${droneId} successfully returned to base`, 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Connection error during drone reset', 'error');
    }
  };

  // Dispatch supply drone workflow with live simulation
  const handleDispatchSupply = async (shelterId: number, shelterName: string, supplyType: string) => {
    // Find an idle drone
    const idleDrone = drones.find(d => d.status === 'Idle');
    if (!idleDrone) {
      showToast('All drones are currently deployed or returning!', 'error');
      return;
    }

    try {
      // 1. Deploy drone in backend
      const deployRes = await fetch(`http://localhost:3001/api/drones/${idleDrone.id}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: shelterName })
      });

      if (!deployRes.ok) {
        showToast('Failed to deploy drone on the server', 'error');
        return;
      }

      // Update local state immediately
      fetchData();

      // 2. Start simulation animation on screen
      setActiveSimulation({
        droneId: idleDrone.id,
        shelterName: shelterName,
        supplyType: supplyType,
        progress: 0,
        status: 'Pre-flight takeoff checks...'
      });

      // Simulation steps (5 seconds total)
      let currentProgress = 0;
      const simInterval = setInterval(() => {
        currentProgress += 20;
        let stepStatus = 'En route...';
        if (currentProgress === 40) stepStatus = 'Approaching destination...';
        if (currentProgress === 60) stepStatus = 'Releasing supply cargo...';
        if (currentProgress === 80) stepStatus = 'Drone returning to base...';
        if (currentProgress >= 100) {
          clearInterval(simInterval);
          // Complete simulation
          setActiveSimulation(null);
          // Update shelter facilities in backend
          fetch(`http://localhost:3001/api/shelters/${shelterId}/dispatch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ supplyType })
          }).then(() => {
            showToast(`${supplyType} drop completed successfully at ${shelterName}!`, 'success');
            // Auto reset drone after delivery simulation completed
            fetch(`http://localhost:3001/api/drones/${idleDrone.id}/reset`, { method: 'POST' }).then(() => {
              fetchData();
            });
          });
        } else {
          setActiveSimulation(prev => prev ? { ...prev, progress: currentProgress, status: stepStatus } : null);
        }
      }, 1000);

    } catch (err) {
      showToast('Connection error during drone dispatch', 'error');
    }
  };

  return (
    <div className="space-y-6 relative pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-6 py-3 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 flex items-center space-x-3 border ${toast.type === 'success' ? 'bg-teal-950/90 border-teal-500 text-teal-200' : 'bg-red-950/90 border-red-500 text-red-200'}`}>
          <span className="w-2.5 h-2.5 rounded-full animate-ping bg-current"></span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-800 to-indigo-950 p-6 rounded-2xl border border-slate-700/80">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Authority Control Center</h2>
          <p className="text-slate-400 mt-1">Simulate emergencies, manage resources, and broadcast alerts across the mesh network.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-700 px-4 py-2 rounded-xl text-xs text-slate-300 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Mesh Controller Online
        </div>
      </div>

      {/* Drone Deployment Simulation Overlay Banner */}
      {activeSimulation && (
        <div className="bg-indigo-950/80 border border-indigo-500/50 backdrop-blur-md p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-indigo-500/20 text-indigo-400 p-3 rounded-xl font-bold animate-bounce text-xl">
              🚁
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Active Drone Mission: {activeSimulation.droneId}</h4>
              <p className="text-xs text-slate-400">Delivering <span className="text-indigo-300 font-semibold">{activeSimulation.supplyType}</span> to {activeSimulation.shelterName}</p>
            </div>
          </div>
          <div className="w-full md:w-64 flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-indigo-300">{activeSimulation.status}</span>
              <span className="text-white">{activeSimulation.progress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${activeSimulation.progress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Broadcast & Live Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Broadcast Form */}
        <div className="lg:col-span-1 bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              Broadcast Alert
            </h3>
            <p className="text-xs text-slate-400 mb-4">Transmit critical directives to offline citizen nodes in real-time.</p>
            
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Alert Level / Type</label>
                <select 
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Evacuation Order</option>
                  <option>Weather Warning</option>
                  <option>All Clear</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Directives / Message</label>
                <textarea 
                  rows={4}
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  placeholder="Enter alert instruction details..."
                  className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-900/30 active:scale-[0.98]"
              >
                Send Alert to All Nodes
              </button>
            </form>
          </div>
        </div>

        {/* Live Broadcast Feed */}
        <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl backdrop-blur-sm flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Active Mesh Transmissions
          </h3>
          <p className="text-xs text-slate-400 mb-4">Currently broadcasted alerts active on civilian devices.</p>

          <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3 pr-1 custom-scrollbar">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 border border-dashed border-slate-800 rounded-xl">
                <span className="text-2xl mb-1">📡</span>
                <p className="text-xs text-center">No active broadcasts in mesh network.</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className="p-4 bg-slate-900/70 border border-slate-700/50 rounded-xl flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${alert.type === 'Evacuation Order' ? 'bg-red-500/20 text-red-400' : alert.type === 'Weather Warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {alert.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-slate-300 font-medium">{alert.message}</p>
                  </div>
                  <button 
                    onClick={() => handleDismissAlert(alert.id)}
                    className="text-xs text-slate-500 hover:text-red-400 px-2 py-1 rounded border border-slate-800 hover:border-red-900/30 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Resource Optimization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Shelters Monitor */}
        <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Shelter Crowd & Resource Optimizer</h3>
              <p className="text-xs text-slate-400 mt-0.5">Control crowd loads and dispatch automated drone relief drops.</p>
            </div>
            <button onClick={fetchData} className="p-1.5 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-colors">
              🔄
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {shelters.map(shelter => {
              const capacityRatio = shelter.occupancy / shelter.capacity;
              const isFull = capacityRatio >= 0.8;
              return (
                <div key={shelter.id} className="p-4 bg-slate-900/40 border border-slate-700/40 rounded-2xl flex flex-col gap-4">
                  
                  {/* Title & Stats */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white">{shelter.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Supplies: <span className="text-slate-300 font-mono">{shelter.facilities}</span></p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isFull ? 'bg-red-950 border border-red-500/30 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                      {isFull ? 'CRITICAL CAPACITY' : 'STABLE CAPACITY'}
                    </span>
                  </div>

                  {/* Occupancy Slider & Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Crowd Capacity:</span>
                      <span className="font-semibold text-slate-200">{shelter.occupancy} / {shelter.capacity} ({Math.round(capacityRatio * 100)}%)</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="0" 
                        max={shelter.capacity}
                        value={shelter.occupancy}
                        onChange={(e) => handleUpdateOccupancy(shelter.id, parseInt(e.target.value))}
                        className="flex-1 accent-indigo-500 cursor-pointer h-2 bg-slate-700 rounded-lg appearance-none"
                      />
                    </div>
                  </div>

                  {/* Drop Dispatch Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                    <span className="text-xs font-semibold text-slate-400">Initiate Drone Supply Dispatch:</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDispatchSupply(shelter.id, shelter.name, 'Clean Water')}
                        disabled={!!activeSimulation}
                        className="bg-indigo-900/50 hover:bg-indigo-900 border border-indigo-700/50 hover:border-indigo-500 text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        💧 Dispatch Water
                      </button>
                      <button 
                        onClick={() => handleDispatchSupply(shelter.id, shelter.name, 'Food Packets')}
                        disabled={!!activeSimulation}
                        className="bg-purple-900/50 hover:bg-purple-900 border border-purple-700/50 hover:border-purple-500 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        🍱 Dispatch Food
                      </button>
                      <button 
                        onClick={() => handleDispatchSupply(shelter.id, shelter.name, 'Medical Supplies')}
                        disabled={!!activeSimulation}
                        className="bg-pink-900/50 hover:bg-pink-900 border border-pink-700/50 hover:border-pink-500 text-pink-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        🩹 Dispatch Meds
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drone Battery & Status Monitoring */}
        <div className="lg:col-span-1 bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              🚁 Drone Hangar
            </h3>
            <p className="text-xs text-slate-400 mb-6">Real-time status tracking and battery health of local UAV fleet.</p>

            <div className="space-y-4">
              {drones.map(drone => (
                <div key={drone.id} className="p-4 bg-slate-900/50 border border-slate-700/40 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{drone.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${drone.status === 'Deployed' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {drone.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Destination:</span>
                      <span className="font-medium text-slate-300 max-w-[150px] truncate">{drone.target}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Battery Status:</span>
                      <span className={`font-bold ${drone.battery < 30 ? 'text-red-400' : 'text-emerald-400'}`}>{drone.battery}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${drone.battery < 30 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${drone.battery}%` }}></div>
                  </div>

                  {drone.status !== 'Idle' && (
                    <button 
                      onClick={() => handleResetDrone(drone.id)}
                      className="w-full text-center text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
                    >
                      Recall to Base & Recharge
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
