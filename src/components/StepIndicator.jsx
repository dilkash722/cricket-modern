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
    phase: "05",
  },
};

export default function StepIndicator() {
  const location = useLocation();
  const currentPath = location.pathname;
  const content = HEADER_CONTENT[currentPath] || HEADER_CONTENT["/setup"];
  if (currentPath === "/result") return null;

  return (
    <div className="w-full py-10 flex flex-col items-center text-center">
      {/* Phase */}
      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-400/60 mb-2">
        Phase {content.phase}
      </span>

      {/* Title */}
      <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-[-0.05em] uppercase text-white leading-tight">
        {content.title}
      </h2>

      {/* Description */}
      <p className="mt-3 text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-[0.25em] max-w-md">
        {content.desc}
      </p>
    </div>
  );
}
