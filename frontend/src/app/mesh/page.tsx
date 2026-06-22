'use client';

export default function MeshNetworkPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-2">Offline Mesh Network</h2>
      <p className="text-slate-400 mb-6">Peer-to-peer communication simulator for when cell towers fail.</p>
      
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-4">Network Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-slate-400">Active Nodes</span>
              <span className="text-xl font-bold text-teal-400">142</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-slate-400">Network Health</span>
              <span className="text-xl font-bold text-teal-400">Optimal</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-slate-400">Relay Hops</span>
              <span className="text-xl font-bold text-blue-400">3.4 Avg</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-4">Network Topology</h3>
          <div className="aspect-square bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden flex items-center justify-center p-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal-500/10 rounded-full animate-ping"></div>
            <div className="w-4 h-4 bg-teal-500 rounded-full z-10 shadow-[0_0_15px_rgba(20,184,166,1)]"></div>
            
            {/* Mock Nodes */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="absolute top-3/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full"></div>
            
            {/* Mock Connections (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
              <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#60a5fa" strokeWidth="1"/>
              <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="#60a5fa" strokeWidth="1"/>
              <line x1="50%" y1="50%" x2="33%" y2="75%" stroke="#60a5fa" strokeWidth="1"/>
              <line x1="50%" y1="50%" x2="66%" y2="33%" stroke="#60a5fa" strokeWidth="1"/>
            </svg>
            
            <p className="absolute bottom-2 text-xs text-slate-500">Center: Your Device</p>
          </div>
        </div>
      </div>
    </div>
  );
}
