'use client';
import { useEffect, useState } from 'react';

interface Drone {
  id: string;
  status: string;
  target: string;
  battery: number;
}

export default function DronesPage() {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrones = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/drones');
      const data = await res.json();
      setDrones(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching drones:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrones();
    const interval = setInterval(fetchDrones, 5000);
    return () => clearInterval(interval);
  }, []);

  const deployDrone = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/drones/${id}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'Reconnaissance Patrol' })
      });
      if (res.ok) {
        fetchDrones();
      }
    } catch (err) {
      console.error('Error deploying drone:', err);
    }
  };

  const resetDrone = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/drones/${id}/reset`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchDrones();
      }
    } catch (err) {
      console.error('Error resetting drone:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Drone Operations</h2>
          <p className="text-slate-400">Dispatch autonomous drones for damage assessment and supply drops.</p>
        </div>
        <button onClick={fetchDrones} className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-colors">
          🔄 Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="text-slate-400">Syncing with drone hangar...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {drones.map(drone => (
            <div key={drone.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-600 transition-all">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">{drone.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${drone.status === 'Deployed' ? 'bg-blue-500/20 text-blue-400' : drone.status === 'Returning' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                    {drone.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">Target: <span className="text-slate-200 font-semibold">{drone.target}</span></p>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Battery</span>
                    <span className={drone.battery < 20 ? 'text-red-400 font-bold' : 'text-teal-400 font-bold'}>{drone.battery}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className={`h-2 rounded-full ${drone.battery < 20 ? 'bg-red-500' : 'bg-teal-500'}`} style={{ width: `${drone.battery}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => deployDrone(drone.id)}
                  disabled={drone.status !== 'Idle'}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                >
                  Deploy Patrol
                </button>
                {drone.status !== 'Idle' && (
                  <button 
                    onClick={() => resetDrone(drone.id)}
                    className="w-full bg-slate-700 hover:bg-slate-650 text-slate-300 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer border border-slate-600"
                  >
                    Recall to Hangar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
