import React, { useState } from 'react';
import {
  Car,
  Users,
  Siren,
  Play,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
} from 'lucide-react';

const DIRECTIONS = ['North', 'South', 'East', 'West'];

const DIR_COLORS = {
  North: { accent: 'blue',   border: 'border-blue-500/40',   bg: 'bg-blue-900/20',   text: 'text-blue-400',   badge: 'bg-blue-500/20 text-blue-300',   glow: 'shadow-blue-500/20' },
  South: { accent: 'emerald',border: 'border-emerald-500/40',bg: 'bg-emerald-900/20',text: 'text-emerald-400',badge: 'bg-emerald-500/20 text-emerald-300',glow: 'shadow-emerald-500/20' },
  East:  { accent: 'violet', border: 'border-violet-500/40', bg: 'bg-violet-900/20', text: 'text-violet-400', badge: 'bg-violet-500/20 text-violet-300', glow: 'shadow-violet-500/20' },
  West:  { accent: 'amber',  border: 'border-amber-500/40',  bg: 'bg-amber-900/20',  text: 'text-amber-400',  badge: 'bg-amber-500/20 text-amber-300',  glow: 'shadow-amber-500/20' },
};

const DIR_ICONS = {
  North: <ArrowUp size={16} />,
  South: <ArrowDown size={16} />,
  East:  <ArrowRight size={16} />,
  West:  <ArrowLeft size={16} />,
};

const EMPTY_ROW = { vehicles: '', pedestrians: '', emergency: '' };

const DEFAULT_INPUTS = {
  North: { ...EMPTY_ROW },
  South: { ...EMPTY_ROW },
  East:  { ...EMPTY_ROW },
  West:  { ...EMPTY_ROW },
};

// ─── Core adaptive signal algorithm ──────────────────────────────────────────
function runAlgorithm(inputs) {
  const MIN_GREEN = 10;
  const MAX_GREEN = 60;
  const BASE_CYCLE = 120; // total seconds shared across directions

  // Check for any emergency vehicle
  const emergencyDirs = DIRECTIONS.filter(d => Number(inputs[d].emergency) > 0);
  const hasEmergency = emergencyDirs.length > 0;

  // Compute density scores
  const scores = {};
  DIRECTIONS.forEach(d => {
    const v = Number(inputs[d].vehicles) || 0;
    const p = Number(inputs[d].pedestrians) || 0;
    const e = Number(inputs[d].emergency) || 0;
    // Emergency vehicles count triple, pedestrians count 0.6
    scores[d] = v + p * 0.6 + e * 3;
  });

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  // Compute green durations proportionally
  const greenTimes = {};
  DIRECTIONS.forEach(d => {
    if (totalScore === 0) {
      greenTimes[d] = Math.round(BASE_CYCLE / 4);
    } else {
      const raw = (scores[d] / totalScore) * BASE_CYCLE;
      greenTimes[d] = Math.max(MIN_GREEN, Math.min(MAX_GREEN, Math.round(raw)));
    }
  });

  // Determine phase order: highest score first
  const phaseOrder = [...DIRECTIONS].sort((a, b) => scores[b] - scores[a]);

  // Determine active green (top priority)
  const activeGreen = hasEmergency ? emergencyDirs[0] : phaseOrder[0];

  // Build per-direction result signals
  const signals = {};
  DIRECTIONS.forEach((d, i) => {
    const rank = phaseOrder.indexOf(d);
    let signal;
    if (d === activeGreen) signal = 'green';
    else if (rank === 1) signal = 'yellow'; // next-up
    else signal = 'red';
    signals[d] = signal;
  });

  // Efficiency estimate
  const maxPossible = DIRECTIONS.length * MAX_GREEN;
  const efficiency = totalScore === 0 ? 100 : Math.min(100, Math.round((totalScore / maxPossible) * 100 + 30));

  return { scores, greenTimes, phaseOrder, activeGreen, signals, hasEmergency, emergencyDirs, totalScore, efficiency };
}
// ─────────────────────────────────────────────────────────────────────────────

function SignalLight({ state }) {
  return (
    <div className="flex flex-col gap-1.5 p-2 bg-black rounded-xl border border-slate-800 shadow-inner">
      {['red','yellow','green'].map(color => {
        const active = state === color;
        const colorMap = {
          red:    active ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)]' : 'bg-slate-800',
          yellow: active ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]' : 'bg-slate-800',
          green:  active ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)]' : 'bg-slate-800',
        };
        return (
          <div key={color} className={`w-5 h-5 rounded-full transition-all duration-500 ${colorMap[color]}`} />
        );
      })}
    </div>
  );
}

function InputRow({ label, icon, value, onChange, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex-shrink-0 flex items-center gap-1.5 w-36 text-xs font-semibold ${color}`}>
        {icon}
        <span>{label}</span>
      </div>
      <input
        type="number"
        min="0"
        max="999"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="0"
        className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-lg px-3 py-2 text-white text-sm font-mono placeholder:text-slate-600 outline-none transition-colors"
      />
    </div>
  );
}

function DirectionCard({ dir, inputs, onChange }) {
  const c = DIR_COLORS[dir];
  const handleChange = (field) => (val) => onChange(dir, field, val);

  return (
    <div className={`p-5 rounded-2xl border ${c.border} ${c.bg} backdrop-blur-sm space-y-3`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${c.text}`}>
          {DIR_ICONS[dir]}
        </div>
        <h4 className={`font-black text-lg tracking-tight ${c.text}`}>{dir}</h4>
        <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.badge}`}>
          Direction
        </span>
      </div>

      <InputRow
        label="Vehicles"
        icon={<Car size={13} />}
        value={inputs.vehicles}
        onChange={handleChange('vehicles')}
        color="text-slate-300"
      />
      <InputRow
        label="Pedestrians"
        icon={<Users size={13} />}
        value={inputs.pedestrians}
        onChange={handleChange('pedestrians')}
        color="text-slate-300"
      />
      <InputRow
        label="Emergency"
        icon={<Siren size={13} />}
        value={inputs.emergency}
        onChange={handleChange('emergency')}
        color="text-rose-400"
      />
    </div>
  );
}

function ResultCard({ dir, result }) {
  const c = DIR_COLORS[dir];
  const { signals, greenTimes, scores, activeGreen, hasEmergency, emergencyDirs } = result;
  const signal = signals[dir];
  const isEmergency = emergencyDirs.includes(dir);
  const isActive = dir === activeGreen;

  const signalLabel = {
    green:  'GREEN — GO',
    yellow: 'YELLOW — STANDBY',
    red:    'RED — HOLD',
  };
  const signalColor = {
    green:  'text-emerald-400',
    yellow: 'text-amber-400',
    red:    'text-rose-400',
  };

  return (
    <div className={`relative p-5 rounded-2xl border ${c.border} ${isActive ? `shadow-xl ${c.glow}` : ''} bg-slate-900/60 backdrop-blur-sm transition-all duration-500`}>
      {isActive && (
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 uppercase tracking-widest">
            Active
          </span>
        </div>
      )}
      {isEmergency && hasEmergency && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40">
          <AlertTriangle size={10} className="text-rose-400" />
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Emergency</span>
        </div>
      )}

      {/* Direction + Signal Light */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-slate-950 ${c.text}`}>{DIR_ICONS[dir]}</div>
        <span className={`font-black text-lg ${c.text}`}>{dir}</span>
        <div className="ml-auto"><SignalLight state={signal} /></div>
      </div>

      {/* Signal status */}
      <p className={`text-sm font-black tracking-widest uppercase mb-4 ${signalColor[signal]}`}>
        {signalLabel[signal]}
      </p>

      {/* Metrics */}
      <div className="space-y-2 text-xs font-mono">
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Priority Score</span>
          <span className={`font-bold ${c.text}`}>{scores[dir].toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Green Duration</span>
          <span className="text-white font-bold flex items-center gap-1">
            <Clock size={10} /> {greenTimes[dir]}s
          </span>
        </div>

        {/* Green bar */}
        <div className="mt-3 h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              signal === 'green' ? 'bg-emerald-500' : signal === 'yellow' ? 'bg-amber-400' : 'bg-rose-500/50'
            }`}
            style={{ width: `${Math.min(100, (greenTimes[dir] / 60) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function TrafficTester() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [result, setResult] = useState(null);
  const [ran, setRan] = useState(false);

  const handleChange = (dir, field, val) => {
    setInputs(prev => ({
      ...prev,
      [dir]: { ...prev[dir], [field]: val },
    }));
    setRan(false);
  };

  const handleRun = () => {
    const res = runAlgorithm(inputs);
    setResult(res);
    setRan(true);
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setResult(null);
    setRan(false);
  };

  const totalVehicles = DIRECTIONS.reduce((s, d) => s + (Number(inputs[d].vehicles) || 0), 0);
  const totalPed      = DIRECTIONS.reduce((s, d) => s + (Number(inputs[d].pedestrians) || 0), 0);
  const totalEmergency = DIRECTIONS.reduce((s, d) => s + (Number(inputs[d].emergency) || 0), 0);
  const hasAnyInput = totalVehicles + totalPed + totalEmergency > 0;

  return (
    <section id="tester" className="py-24 bg-[#020617] px-6 relative overflow-hidden scroll-mt-20">

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ── */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30">
                <FlaskConical size={18} className="text-blue-400" />
              </div>
              <span className="text-blue-500 font-bold text-xs tracking-[0.2em] uppercase">Interactive Lab</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Traffic Signal <span className="text-blue-400">Tester</span>
            </h2>
            <p className="text-slate-400 mt-3 max-w-xl text-sm leading-relaxed">
              Enter real traffic counts for each direction — vehicles, pedestrians, and emergency vehicles.
              The adaptive algorithm will compute signal priorities and optimized green-light durations instantly.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-4 flex-wrap">
            {[
              { label: 'Total Vehicles', value: totalVehicles, icon: <Car size={14}/>, color: 'text-blue-400' },
              { label: 'Pedestrians', value: totalPed, icon: <Users size={14}/>, color: 'text-emerald-400' },
              { label: 'Emergency', value: totalEmergency, icon: <Siren size={14}/>, color: 'text-rose-400' },
            ].map(s => (
              <div key={s.label} className="px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center min-w-[90px]">
                <div className={`flex items-center justify-center gap-1 ${s.color} mb-1`}>{s.icon}</div>
                <p className="text-white font-black text-xl font-mono">{s.value}</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Input Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {DIRECTIONS.map(dir => (
            <DirectionCard
              key={dir}
              dir={dir}
              inputs={inputs[dir]}
              onChange={handleChange}
            />
          ))}
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={handleRun}
            disabled={!hasAnyInput}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base transition-all active:scale-95 shadow-lg shadow-blue-900/30 group"
          >
            <Play size={18} className="group-hover:scale-110 transition-transform" />
            Run Adaptive Algorithm
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-base transition-all active:scale-95"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {/* ── Results ── */}
        {ran && result && (
          <div className="space-y-8">

            {/* Emergency Banner */}
            {result.hasEmergency && (
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-rose-950/50 border border-rose-500/40 shadow-lg shadow-rose-900/20">
                <div className="flex-shrink-0 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40">
                  <Siren size={24} className="text-rose-400 animate-bounce" />
                </div>
                <div>
                  <p className="text-rose-300 font-black text-lg">🚨 Emergency Override Active</p>
                  <p className="text-rose-400/70 text-sm">
                    Emergency vehicle detected in <strong>{result.emergencyDirs.join(', ')}</strong>.
                    Green corridor assigned — all other directions held at RED.
                  </p>
                </div>
              </div>
            )}

            {/* Result Cards */}
            <div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <Zap size={12} className="text-blue-400" /> Signal Phase Results
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {result.phaseOrder.map(dir => (
                  <ResultCard key={dir} dir={dir} result={result} />
                ))}
              </div>
            </div>

            {/* Phase Order + Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Phase sequence */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                <h4 className="text-slate-300 font-bold mb-5 flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-blue-400" /> Recommended Phase Sequence
                </h4>
                <div className="space-y-3">
                  {result.phaseOrder.map((dir, i) => {
                    const c = DIR_COLORS[dir];
                    return (
                      <div key={dir} className="flex items-center gap-3">
                        <span className="text-slate-600 font-mono text-xs w-5">{i + 1}.</span>
                        <div className={`flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl border ${c.border} ${c.bg}`}>
                          <span className={c.text}>{DIR_ICONS[dir]}</span>
                          <span className={`font-bold text-sm ${c.text}`}>{dir}</span>
                          <span className="ml-auto font-mono text-xs text-slate-400">{result.greenTimes[dir]}s green</span>
                          <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cycle summary */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                <h4 className="text-slate-300 font-bold mb-5 flex items-center gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Cycle Summary
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Total Cycle Time', value: `${Object.values(result.greenTimes).reduce((a,b)=>a+b,0)}s`, color: 'text-white' },
                    { label: 'Active Green Lane', value: result.activeGreen, color: 'text-emerald-400' },
                    { label: 'Mode', value: result.hasEmergency ? '🚨 Emergency Override' : '⚡ Adaptive Signal', color: result.hasEmergency ? 'text-rose-400' : 'text-blue-400' },
                    { label: 'Total Traffic Load', value: `${result.totalScore.toFixed(1)} units`, color: 'text-purple-400' },
                    { label: 'Intersection Efficiency', value: `${result.efficiency}%`, color: 'text-amber-400' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center py-2 border-b border-slate-800/60 last:border-0">
                      <span className="text-slate-500 text-sm">{row.label}</span>
                      <span className={`font-bold text-sm font-mono ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* How scores were calculated */}
            <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800">
              <p className="text-slate-500 text-xs font-mono leading-relaxed">
                <span className="text-blue-400 font-bold">Algorithm: </span>
                Priority Score = Vehicles + (Pedestrians × 0.6) + (Emergency × 3.0) &nbsp;|&nbsp;
                Green Duration = (Score / Total Score) × 120s, clamped [10s – 60s] &nbsp;|&nbsp;
                Emergency vehicles trigger an immediate green override for their direction.
              </p>
            </div>

          </div>
        )}

        {/* Empty state prompt */}
        {!ran && (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl">
            <FlaskConical size={40} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Enter traffic counts above and click <strong className="text-blue-400">Run Adaptive Algorithm</strong> to see results.</p>
          </div>
        )}

      </div>
    </section>
  );
}
