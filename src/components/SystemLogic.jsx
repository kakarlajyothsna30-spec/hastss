import React from 'react';
import { 
  Activity, 
  Binary, 
  BrainCircuit, 
  Timer, 
  Siren,
  ChevronRight 
} from 'lucide-react';

const SystemLogic = () => {
  const logicSteps = [
    {
      title: "Traffic Simulation",
      logic: "Randomized vehicle & pedestrian agent generation using Poisson distribution to mimic real-world arrival patterns.",
      icon: <Activity className="text-blue-400" />,
      tag: "INPUT"
    },
    {
      title: "Density Calculation",
      logic: "Virtual lane sensors count active agents. Density (D) is calculated as Vehicles / Lane Length.",
      icon: <Binary className="text-purple-400" />,
      tag: "COMPUTE"
    },
    {
      title: "Decision Logic",
      logic: "Comparison of density ratios across all lanes to determine which junction leg requires the highest priority.",
      icon: <BrainCircuit className="text-emerald-400" />,
      tag: "AI_CORE"
    },
    {
      title: "Signal Control",
      logic: "Dynamic calculation of Green Light Duration (T) proportional to the detected lane density.",
      icon: <Timer className="text-amber-400" />,
      tag: "EXECUTE"
    },
    {
      title: "Emergency Handling",
      logic: "Interrupt-driven logic that overrides the main loop when an emergency agent is detected within range.",
      icon: <Siren className="text-rose-400" />,
      tag: "OVERRIDE"
    }
  ];

  return (
    <section className="py-24 bg-[#020617] px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
            The Algorithmic <span className="text-blue-500">Brain</span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg">
            A step-by-step breakdown of how our AI processes raw simulation data into intelligent traffic decisions.
          </p>
        </div>

        {/* Steps Container */}
        <div className="space-y-4">
          {logicSteps.map((step, index) => (
            <div 
              key={index} 
              className="group flex flex-col md:flex-row items-center gap-6 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-slate-600 transition-all duration-300"
            >
              {/* Icon & Number */}
              <div className="flex-shrink-0 flex items-center gap-4">
                <span className="text-4xl font-black text-slate-800 group-hover:text-blue-900 transition-colors">
                  0{index + 1}
                </span>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
              </div>

              {/* Connector (Desktop Only) */}
              <div className="hidden md:block">
                <ChevronRight className="text-slate-700" size={20} />
              </div>

              {/* Logic Description */}
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-xl font-bold text-slate-100">{step.title}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                    {step.tag}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                  {step.logic}
                </p>
              </div>

              {/* Status Indicator */}
              <div className="hidden lg:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-500/70 tracking-widest uppercase">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemLogic;