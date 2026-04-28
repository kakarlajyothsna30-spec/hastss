import React from 'react';
import { 
  Car, 
  Users, 
  Siren, 
  Timer, 
  Cpu, 
  LayoutDashboard,
  DollarSign,
  Maximize,
  Zap,
  Feather,
  Smile
} from 'lucide-react';

const RequirementsGrid = () => {
  const functional = [
    { title: "Vehicle Density Simulation", icon: <Car />, desc: "High-fidelity virtual traffic environment with variable lane density." },
    { title: "Pedestrian Simulation", icon: <Users />, desc: "Integrated human agents to test crosswalk priority logic." },
    { title: "Emergency Handling", icon: <Siren />, desc: "Automated 'Green Corridor' generation for priority vehicles." },
    { title: "Waiting Time Calculation", icon: <Timer />, desc: "Real-time tracking of average wait time per junction." },
    { title: "Adaptive Signals", icon: <Cpu />, desc: "Logic that adjusts phase timing based on real-world inputs." },
    { title: "Dashboard", icon: <LayoutDashboard />, desc: "Interactive visualization of all system metrics and status." },
  ];

  const nonFunctional = [
    { title: "Cost-effective", icon: <DollarSign />, color: "text-emerald-400" },
    { title: "Scalable", icon: <Maximize />, color: "text-blue-400" },
    { title: "Real-time", icon: <Zap />, color: "text-amber-400" },
    { title: "Lightweight", icon: <Feather />, color: "text-purple-400" },
    { title: "User-friendly", icon: <Smile />, color: "text-pink-400" },
  ];

  return (
    <section className="py-24 bg-[#020617] px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Functional Requirements --- */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-blue-500 font-bold tracking-tighter text-sm uppercase mb-2">Capabilities</h2>
              <h3 className="text-4xl font-bold text-white">Functional Requirements</h3>
            </div>
            <p className="text-slate-400 max-w-md text-sm italic border-l border-slate-700 pl-4">
              Defining the core operations and behaviors of the Smart Traffic ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {functional.map((req, idx) => (
              <div key={idx} className="group p-6 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-blue-500/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {req.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-100 mb-2">{req.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{req.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- Non-Functional Requirements --- */}
        <div>
          <div className="mb-10">
            <h2 className="text-emerald-500 font-bold tracking-tighter text-sm uppercase mb-2">Quality Standards</h2>
            <h3 className="text-4xl font-bold text-white">Non-Functional Requirements</h3>
          </div>

          <div className="flex flex-wrap gap-4">
            {nonFunctional.map((req, idx) => (
              <div key={idx} className="flex-1 min-w-[200px] flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-black border border-slate-800 hover:border-slate-600 transition-colors">
                <div className={`${req.color} opacity-80`}>
                  {React.cloneElement(req.icon, { size: 24 })}
                </div>
                <span className="text-slate-200 font-medium">{req.title}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default RequirementsGrid;