import React, { useState, useEffect, useRef } from 'react';
import { Siren, User, Timer, RotateCcw, Activity } from 'lucide-react';

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const PHASES = [
  { id: 'NS',  label: 'North ↕ South',  duration: 14 },
  { id: 'Y1',  label: 'Clearing…',       duration: 3  },
  { id: 'EW',  label: 'East ↔ West',    duration: 14 },
  { id: 'Y2',  label: 'Clearing…',       duration: 3  },
];

// Returns signal colour for each arm given the current phase
function armSignal(arm, phase) {
  if (phase === 'NS')  return (arm === 'N' || arm === 'S') ? 'green'  : 'red';
  if (phase === 'Y1')  return (arm === 'N' || arm === 'S') ? 'yellow' : 'red';
  if (phase === 'EW')  return (arm === 'E' || arm === 'W') ? 'green'  : 'red';
  if (phase === 'Y2')  return (arm === 'E' || arm === 'W') ? 'yellow' : 'red';
  return 'red';
}

const SIGNAL_COLORS = {
  red:    { bg: '#ef4444', glow: 'rgba(239,68,68,0.8)'    },
  yellow: { bg: '#f59e0b', glow: 'rgba(245,158,11,0.8)'   },
  green:  { bg: '#10b981', glow: 'rgba(16,185,129,0.8)'   },
  off:    { bg: '#1e293b', glow: 'transparent'              },
};

/* ─────────────────────────────────────────────
   Car definitions — one car per arm direction
───────────────────────────────────────────── */
const CAR_DEFS = [
  // North arm — car enters from top, moves down to centre, stops at stop-line
  { id: 'N1', arm: 'N', color: '#60a5fa', x0: 188, y0: -30, x1: 188, y1: 172, axis: 'y' },
  { id: 'N2', arm: 'N', color: '#818cf8', x0: 200, y0: -70, x1: 200, y1: 172, axis: 'y', delay: 1200 },
  // South arm — car enters from bottom, moves up
  { id: 'S1', arm: 'S', color: '#34d399', x0: 212, y0: 470, x1: 212, y1: 228, axis: 'y' },
  { id: 'S2', arm: 'S', color: '#a78bfa', x0: 200, y0: 510, x1: 200, y1: 228, axis: 'y', delay: 900 },
  // East arm — car enters from right, moves left
  { id: 'E1', arm: 'E', color: '#f472b6', x0: 470, y0: 188, x1: 228, y1: 188, axis: 'x' },
  { id: 'E2', arm: 'E', color: '#fb923c', x0: 510, y0: 200, x1: 228, y1: 200, axis: 'x', delay: 700 },
  // West arm — car enters from left, moves right
  { id: 'W1', arm: 'W', color: '#fbbf24', x0: -30, y0: 212, x1: 172, y1: 212, axis: 'x' },
  { id: 'W2', arm: 'W', color: '#4ade80', x0: -70, y0: 200, x1: 172, y1: 200, axis: 'x', delay: 1500 },
];

/* ─────────────────────────────────────────────
   Single animated car (SVG)
───────────────────────────────────────────── */
function Car({ def, canGo, emergency }) {
  const [pos, setPos] = useState({ x: def.x0, y: def.y0 });
  const [gone, setGone]   = useState(false);
  const [active, setActive] = useState(false);
  const timerRef  = useRef(null);
  const resetRef  = useRef(null);

  const STOP  = { x: def.x1, y: def.y1 };
  const EXIT  = def.axis === 'y'
    ? { x: def.x1, y: def.arm === 'N' ? 470 : -30 }
    : { x: def.arm === 'E' ? -30 : 470, y: def.y1 };

  useEffect(() => {
    const delay = def.delay || 0;
    timerRef.current = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!active) return;
    if (gone) return;

    if (canGo || (emergency && def.arm === 'N')) {
      // Drive through
      setPos(EXIT);
      resetRef.current = setTimeout(() => {
        setPos({ x: def.x0, y: def.y0 });
        setGone(false);
      }, 3500);
    } else {
      // Creep to stop line
      setPos(STOP);
    }
  }, [canGo, emergency, active]);

  useEffect(() => () => clearTimeout(resetRef.current), []);

  // Rotation based on arm
  const rotate = { N: 180, S: 0, E: 270, W: 90 }[def.arm];
  const carW = 18, carH = 26;

  return (
    <g transform={`translate(${pos.x},${pos.y}) rotate(${rotate})`}
       style={{ transition: 'transform 2.5s cubic-bezier(0.4,0,0.2,1)' }}>
      {/* Body */}
      <rect x={-carW/2} y={-carH/2} width={carW} height={carH}
            rx={4} fill={def.color} opacity={active ? 1 : 0} />
      {/* Windshield */}
      <rect x={-carW/2+3} y={-carH/2+4} width={carW-6} height={7}
            rx={2} fill="rgba(0,0,0,0.5)" opacity={active ? 1 : 0} />
      {/* Headlights */}
      <circle cx={-5} cy={-carH/2+2} r={2} fill="#fef08a" opacity={active ? 0.9 : 0} />
      <circle cx={5}  cy={-carH/2+2} r={2} fill="#fef08a" opacity={active ? 0.9 : 0} />
    </g>
  );
}

/* ─────────────────────────────────────────────
   Traffic light head (3-circle pole)
───────────────────────────────────────────── */
function SignalHead({ x, y, sig }) {
  const lights = ['red', 'yellow', 'green'];
  return (
    <g>
      <rect x={x-12} y={y-38} width={24} height={52} rx={5} fill="#0f172a" stroke="#334155" strokeWidth={1} />
      {lights.map((c, i) => {
        const lit = sig === c;
        return (
          <circle key={c}
            cx={x} cy={y - 28 + i * 17} r={7}
            fill={lit ? SIGNAL_COLORS[c].bg : '#1e293b'}
            style={{ filter: lit ? `drop-shadow(0 0 6px ${SIGNAL_COLORS[c].glow})` : 'none',
                     transition: 'fill 0.3s, filter 0.3s' }} />
        );
      })}
    </g>
  );
}

/* ─────────────────────────────────────────────
   Four-way intersection SVG (400×400 canvas)
───────────────────────────────────────────── */
function Intersection({ phase, emergency, pedestrian }) {
  const sigs = {
    N: armSignal('N', phase),
    S: armSignal('S', phase),
    E: armSignal('E', phase),
    W: armSignal('W', phase),
  };
  if (emergency) { sigs.N = sigs.S = sigs.E = sigs.W = 'green'; }

  const C = 200, RW = 60; // centre, road half-width

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width={400} height={400} fill="#020617" />
      <circle cx={C} cy={C} r={180} fill="url(#glow)" />

      {/* ── Roads ── */}
      {/* Vertical road */}
      <rect x={C-RW} y={0} width={RW*2} height={400} fill="#1e293b" />
      {/* Horizontal road */}
      <rect x={0} y={C-RW} width={400} height={RW*2} fill="#1e293b" />

      {/* Road edge lines */}
      <line x1={C-RW} y1={0}   x2={C-RW} y2={C-RW}   stroke="#334155" strokeWidth={1.5} />
      <line x1={C+RW} y1={0}   x2={C+RW} y2={C-RW}   stroke="#334155" strokeWidth={1.5} />
      <line x1={C-RW} y1={C+RW} x2={C-RW} y2={400}   stroke="#334155" strokeWidth={1.5} />
      <line x1={C+RW} y1={C+RW} x2={C+RW} y2={400}   stroke="#334155" strokeWidth={1.5} />
      <line x1={0}   y1={C-RW} x2={C-RW} y2={C-RW}   stroke="#334155" strokeWidth={1.5} />
      <line x1={0}   y1={C+RW} x2={C-RW} y2={C+RW}   stroke="#334155" strokeWidth={1.5} />
      <line x1={C+RW} y1={C-RW} x2={400} y2={C-RW}   stroke="#334155" strokeWidth={1.5} />
      <line x1={C+RW} y1={C+RW} x2={400} y2={C+RW}   stroke="#334155" strokeWidth={1.5} />

      {/* Centre box — intersection */}
      <rect x={C-RW} y={C-RW} width={RW*2} height={RW*2} fill="#263348" />

      {/* Lane dividers — dashed centre */}
      <line x1={C} y1={0}   x2={C} y2={C-RW}   stroke="#475569" strokeWidth={1.5} strokeDasharray="8,6" />
      <line x1={C} y1={C+RW} x2={C} y2={400}   stroke="#475569" strokeWidth={1.5} strokeDasharray="8,6" />
      <line x1={0}   y1={C} x2={C-RW} y2={C}   stroke="#475569" strokeWidth={1.5} strokeDasharray="8,6" />
      <line x1={C+RW} y1={C} x2={400} y2={C}   stroke="#475569" strokeWidth={1.5} strokeDasharray="8,6" />

      {/* Stop lines */}
      {/* North stop-line */}
      <line x1={C-RW} y1={C-RW-2} x2={C+RW} y2={C-RW-2} stroke="#ffffff" strokeWidth={3} />
      {/* South stop-line */}
      <line x1={C-RW} y1={C+RW+2} x2={C+RW} y2={C+RW+2} stroke="#ffffff" strokeWidth={3} />
      {/* West stop-line */}
      <line x1={C-RW-2} y1={C-RW} x2={C-RW-2} y2={C+RW} stroke="#ffffff" strokeWidth={3} />
      {/* East stop-line */}
      <line x1={C+RW+2} y1={C-RW} x2={C+RW+2} y2={C+RW} stroke="#ffffff" strokeWidth={3} />

      {/* Pedestrian crosswalks (zebra) */}
      {pedestrian && ['N','S','E','W'].map(arm => {
        const stripes = 5;
        return Array.from({ length: stripes }).map((_, i) => {
          if (arm === 'N') return <rect key={`pN${i}`} x={C-RW+i*(RW*2/stripes)} y={C-RW-20} width={RW*2/stripes-2} height={16} fill="white" opacity={0.7} rx={1} />;
          if (arm === 'S') return <rect key={`pS${i}`} x={C-RW+i*(RW*2/stripes)} y={C+RW+4}  width={RW*2/stripes-2} height={16} fill="white" opacity={0.7} rx={1} />;
          if (arm === 'W') return <rect key={`pW${i}`} x={C-RW-20} y={C-RW+i*(RW*2/stripes)} width={16} height={RW*2/stripes-2} fill="white" opacity={0.7} rx={1} />;
          if (arm === 'E') return <rect key={`pE${i}`} x={C+RW+4}  y={C-RW+i*(RW*2/stripes)} width={16} height={RW*2/stripes-2} fill="white" opacity={0.7} rx={1} />;
          return null;
        });
      })}

      {/* ── Cars ── */}
      {CAR_DEFS.map(def => (
        <Car key={def.id} def={def}
          canGo={armSignal(def.arm, phase) === 'green'}
          emergency={emergency} />
      ))}

      {/* ── Signal heads ── */}
      {/* North — signal faces south-bound traffic at top of intersection */}
      <SignalHead x={C-RW-18} y={C-RW+18} sig={sigs.N} />
      {/* South — faces north-bound at bottom */}
      <SignalHead x={C+RW+18} y={C+RW-18} sig={sigs.S} />
      {/* West — faces east-bound at left */}
      <SignalHead x={C-RW+18} y={C+RW+18} sig={sigs.W} />
      {/* East — faces west-bound at right */}
      <SignalHead x={C+RW-18} y={C-RW-18} sig={sigs.E} />

      {/* Direction labels */}
      {[['N',C,18],['S',C,390],['W',18,C],['E',388,C]].map(([lbl,lx,ly])=>(
        <text key={lbl} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fill="#64748b" fontSize={11} fontWeight="700" fontFamily="monospace">{lbl}</text>
      ))}

      {/* Emergency flash overlay */}
      {emergency && (
        <rect width={400} height={400} fill="rgba(239,68,68,0.06)"
              style={{ animation: 'pulse 0.5s ease-in-out infinite alternate' }} />
      )}

      {/* Pedestrian walkers */}
      {pedestrian && (
        <>
          <circle cx={C-RW-10} cy={C-RW-10} r={5} fill="#34d399">
            <animate attributeName="cy" values={`${C-RW-10};${C+RW+10};${C-RW-10}`} dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx={C+RW+10} cy={C+RW+10} r={5} fill="#34d399">
            <animate attributeName="cx" values={`${C+RW+10};${C-RW-10};${C+RW+10}`} dur="4s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const TrafficSimulation = () => {
  const [phaseIdx, setPhaseIdx]       = useState(0);
  const [timeLeft, setTimeLeft]       = useState(PHASES[0].duration);
  const [isEmergency, setIsEmergency] = useState(false);
  const [pedestrian, setPedestrian]   = useState(false);
  const [isPaused, setIsPaused]       = useState(false);
  const [cycleCount, setCycleCount]   = useState(0);

  const currentPhase = PHASES[phaseIdx];

  // Phase countdown
  useEffect(() => {
    if (isPaused || isEmergency) return;
    if (timeLeft <= 0) {
      const next = (phaseIdx + 1) % PHASES.length;
      setPhaseIdx(next);
      setTimeLeft(PHASES[next].duration);
      if (next === 0) setCycleCount(c => c + 1);
      return;
    }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phaseIdx, isPaused, isEmergency]);

  const handleEmergency = () => {
    if (isEmergency) return;
    setIsEmergency(true);
    setTimeout(() => {
      setIsEmergency(false);
      setPhaseIdx(0);
      setTimeLeft(PHASES[0].duration);
    }, 6000);
  };

  const handlePedestrian = () => {
    if (pedestrian) return;
    setPedestrian(true);
    // Force yellow then red on active phase
    if (currentPhase.id === 'NS' || currentPhase.id === 'EW') {
      setTimeLeft(2); // rush to yellow
    }
    setTimeout(() => setPedestrian(false), 8000);
  };

  const handleReset = () => {
    setPhaseIdx(0);
    setTimeLeft(PHASES[0].duration);
    setIsEmergency(false);
    setPedestrian(false);
    setIsPaused(false);
    setCycleCount(0);
  };

  const activePhase = isEmergency ? 'EMERGENCY' : currentPhase.id;

  const sigColor = (arm) => {
    if (isEmergency) return 'green';
    return armSignal(arm, currentPhase.id);
  };

  const badgeClass = (arm) => {
    const c = sigColor(arm);
    return c === 'green'  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
         : c === 'yellow' ? 'bg-amber-500/20  text-amber-400  border-amber-500/30'
         :                  'bg-rose-500/20   text-rose-400   border-rose-500/30';
  };

  return (
    <section className="py-24 bg-[#020617] px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30
                           text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            Live Simulation
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Four-Way Intersection
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Adaptive signal phasing across all four arms — N, S, E &amp; W — with real-time emergency
            override and pedestrian-safe corridors.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">

          {/* ── Intersection Canvas ── */}
          <div className="relative bg-slate-950 rounded-[32px] border border-slate-800 overflow-hidden
                          shadow-[0_0_80px_rgba(59,130,246,0.08)] aspect-square max-w-[520px] mx-auto w-full">
            {isEmergency && (
              <div className="absolute inset-0 bg-red-500/5 z-10 pointer-events-none
                              animate-pulse rounded-[32px] ring-2 ring-red-500/40" />
            )}
            <Intersection
              phase={currentPhase.id}
              emergency={isEmergency}
              pedestrian={pedestrian}
            />
          </div>

          {/* ── Control Panel ── */}
          <div className="space-y-5">

            {/* Phase indicator */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm font-semibold uppercase tracking-widest">
                  Active Phase
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border animate-pulse
                  ${isEmergency ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : currentPhase.id.includes('Y') ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                  {isEmergency ? '⚠ EMERGENCY GREEN' : currentPhase.label}
                </span>
              </div>

              {/* Timer bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Timer size={12} className="text-blue-400" /> Next phase
                  </span>
                  <span className="font-mono text-white font-bold">{isEmergency ? '—' : `${timeLeft}s`}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: isEmergency ? '100%' : `${(timeLeft / currentPhase.duration) * 100}%`,
                      background: isEmergency ? '#ef4444'
                        : currentPhase.id.includes('Y') ? '#f59e0b' : '#3b82f6',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Per-arm signal status */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                Signal Status — All Arms
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['N','S','E','W'].map(arm => (
                  <div key={arm}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border ${badgeClass(arm)}`}>
                    <span className="font-bold text-sm">
                      {{ N:'↓ North', S:'↑ South', E:'← East', W:'→ West' }[arm]}
                    </span>
                    <span className="text-xs font-mono font-bold uppercase">{sigColor(arm)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-center">
                <Activity size={16} className="text-blue-400 mx-auto mb-1" />
                <p className="text-2xl font-black text-white">{cycleCount}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Cycles</p>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-center">
                <span className="text-2xl font-black text-white">{phaseIdx + 1}<span className="text-slate-600">/4</span></span>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Phase</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleEmergency} disabled={isEmergency}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl
                           bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed
                           text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-rose-600/20">
                <Siren size={18} /> Emergency
              </button>
              <button onClick={handlePedestrian} disabled={pedestrian}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl
                           bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed
                           text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-600/20">
                <User size={18} /> Pedestrian
              </button>
              <button onClick={() => setIsPaused(p => !p)}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl
                           bg-slate-700 hover:bg-slate-600
                           text-white font-bold text-sm transition-all active:scale-95 col-span-1">
                {isPaused ? '▶ Resume' : '⏸ Pause'}
              </button>
              <button onClick={handleReset}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl
                           bg-slate-700 hover:bg-slate-600
                           text-white font-bold text-sm transition-all active:scale-95">
                <RotateCcw size={16} /> Reset
              </button>
            </div>

            {/* Legend */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 space-y-2">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">How it works</p>
              <ul className="text-slate-400 text-xs space-y-1.5">
                <li>🔵 <strong className="text-slate-300">Phase NS</strong> — North &amp; South get green, E &amp; W wait</li>
                <li>🟡 <strong className="text-slate-300">Yellow</strong> — 3 s clearance before switching arms</li>
                <li>🟢 <strong className="text-slate-300">Phase EW</strong> — East &amp; West get green, N &amp; S wait</li>
                <li>🔴 <strong className="text-slate-300">Emergency</strong> — All arms green for 6 s corridor</li>
                <li>🚶 <strong className="text-slate-300">Pedestrian</strong> — Zebra crossings appear, rush to red</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default TrafficSimulation;