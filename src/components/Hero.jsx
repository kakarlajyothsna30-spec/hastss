import React from 'react';
import { Activity, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';

const Hero = () => {
  const features = [
    {
      title: "Dynamic Signal Control",
      desc: "Real-time density analysis to optimize green light duration.",
      icon: <Activity className="text-blue-400" size={24} />,
    },
    {
      title: "Pedestrian Prioritization",
      desc: "Human-aware detection ensuring safe crossings for all.",
      icon: <UserCheck className="text-emerald-400" size={24} />,
    },
    {
      title: "Emergency Vehicle Passage",
      desc: "Instant green corridors for ambulances and fire trucks.",
      icon: <ShieldAlert className="text-red-400" size={24} />,
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020617] text-slate-50 px-6 py-20">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-900/50 backdrop-blur-md text-sm font-medium animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Powered by Computer Vision
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight">
          Revolutionizing <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
            Urban Mobility
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
          A Simulation-Based Human-Aware Smart Traffic Signal System designed to 
          reduce congestion and prioritize life-saving transport.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <button className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 group">
            Launch Simulation
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold transition-all">
            Documentation
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="group p-8 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm hover:border-slate-600 transition-all hover:-translate-y-1"
          >
            <div className="mb-4 p-3 w-fit rounded-lg bg-slate-800/80 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
              {feature.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;