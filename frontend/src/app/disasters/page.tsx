'use client';
import { useState } from 'react';

export default function DisastersPage() {
  const [activeTab, setActiveTab] = useState('Flood');

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-2">Disaster Prediction Engine</h2>
      <p className="text-slate-400 mb-6">AI-driven predictive models using local datasets (XGBoost/Random Forest simulation).</p>

      <div className="flex space-x-2 border-b border-slate-700 pb-2">
        {['Flood', 'Cyclone', 'Earthquake', 'Wildfire'].map(type => (
          <button 
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-2 rounded-t-xl font-medium transition-colors ${activeTab === type ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">{activeTab} Risk Analysis</h3>
            <p className="text-slate-400 mt-1">Based on historical data and current simulated inputs.</p>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Overall Risk</span>
            <p className={`text-4xl font-bold mt-1 ${activeTab === 'Flood' ? 'text-red-400' : activeTab === 'Cyclone' ? 'text-teal-400' : 'text-orange-400'}`}>
              {activeTab === 'Flood' ? '85%' : activeTab === 'Cyclone' ? '12%' : '45%'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Contributing Factors</h4>
            {activeTab === 'Flood' && (
              <>
                <div className="bg-slate-800 p-3 rounded-xl"><span className="text-slate-400">Rainfall:</span> <span className="text-red-400 font-bold ml-2">120mm/hr (Critical)</span></div>
                <div className="bg-slate-800 p-3 rounded-xl"><span className="text-slate-400">River Level:</span> <span className="text-red-400 font-bold ml-2">+2.4m Above Safe</span></div>
                <div className="bg-slate-800 p-3 rounded-xl"><span className="text-slate-400">Soil Moisture:</span> <span className="text-orange-400 font-bold ml-2">98% Saturated</span></div>
              </>
            )}
            {activeTab !== 'Flood' && (
              <div className="bg-slate-800 p-3 rounded-xl"><span className="text-slate-400">Simulated Data:</span> <span className="text-teal-400 font-bold ml-2">Within Normal Parameters</span></div>
            )}
          </div>
          
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 flex items-center justify-center relative overflow-hidden">
             <div className={`w-48 h-48 rounded-full blur-3xl ${activeTab === 'Flood' ? 'bg-red-500/30' : activeTab === 'Cyclone' ? 'bg-teal-500/30' : 'bg-orange-500/30'} animate-pulse`}></div>
             <p className="z-10 text-slate-300 font-medium absolute text-center bg-slate-900/60 p-2 rounded-lg backdrop-blur-sm">Predictive Heatmap Simulation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
