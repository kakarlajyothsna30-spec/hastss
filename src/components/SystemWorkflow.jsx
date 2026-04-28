import React from 'react';
import { 
  PlayCircle, 
  BarChart3, 
  UserRoundCheck, 
  Zap, 
  MonitorDot, 
  ChevronRight 
} from 'lucide-react';

const SystemWorkflow = () => {
  const steps = [
    {
      title: "Traffic Simulation",
      desc: "Initializing virtual traffic environments with varied flow parameters.",
      icon: <PlayCircle size={24} />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Density Analysis",
      desc: "Real-time calculation of vehicle counts across all lanes.",
      icon: <BarChart3 size={24} />,
      color: "from-cyan-500 to-teal-500"
    },
    {
      title: "Priority Detection",
      desc: "Identifying emergency vehicles and pedestrian crossing requests.",
      icon: <UserRoundCheck size={24} />,
      color: "from-teal-500 to-emerald-500"
    },
    {
      title: "Adaptive Timing",
      desc: "Algorithmic adjustments to signal cycles based on live data.",
      icon: <Zap size={24} />,
      color: "from-emerald-500 to-lime-500"
    },
    {
      title: "Visualization",
      desc: "Pushing analytics to the live monitoring dashboard.",
      icon: <MonitorDot size={24} />,
      color: "from-lime-500 to-green-500"
    }
  ];

  return (
    <section className="py-24 bg-[#020617] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold tracking-[0.2em] text-blue-500 uppercase mb-4">
            Operational Logic
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white">
            System Workflow
          </h3>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            A seamless pipeline from raw data simulation to intelligent execution.
          </p>
        </div>

        {/* Horizontal Timeline Container */}
        <div className="relative flex flex-col md:flex-row justify-between items-start gap-8 md:gap-4">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-[2.75rem] left-0 w-full h-[2px] bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-green-500/20 -z-0" />

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex-1 group w-full">
              {/* Step Icon Node */}
              <div className="flex md:flex-col items-center gap-6 md:gap-0">
                <div className={`
                  flex-shrink-0 w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 
                  flex items-center justify-center mb-6 transition-all duration-500
                  group-hover:border-white/20 group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]
                  relative overflow-hidden
                `}>
                  {/* Internal Glow */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${step.color} transition-opacity`} />
                  
                  <div className="text-slate-400 group-hover:text-white transition-colors duration-300">
                    {step.icon}
                  </div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute top-2 right-2 text-[10px] font-bold text-slate-600 group-hover:text-blue-400">
                    0{index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="md:text-center">
                  <h4 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-[200px] md:mx-auto">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Mobile Arrow */}
              {index !== steps.length - 1 && (
                <div className="md:hidden flex justify-center py-4">
                  <ChevronRight className="rotate-90 text-slate-700" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemWorkflow;