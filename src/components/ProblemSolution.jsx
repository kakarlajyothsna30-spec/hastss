import React from 'react';
import { 
  Zap, 
  ShieldAlert, 
  Clock, 
  Cpu, 
  LayoutDashboard, 
  Settings2, 
  Globe 
} from 'lucide-react';

const ProblemSolution = () => {
  return (
    <section className="py-24 bg-[#020617] border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          
          {/* Left Side: Problem Statement */}
          <div className="flex-1 p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-black border border-rose-500/20 shadow-2xl shadow-rose-900/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldAlert size={120} className="text-rose-500" />
            </div>
            
            <div className="relative z-10">
              <span className="text-rose-400 font-bold text-sm tracking-widest uppercase">The Crisis</span>
              <h2 className="text-4xl font-bold text-white mt-4 mb-8">Problem Statement</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="mt-1"><Zap className="text-rose-500" size={24} /></div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-100">Severe Traffic Congestion</h4>
                    <p className="text-slate-400 text-sm">Inefficient timing results in massive delays, increasing carbon footprints and fuel waste.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1"><ShieldAlert className="text-rose-500" size={24} /></div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-100">Safety Compromised</h4>
                    <p className="text-slate-400 text-sm">Lack of human-aware detection increases accidents at junctions for both vehicles and pedestrians.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1"><Clock className="text-rose-500" size={24} /></div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-100">Emergency Delays</h4>
                    <p className="text-slate-400 text-sm">Vital seconds are lost when emergency vehicles are trapped in static, unresponsive traffic grids.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Proposed System */}
          <div className="flex-1 p-8 lg:p-12 rounded-3xl bg-slate-900/30 border border-emerald-500/20 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 p-8 opacity-10">
              <Cpu size={200} className="text-emerald-500" />
            </div>

            <div className="relative z-10">
              <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase">The Innovation</span>
              <h2 className="text-4xl font-bold text-white mt-4 mb-8">Proposed System Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    icon: <Globe size={20} />, 
                    title: "Simulation-Based", 
                    desc: "A digital twin environment for testing real-world scenarios." 
                  },
                  { 
                    icon: <Settings2 size={20} />, 
                    title: "Virtual Inputs", 
                    desc: "Processing dynamic data points from virtual traffic sensors." 
                  },
                  { 
                    icon: <Cpu size={20} />, 
                    title: "Adaptive Logic", 
                    desc: "AI algorithms that learn and adjust signal timing on the fly." 
                  },
                  { 
                    icon: <LayoutDashboard size={20} />, 
                    title: "Dashboard UI", 
                    desc: "Real-time visualization of junction status and traffic flow." 
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-black/40 border border-slate-800 hover:border-emerald-500/50 transition-colors group">
                    <div className="text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h4 className="text-slate-100 font-bold mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;