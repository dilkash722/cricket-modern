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
    <div className="w-full py-6 sm:py-8 flex flex-col items-center text-center">
      {/* Phase */}
      <div className="flex items-center gap-2 mb-3">
        <span className="h-px w-4 bg-indigo-500/40" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-indigo-400/70">
          Phase {content.phase}
        </span>
        <span className="h-px w-4 bg-indigo-500/40" />
      </div>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
        {content.title}
      </h2>

      {/* Description */}
      <p className="mt-2 text-xs sm:text-sm font-medium text-slate-400 tracking-wide max-w-md">
        {content.desc}
      </p>
    </div>
  );
}
