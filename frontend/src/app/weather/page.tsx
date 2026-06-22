'use client';
import { useEffect, useState } from 'react';

export default function WeatherPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/weather_forecast')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-2">Weather Center</h2>
      <p className="text-slate-400 mb-6">Offline AI forecasted weather data.</p>
      
      {!data ? (
        <p className="text-slate-400">Loading forecast from Python AI Microservice...</p>
      ) : (
        <>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl mb-6">
            <h3 className="text-xl text-white mb-4 font-semibold">Current Conditions</h3>
            <div className="flex gap-12">
              <div>
                <span className="text-sm text-slate-400 uppercase tracking-wider">Temperature</span>
                <p className="text-4xl font-bold text-white mt-1">{data.current.temp}°C</p>
              </div>
              <div>
                <span className="text-sm text-slate-400 uppercase tracking-wider">Condition</span>
                <p className="text-4xl font-bold text-blue-400 mt-1">{data.current.condition}</p>
              </div>
              <div>
                <span className="text-sm text-slate-400 uppercase tracking-wider">Humidity</span>
                <p className="text-4xl font-bold text-white mt-1">{data.current.humidity}%</p>
              </div>
            </div>
          </div>

          <h3 className="text-xl text-white mb-4 font-semibold">3-Day Forecast</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.forecast.map((f: any, i: number) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl">
                <h4 className="text-lg font-bold text-white">{f.day}</h4>
                <p className="text-2xl text-white mt-2">{f.temp}°C</p>
                <p className={`mt-2 text-sm font-semibold ${f.risk.includes('High') ? 'text-red-400' : f.risk.includes('Medium') ? 'text-orange-400' : 'text-teal-400'}`}>
                  Risk: {f.risk}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
