import { useLocation } from "react-router-dom";

const HEADER_CONTENT = {
  "/setup": {
    title: "Match Setup",
    desc: "Define squads and parameters",
    phase: "01",
  },
  "/toss": {
    title: "The Toss",
    desc: "Arbitration of match control",
    phase: "02",
  },
  "/decision": {
    title: "Strategic Choice",
    desc: "Batting and bowling selection",
    phase: "03",
  },
  "/scoreboard": {
    title: "Live Dashboard",
    desc: "Real-time ball tracking",
    phase: "04",
  },
  "/result": {
    title: "Match Summary",
    desc: "Comprehensive result data",
    phase: "05",
  },
};

export default function StepIndicator() {
  const location = useLocation();
  const currentPath = location.pathname;
  const content = HEADER_CONTENT[currentPath] || HEADER_CONTENT["/setup"];

  return (
    <div className="w-full pt-16 pb-12 flex flex-col items-center justify-center animate-in fade-in duration-1000">
      {/* MINIMAL PHASE INDICATOR */}
      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/40 mb-3 ml-2">
        Phase {content.phase}
      </span>

      {/* ELITE CLEAN HEADING */}
      <h2 className="text-4xl md:text-7xl font-black tracking-[-0.07em] uppercase text-white leading-none mb-4">
        {content.title}
      </h2>

      {/* SUB-TEXT */}
      <p className="text-[10px] md:text-[11px] font-bold text-slate-700 uppercase tracking-[0.3em] max-w-sm">
        {content.desc}
      </p>
    </div>
  );
}
