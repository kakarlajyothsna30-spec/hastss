import React from 'react';
import { 
  Network, 
  RotateCcw, 
  UserMinus, 
  Flame, 
  Maximize,
  AlertCircle
} from 'lucide-react';

const Challenges = () => {
  const challengeData = [
    {
      title: "High Infrastructure Dependency",
      desc: "Heavily relies on expensive physical sensors and inductive loops that are costly to maintain and repair.",
      icon: <Network className="text-amber-500" size={28} />,
      color: "hover:shadow-amber-500/10"
    },
    {
      title: "Limited Adaptability",
      desc: "Fixed-time cycles fail to respond to sudden traffic surges, causing 'ghost congestion' at empty intersections.",
      icon: <RotateCcw className="text-orange-500" size={28} />,
      color: "hover:shadow-orange-500/10"
    },
    {
      title: "Lack of Pedestrian Focus",
      desc: "Crosswalk timings are often secondary, leading to safety risks and long wait times for non-motorists.",
      icon: <UserMinus className="text-rose-500" size={28} />,
      color: "hover:shadow-rose-500/10"
    },
    {
      title: "Inefficient Emergency Handling",
      desc: "No automated 'Green Corridors', forcing ambulances to navigate through heavy gridlock manually.",
      icon: <Flame className="text-red-500" size={28} />,
      color: "hover:shadow-red-500/10"
    },
    {
      title: "Scalability Issues",
      desc: "Integrating new intersections into the legacy grid requires massive manual reconfiguration and downtime.",
      icon: <Maximize className="text-purple-500" size={28} />,
      color: "hover:shadow-purple-500/10"
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#020617] relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-indigo-400 font-semibold tracking-widest uppercase text-sm mb-3 flex items-center gap-2">
            <AlertCircle size={16} /> Current Limitations
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-100">
            Why the existing grid is <br />
            <span className="text-slate-500 italic">failing modern cities.</span>
          </h3>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challengeData.map((item, index) => (
            <div 
              key={index} 
              className={`group relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800 transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800/80 shadow-xl ${item.color} ${index === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="mb-6 inline-flex p-4 rounded-2xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-white">
                {item.title}
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300">
                {item.desc}
              </p>
              
              {/* Decorative Corner Glow */}
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1 h-1 rounded-full bg-white animate-ping" />
              </div>
            </div>
          ))}

          {/* Abstract Placeholder Card to balance the grid if needed */}
          <div className="hidden lg:flex p-8 rounded-3xl border border-dashed border-slate-800 items-center justify-center opacity-40">
            <p className="text-slate-500 text-sm italic">Analysis based on urban data 2026</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Challenges;