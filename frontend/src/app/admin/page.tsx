'use client';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
      <p className="text-slate-400 mb-6">Authority panel for resource management and alert broadcasting.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Broadcast Alert (Offline Mesh)</h3>
          <div className="space-y-4">
            <select className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:outline-none">
              <option>Evacuation Order</option>
              <option>Weather Warning</option>
              <option>All Clear</option>
            </select>
            <textarea 
              rows={4}
              defaultValue="Please evacuate the lower areas immediately due to rising water levels."
              className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:outline-none"
            ></textarea>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors shadow-lg shadow-red-500/20">
              Send Alert to All Nodes
            </button>
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Resource Optimizer</h3>
          <p className="text-sm text-slate-400 mb-4">AI-driven predictive allocation of supplies.</p>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl">
              <h4 className="text-white font-semibold">Central High School Shelter</h4>
              <p className="text-xs text-orange-400 mt-1">Water supplies depleting in 4 hours</p>
              <button className="mt-3 text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg">Dispatch Supply Drone</button>
            </div>
            
            <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl">
              <h4 className="text-white font-semibold">Community Center Safehouse</h4>
              <p className="text-xs text-red-400 mt-1">Medical kits critically low</p>
              <button className="mt-3 text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg">Request Volunteers</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
