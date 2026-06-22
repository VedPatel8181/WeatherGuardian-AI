import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

import SOSButton from './SOSButton';

export const metadata: Metadata = {
  title: 'WeatherGuardian AI',
  description: 'Offline Weather Forecasting & Emergency Response Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-900 text-slate-50 flex h-screen overflow-hidden`}>
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              WeatherGuardian AI
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Offline System Active</p>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <a href="/" className="block px-4 py-2 rounded-lg hover:bg-slate-700/50 text-slate-300">Dashboard</a>
            <a href="/weather" className="block px-4 py-2 rounded-lg hover:bg-slate-700/50 text-slate-300">Weather Center</a>
            <a href="/disasters" className="block px-4 py-2 rounded-lg hover:bg-slate-700/50 text-slate-300">Disaster Prediction</a>
            <a href="/assistant" className="block px-4 py-2 rounded-lg hover:bg-slate-700/50 text-slate-300">Emergency Assistant</a>
            <a href="/shelters" className="block px-4 py-2 rounded-lg hover:bg-slate-700/50 text-slate-300">Shelter Finder</a>
            <a href="/routes" className="block px-4 py-2 rounded-lg hover:bg-slate-700/50 text-slate-300">Safe Route Planner</a>
            <a href="/map" className="block px-4 py-2 rounded-lg hover:bg-slate-700/50 text-slate-300">India Map Tracker</a>
            <div className="pt-4 mt-4 border-t border-slate-700">
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Advanced Modules</p>
              <a href="/drones" className="block px-4 py-2 rounded-lg hover:bg-slate-700/50 text-slate-300">Drone Ops</a>
              <a href="/mesh" className="block px-4 py-2 rounded-lg hover:bg-slate-700/50 text-slate-300">Mesh Network</a>
              <a href="/admin" className="block px-4 py-2 rounded-lg hover:bg-slate-700/50 text-slate-300">Admin Panel</a>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-900">
          <header className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
              <SOSButton />
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
