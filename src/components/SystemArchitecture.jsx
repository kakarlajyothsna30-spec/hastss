import React from 'react';
import { 
  DatabaseZap, 
  BrainCircuit, 
  Rss, 
  TrafficCone, 
  Tv, 
  ArrowRight,
  ArrowDown
} from 'lucide-react';

const SystemArchitecture = () => {
  const modules = [
    {
      title: "Traffic Input",
      subtitle: "(Virtual Simulators)",
      desc: "Simulates vehicle streams, pedestrian presence, and priority vehicle requests.",
      icon: <TrafficCone size={32} />,
      color: "border-sky-500 text-sky-400 bg-sky-950",
      type: "source"
    },
    {
      title: "Processing Module",
      subtitle: "(Decision Logic)",
      desc: "Applies adaptive algorithms to calculate dynamic phase timings based on current density.",
      icon: <BrainCircuit size={32} />,
      color: "border-fuchsia-500 text-fuchsia-400 bg-fuchsia-950",
      type: "processor"
    },
    {
      title: "Control Module",
      subtitle: "(Signal Logic)",
      desc: "Translates AI decisions into actionable green/yellow/red light sequences.",
      icon: <Rss size={32} />,
      color: "border-emerald-500 text-emerald-400 bg-emerald-950",
      type: "controller"
    },
    {
      title: "Visualization",
      subtitle: "(Live Dashboard)",
      desc: "Displays real-time throughput, wait times, and system status to operators.",
      icon: <Tv size={32} />,
      color: "border-amber-500 text-amber-400 bg-amber-950",
      type: "output"
    }
  ];

  return (
    <section className="py-24 bg-[#020617] px-6 relative overflow-hidden">
      
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.015] [mask-image:radial-gradient(#fff,transparent_70%)]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-400 mb-4">
            <DatabaseZap size={14} className="text-blue-400" />
            SYSTEM_BLUEPRINT_V1.0
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
            Operational Architecture
          </h2>
          <p className="text-slate-400 mt-5 max-w-xl mx-auto text-lg leading-relaxed">
            The core technology stack and logic modules powering the SmartFlow ecosystem.
          </p>
        </div>

        {/* Diagram Flow (Desktop Row / Mobile Column) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4 relative">
          
          {/* Animated Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[5%] w-[90%] h-[2px] -z-0">
            <div className="absolute inset-0 bg-slate-800" />
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-fuchsia-500 via-emerald-500 to-amber-500 animate-pulse-fast opacity-30" />
          </div>

          {modules.map((module, index) => (
            <div key={index} className="relative z-10 flex-1 w-full max-w-[320px] group">
              
              {/* The Module Node */}
              <div className={`p-8 rounded-3xl border ${module.color} shadow-lg shadow-black/20 group-hover:scale-[1.03] transition-transform duration-300 relative`}>
                
                {/* Visual Connector Pulse (Internal) */}
                <div className="absolute inset-x-0 -bottom-[2px] flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className={`w-1/3 h-[2px] ${module.color} group-hover:animate-pulse`} />
                </div>

                {/* Content */}
                <div className={`mb-6 p-4 rounded-xl inline-block ${module.color} border-0 shadow-inner group-hover:scale-110 transition-transform`}>
                  {module.icon}
                </div>
                
                <div className="space-y-1 mb-4">
                  <h4 className="text-2xl font-bold tracking-tight text-white group-hover:text-white/90">
                    {module.title}
                  </h4>
                  <p className={`text-xs font-mono uppercase tracking-widest ${module.color} border-0`}>
                    {module.subtitle}
                  </p>
                </div>
                
                <p className="text-slate-400 text-sm leading-relaxed min-h-[80px]">
                  {module.desc}
                </p>
              </div>

              {/* Mobile Arrow Connector */}
              {index !== modules.length - 1 && (
                <div className="md:hidden flex justify-center items-center py-6 text-slate-700 animate-pulse">
                  <ArrowDown size={32} />
                </div>
              )}
            </div>
          ))}

          {/* Visualization Special Connectors */}
          <div className="hidden md:block absolute top-[60px] right-[10%] group">
             <ArrowRight className="text-amber-500 animate-ping opacity-30" />
          </div>

        </div>

        {/* Bottom Abstract Flow Indicator (Tablet/Mobile Only) */}
        <div className="mt-20 md:hidden p-6 bg-slate-900/50 rounded-2xl border border-slate-800 text-center">
            <p className="text-sm font-mono text-slate-600 tracking-wider">INPUT &rarr; PROCESS &rarr; CONTROL &rarr; OUTPUT</p>
        </div>

      </div>
    </section>
  );
};

export default SystemArchitecture;