import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
// Yahan check karo ShieldCheck properly import hai ya nahi
import {
  PlayCircle,
  ShieldCheck,
  Trophy,
  Zap,
  Activity,
  Cpu,
  Target,
} from "lucide-react";
import avatar from "../assets/avtar.jpg";

export default function Home() {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#020617] text-slate-100 overflow-hidden relative">
      {/* Mesh Gradients */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pt-20">
        {/* Branding Badge */}
        <div className="mb-12 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_indigo]" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">
            Nikhra Yuva Cricket Club
          </span>
        </div>

        {/* Hero Title */}
        <div className="mb-10 space-y-2">
          <h1 className="text-7xl md:text-[140px] font-black tracking-[-0.08em] leading-[0.8] uppercase text-white drop-shadow-2xl">
            CRICKET
          </h1>
          <h1 className="text-7xl md:text-[140px] font-black tracking-[-0.08em] leading-[0.8] uppercase bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-600">
            MODERN
          </h1>
        </div>

        <div className="max-w-xl mb-16 space-y-6">
          {/* MAIN TEXT */}
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed tracking-tight">
            Professional scoring for elite local matches. Built for{" "}
            <span className="text-white font-bold">
              Nikhra Yuva Cricket Club
            </span>{" "}
            to manage matches with precision.
          </p>

          {/* STATUS BADGE - No Italic, No Underline, Pure Stealth */}
          <div className="flex items-center justify-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
            <div className="h-[1px] w-8 bg-slate-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
              Fast • Reliable • NYCC
            </span>
            <div className="h-[1px] w-8 bg-slate-800" />
          </div>
        </div>
        {/* BUTTONS SECTION (FIXED ERROR) */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md mb-24 px-4 sm:px-0">
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/setup");
            }}
            className="relative z-50 w-full sm:flex-1 h-[68px] sm:h-16 bg-white text-black hover:bg-indigo-600 hover:text-white rounded-[22px] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl group cursor-pointer active:scale-95"
          >
            Launch Match
            <PlayCircle className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowInfo(true)}
            className="w-full sm:flex-1 h-[68px] sm:h-16 border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 text-white rounded-[22px] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ShieldCheck className="h-5 w-5 text-indigo-500" />
            Protocols
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/5">
          {[
            {
              label: "Engine",
              val: "v1.0.2",
              icon: <Cpu className="h-4 w-4" />,
            },
            {
              label: "Latency",
              val: "0.2ms",
              icon: <Zap className="h-4 w-4" />,
            },
            {
              label: "Status",
              val: "Online",
              icon: <Activity className="h-4 w-4" />,
            },
            {
              label: "System",
              val: "Private",
              icon: <Target className="h-4 w-4" />,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center md:items-start group transition-all"
            >
              <div className="flex items-center gap-3 mb-2 text-indigo-500/30 group-hover:text-indigo-500 transition-colors font-black uppercase text-[10px] tracking-widest">
                {stat.icon} {stat.label}
              </div>
              <span className="text-xl font-bold text-white tracking-tighter ml-7">
                {stat.val}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 flex flex-col items-center gap-4 bg-[#020617]">
        <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-700 cursor-default">
          <img
            src={avatar}
            className="h-10 w-10 rounded-full grayscale border border-white/20"
            alt="Dilkash"
          />
          <span className="text-[9px] font-black tracking-[0.4em] uppercase text-slate-400">
            Developed by <span className="text-white">Md Dilkash</span>
          </span>
        </div>
      </footer>

      {/* PROTOCOL MODAL */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="w-full max-w-sm bg-[#030712] border border-white/5 rounded-[40px] p-10 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
            <h3 className="text-2xl font-black mb-8 tracking-tighter uppercase italic text-white">
              NYCC <span className="text-indigo-500">Rules.</span>
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="h-8 w-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-xs font-black shrink-0">
                  01
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase leading-relaxed tracking-tight">
                  Setup ➔ Toss ➔ Decision ➔ Live Score.
                </p>
              </div>
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">
                  Memory Warning
                </p>
                <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                  Session is volatile. Data clears on refresh.
                </p>
              </div>
            </div>
            <Button
              className="w-full mt-10 h-14 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-colors"
              onClick={() => setShowInfo(false)}
            >
              Acknowledge Engine
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
