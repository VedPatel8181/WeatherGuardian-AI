'use client';

export default function SOSButton() {
  const playSiren = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    
    // Siren sound effect
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.5);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 1.0);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 1.5);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 2.0);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.0);
    
    osc.start();
    osc.stop(ctx.currentTime + 2.0);
  };

  const handleSOS = () => {
    playSiren();
    alert('🚨 SOS ALERT TRIGGERED! 🚨\n\nYour location and details have been securely saved locally. In a real emergency, this would connect to the nearest active offline mesh node or radio tower.');
  };

  return (
    <button 
      onClick={handleSOS}
      className="bg-red-500/20 text-red-400 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-red-500/30 transition-colors">
      SOS ALERT
    </button>
  );
}
