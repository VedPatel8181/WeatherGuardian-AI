'use client';
import { useState } from 'react';

export default function DronesPage() {
  const [drones, setDrones] = useState([
    { id: 'DRN-01', status: 'Deployed', target: 'Riverside Floods', battery: 65 },
    { id: 'DRN-02', status: 'Idle', target: '-', battery: 100 },
    { id: 'DRN-03', status: 'Returning', target: 'Oak St. Fire', battery: 15 },
  ]);

  const deployDrone = (id: string) => {
    setDrones(prev => prev.map(d => d.id === id ? { ...d, status: 'Deployed', target: 'New Incident', battery: 95 } : d));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-2">Drone Operations</h2>
      <p className="text-slate-400 mb-6">Dispatch autonomous drones for damage assessment and supply drops.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {drones.map(drone => (
          <div key={drone.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">{drone.id}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${drone.status === 'Deployed' ? 'bg-blue-500/20 text-blue-400' : drone.status === 'Returning' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                {drone.status}
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-2">Target: {drone.target}</p>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Battery</span>
                <span className={drone.battery < 20 ? 'text-red-400 font-bold' : 'text-teal-400 font-bold'}>{drone.battery}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className={`h-2 rounded-full ${drone.battery < 20 ? 'bg-red-500' : 'bg-teal-500'}`} style={{ width: `${drone.battery}%` }}></div>
              </div>
            </div>
            <button 
              onClick={() => deployDrone(drone.id)}
              disabled={drone.status === 'Deployed'}
              className="w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-medium transition-colors">
              Deploy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
