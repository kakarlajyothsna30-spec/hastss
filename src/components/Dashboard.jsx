import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Car, 
  Timer, 
  TrafficCone, 
  Siren, 
  Activity, 
  Zap, 
  Power
} from 'lucide-react';

const Dashboard = () => {
  // --- State for Real-time Data ---
  const [vehicleCount, setVehicleCount] = useState({ North: 12, South: 14, East: 8, West: 5 });
  const [avgWaitTime, setAvgWaitTime] = useState(42);
  const [signalState, setSignalState] = useState('Green - North');
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [throughput, setThroughput] = useState(145); // Vehicles per minute
  const [uptime, setUptime] = useState(0);

  // --- Data Simulation Hook ---
  useEffect(() => {
    // 1. Simulate changing vehicle counts every 3 seconds
    const vehicleInterval = setInterval(() => {
      setVehicleCount(prev => ({
        North: Math.max(2, prev.North + (Math.random() > 0.5 ? 2 : -1)),
        South: Math.max(2, prev.South + (Math.random() > 0.4 ? 1 : -2)),
        East: Math.max(1, prev.East + (Math.random() > 0.6 ? 3 : -1)),
        West: Math.max(1, prev.West + (Math.random() > 0.5 ? 1 : -1)),
      }));
    }, 3000);

    // 2. Simulate wait time and throughput fluctuations
    const metricInterval = setInterval(() => {
      setAvgWaitTime(prev => Math.max(15, prev + (Math.random() > 0.5 ? 3 : -2)));
      setThroughput(prev => Math.max(100, prev + (Math.random() > 0.5 ? 10 : -8)));
    }, 5000);

    // 3. Simulate Signal State Rotation
    const signalInterval = setInterval(() => {
      setSignalState(prev => {
        if (prev === 'Green - North') return 'Yellow';
        if (prev === 'Yellow') return 'Red - All Stop';
        if (prev === 'Red - All Stop') return 'Green - East';
        if (prev === 'Green - East') return 'Yellow';
        return 'Green - North';
      });
    }, 10000); // Change signal every 10s

    // 4. Simulate Random Emergency Overrides
    const emergencyInterval = setInterval(() => {
      setEmergencyActive(true);
      setSignalState('EMERGENCY - GREEN - SOUTH');
      setTimeout(() => {
        setEmergencyActive(false);
        setSignalState('Yellow'); // Resume normal cycle
      }, 6000); // Emergency lasts 6 seconds
    }, 45000); // Happens every 45s

    // 5. Uptime Counter
    const uptimeInterval = setInterval(() => setUptime(p => p + 1), 1000);

    // Cleanup functions
    return () => {
      clearInterval(vehicleInterval);
      clearInterval(metricInterval);
      clearInterval(signalInterval);
      clearInterval(emergencyInterval);
      clearInterval(uptimeInterval);
    };
  }, []);

  // Calculate total vehicle count
  const totalVehicles = Object.values(vehicleCount).reduce((a, b) => a + b, 0);

  return (
    <section className="py-24 bg-[#020617] px-6 text-slate-100 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header and System Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-blue-400" size={20} />
              <h2 className="text-3xl font-extrabold tracking-tighter">SmartFlow Live Dashboard</h2>
            </div>
            <p className="text-slate-400">Junction ID: JF-URBAN-42 // Real-time Operational Telemetry</p>
          </div>
          
          <div className="flex items-center gap-6 p-4 bg-black/50 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-mono text-emerald-400 tracking-wider">SYSTEM ONLINE</span>
            </div>
            <div className="text-sm text-slate-500 font-mono">Uptime: {Math.floor(uptime/60)}m {uptime%60}s</div>
          </div>
        </div>

        {/* --- Bento Grid Dashboard --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Vehicle Count */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors relative overflow-hidden">
            <Car className="absolute bottom-[-20px] right-[-20px] text-blue-900 opacity-20" size={120} />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-3 text-blue-400">
                <Car size={20} />
                <h4 className="font-bold text-slate-200">Total Vehicle Count</h4>
              </div>
              <p className="text-5xl font-black tracking-tight text-white transition-all">{totalVehicles}</p>
              <p className="text-xs text-slate-500">Active agents in simulated grid.</p>
            </div>
          </div>

          {/* Card 2: Avg Waiting Time */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors relative overflow-hidden">
            <Timer className="absolute bottom-[-20px] right-[-20px] text-amber-900 opacity-20" size={120} />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-3 text-amber-400">
                <Timer size={20} />
                <h4 className="font-bold text-slate-200">Avg. Junction Delay</h4>
              </div>
              <p className="text-5xl font-black tracking-tight text-white transition-all">{avgWaitTime}s</p>
              <p className="text-xs text-slate-500">Wait time per queue agent.</p>
            </div>
          </div>

          {/* Card 3: Signal Status */}
          <div className="lg:col-span-2 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 flex items-center justify-between gap-6 relative overflow-hidden">
             {/* Signal Status Glow */}
             <div className={`absolute -top-10 -left-10 w-40 h-40 rounded-full blur-[60px] opacity-10 transition-all ${emergencyActive ? 'bg-rose-500' : 'bg-emerald-500'}`} />

             <div className="relative z-10">
               <div className="flex items-center gap-3 text-emerald-400 mb-6">
                 <TrafficCone size={20} />
                 <h4 className="font-bold text-slate-200">Active Phase Status</h4>
               </div>
               <p className={`text-2xl font-black tracking-tight uppercase transition-all duration-500 
                ${emergencyActive ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                 {signalState}
               </p>
               <p className="text-xs text-slate-500 mt-2 font-mono">Current sequence: {signalState.split(' ')[0]}</p>
             </div>

             {/* Emergency Mode Card */}
             <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-500 
              ${emergencyActive ? 'border-rose-500 bg-rose-950 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)]' 
              : 'border-slate-700 bg-black/40 text-slate-500'}`}>
                <Siren size={32} className={`${emergencyActive ? 'animate-bounce' : ''}`} />
                <span className="text-xs font-bold uppercase tracking-widest">
                    {emergencyActive ? 'Emergency Active' : 'Emergency Idle'}
                </span>
             </div>
          </div>

          {/* Card 4: Vehicle Distribution Chart */}
          <div className="lg:col-span-2 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 text-purple-400">
                <BarChart3 size={20} />
                <h4 className="font-bold text-slate-200">Lane Distribution Analysis</h4>
              </div>
              <span className="text-xs font-mono text-slate-600">Vehicles/Lane</span>
            </div>
            
            <div className="flex items-end gap-6 h-32">
              {Object.entries(vehicleCount).map(([lane, count]) => {
                // Determine max count for scale
                const maxCount = Math.max(...Object.values(vehicleCount), 1);
                const barHeight = (count / maxCount) * 100;
                
                return (
                  <div key={lane} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                    <div className="text-xs font-mono text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">{count}</div>
                    <div className="w-full bg-slate-800 rounded-lg overflow-hidden relative" style={{ height: `${barHeight}%` }}>
                       <div className="absolute inset-0 bg-gradient-to-t from-purple-600 to-fuchsia-400 opacity-80 transition-all duration-300 group-hover:scale-105" />
                    </div>
                    <span className="text-sm font-bold text-slate-400 group-hover:text-purple-400">{lane}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 5: System Throughput */}
          <div className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex items-center gap-8 relative overflow-hidden">
            <div className="flex-shrink-0 p-5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-900">
              <Activity size={32} />
            </div>
            <div className="flex-grow">
               <div className="flex items-center gap-3 text-blue-400 mb-2">
                 <h4 className="font-bold text-slate-200">System Throughput</h4>
               </div>
               <p className="text-4xl font-black text-white transition-all">{throughput} v/m</p>
               <p className="text-xs text-slate-500">Average flow rate across all lanes.</p>
            </div>
             {/* Abstract Flow Line */}
             <div className="absolute bottom-[-10px] left-[-10px] w-[120%] h-[2px] bg-gradient-to-r from-blue-600 via-emerald-400 to-blue-600 animate-pulse-fast opacity-20" />
          </div>

        </div>

        {/* Dynamic Update Note */}
        <div className="mt-12 text-center text-sm text-slate-600 italic border-t border-slate-800 pt-6">
          Values are updated dynamically using interval simulation. Emergency overrides are randomized.
        </div>
      </div>
    </section>
  );
};

export default Dashboard;