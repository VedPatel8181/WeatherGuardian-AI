export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Area Overview</h2>
        <p className="text-slate-400 mt-1">Real-time risk assessment and system status.</p>
      </div>

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
            <span className="text-4xl font-bold text-white">45%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 mt-3">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
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
