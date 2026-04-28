import React, { useState, useEffect } from 'react';
import { Menu, X, Cpu } from 'lucide-react';

// Import your components here
import Hero from './components/Hero';
import Challenges from './components/Challenges';
import ProblemSolution from './components/ProblemSolution';
import SystemWorkflow from './components/SystemWorkflow';
import RequirementsGrid from './components/RequirementsGrid';
import SystemArchitecture from './components/SystemArchitecture';
import SystemLogic from './components/SystemLogic';
import TrafficSimulation from './components/TrafficSimulation';
import Dashboard from './components/Dashboard';
import TrafficTester from './components/TrafficTester';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for Navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', href: '#overview' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Logic', href: '#logic' },
    { name: 'Simulation', href: '#simulation' },
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Tester', href: '#tester' },
  ];

  return (
    <div className="bg-[#020617] min-h-screen font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* --- Navigation Bar --- */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        scrolled ? 'bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800 py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="p-2 bg-blue-600 rounded-lg group-hover:rotate-12 transition-transform">
              <Cpu className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase">
              Smart<span className="text-blue-500">Flow</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-blue-500 hover:text-white transition-all">
              Launch App
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#020617] border-b border-slate-800 p-6 flex flex-col gap-4 md:hidden">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-semibold text-slate-300"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* --- Page Content --- */}
      <main>
        <section id="hero">
          <Hero />
        </section>

        <section id="overview" className="scroll-mt-20">
          <Challenges />
          <ProblemSolution />
        </section>

        <section id="workflow" className="scroll-mt-20">
          <SystemWorkflow />
        </section>

        <section id="architecture" className="scroll-mt-20">
          <SystemArchitecture />
          <RequirementsGrid />
        </section>

        <section id="logic" className="scroll-mt-20">
          <SystemLogic />
        </section>

        <section id="simulation" className="scroll-mt-20 bg-slate-900/20">
          <TrafficSimulation />
        </section>

        <section id="dashboard" className="scroll-mt-20">
          <Dashboard />
        </section>

        <section id="tester" className="scroll-mt-20">
          <TrafficTester />
        </section>

        {/* Conclusion Section */}
        <section className="py-32 px-6 text-center bg-gradient-to-b from-transparent to-blue-900/10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight italic">
              The Future is Adaptive.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-12">
              By moving away from static timers and embracing real-time, human-aware simulation 
              logic, we can reduce urban congestion by up to 40% and save countless lives through 
              automated emergency prioritization.
            </p>
            <div className="inline-flex items-center gap-4 p-1 rounded-full bg-slate-900 border border-slate-800">
               <span className="px-6 py-2 text-sm font-bold text-slate-300 uppercase tracking-widest">
                 Project End
               </span>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="py-12 border-t border-slate-900 text-center">
        <p className="text-slate-600 text-sm">
          &copy; 2026 SmartFlow AI Research Project. Built with React &amp; Tailwind CSS.
        </p>
      </footer>
    </div>
  );
};

export default App;
