import React, { useState, useEffect } from 'react';
import { Car, User, Siren, Timer, TrafficCone } from 'lucide-react';

const TrafficSimulation = () => {
  const [signal, setSignal] = useState('red'); // red, yellow, green
  const [timeLeft, setTimeLeft] = useState(10);
  const [isEmergency, setIsEmergency] = useState(false);
  const [pedestrianRequest, setPedestrianRequest] = useState(false);

  // Core Traffic Logic
  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !isEmergency) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !isEmergency) {
      // Auto-switch logic
      if (signal === 'red') {
        setSignal('green');
        setTimeLeft(15);
      } else if (signal === 'green') {
        setSignal('yellow');
        setTimeLeft(3);
      } else if (signal === 'yellow') {
        setSignal('red');
        setTimeLeft(10);
      }
    }
    return () => clearTimeout(timer);
  }, [timeLeft, signal, isEmergency]);

  // Handle Emergency Mode
  const handleEmergency = () => {
    setIsEmergency(true);
    setSignal('green');
    setTimeout(() => {
      setIsEmergency(false);
      setTimeLeft(5);
    }, 5000); // 5 seconds of emergency green
  };

  // Handle Pedestrian Request
  const handlePedestrian = () => {
    setPedestrianRequest(true);
    // Force transition to red soon
    if (signal === 'green') {
      setSignal('yellow');
      setTimeLeft(2);
    }
    setTimeout(() => setPedestrianRequest(false), 8000);
  };

  return (
    <section className="py-24 bg-[#020617] flex flex-col items-center px-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left: Control Panel */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Simulation Demo</h2>
            <p className="text-slate-400">Interactive testing of the human-aware adaptive logic.</p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-medium">Signal State</span>
              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse
                ${signal === 'green' ? 'bg-emerald-500/20 text-emerald-400' : 
                  signal === 'yellow' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {isEmergency ? '⚠️ Emergency Green' : `${signal} Light`}
              </span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-slate-800">
              <Timer className="text-blue-400" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Next Switch In</p>
                <p className="text-2xl font-mono font-bold text-white">{timeLeft}s</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleEmergency}
                disabled={isEmergency}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold transition-all active:scale-95"
              >
                <Siren size={20} /> Emergency
              </button>
              <button 
                onClick={handlePedestrian}
                disabled={pedestrianRequest}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold transition-all active:scale-95"
              >
                <User size={20} /> Pedestrian
              </button>
            </div>
          </div>
        </div>

        {/* Right: Visual Simulation Road */}
        <div className="relative h-[400px] w-full bg-slate-900 rounded-[40px] border-4 border-slate-800 overflow-hidden shadow-2xl">
          {/* Road Markings */}
          <div className="absolute inset-x-0 top-1/2 h-24 -translate-y-1/2 bg-slate-800 flex items-center px-4">
             <div className="w-full border-t-2 border-dashed border-slate-600"></div>
          </div>

          {/* Traffic Signal Physical Pole */}
          <div className="absolute top-10 right-10 flex flex-col gap-2 p-3 bg-black rounded-2xl border border-slate-700 shadow-xl z-20">
            <div className={`w-6 h-6 rounded-full transition-all duration-300 ${signal === 'red' ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]' : 'bg-slate-800'}`} />
            <div className={`w-6 h-6 rounded-full transition-all duration-300 ${signal === 'yellow' ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]' : 'bg-slate-800'}`} />
            <div className={`w-6 h-6 rounded-full transition-all duration-300 ${signal === 'green' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'bg-slate-800'}`} />
          </div>

          {/* Cars Animation */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Lane 1 Car */}
            <div className={`absolute top-[42%] transition-all duration-[3000ms] ease-linear
              ${signal === 'green' ? 'translate-x-[600px] opacity-0' : 'translate-x-12 opacity-100'}`}>
              <Car size={40} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
            </div>

            {/* Lane 2 Car (Delayed) */}
            <div className={`absolute top-[52%] transition-all duration-[4000ms] ease-linear
              ${signal === 'green' ? 'translate-x-[600px] opacity-0' : 'translate-x-24 opacity-100'}`}>
              <Car size={40} className="text-slate-400 rotate-180" />
            </div>

            {/* Emergency Car */}
            {isEmergency && (
              <div className="absolute top-[47%] -left-20 animate-[move_2s_linear_infinite]">
                <Siren size={30} className="text-rose-500 animate-bounce" />
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes move {
                    from { transform: translateX(0); }
                    to { transform: translateX(600px); }
                  }
                `}} />
              </div>
            )}
          </div>

          {/* Pedestrian Crossing Indicator */}
          {pedestrianRequest && (
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
               <User className="text-emerald-400 animate-bounce" />
               <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Crossing...</span>
             </div>
          )}

          {/* Infrastructure Overlay */}
          <div className="absolute bottom-4 left-4">
            <TrafficCone size={20} className="text-amber-500 opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrafficSimulation;