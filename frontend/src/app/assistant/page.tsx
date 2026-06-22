'use client';
import { useState } from 'react';

export default function AssistantPage() {
  const [messages, setMessages] = useState<{role: 'user'|'assistant', text: string}[]>([
    { role: 'assistant', text: 'I am your daily life & emergency assistant. Ask me anything! Try disaster queries (e.g., flood, earthquake) or daily knowledge topics (e.g., first aid kit, heatwave, hydration).' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    try {
      const res = await fetch('http://localhost:8000/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error connecting to offline AI service. Please ensure the Python backend is running.' }]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h2 className="text-3xl font-bold text-white mb-2">AI & Wikipedia Daily Life Assistant</h2>
      <p className="text-slate-400 mb-4">Intelligent safety & general knowledge assistant connected to Wikipedia API for real-time daily utility.</p>
      
      <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex flex-col mb-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-2xl max-w-lg whitespace-pre-wrap ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask anything (e.g. first aid, yoga, flood, thunderstorm)..." 
          className="flex-1 bg-slate-800 border border-slate-700 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={sendMessage} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl font-medium transition-colors">Send</button>
      </div>
    </div>
  );
}
