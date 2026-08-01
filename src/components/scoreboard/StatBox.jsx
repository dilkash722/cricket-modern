export default function StatBox({
  label,
  val,
  highlight,
  color = "text-slate-400",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-1 sm:py-2 px-0.5 sm:px-1">
      <p className="text-[7px] sm:text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-tighter mb-0.5 sm:mb-1">
        {label}
      </p>
      <p
        className={`text-[11px] sm:text-xs md:text-sm font-black ${
          highlight ? "text-indigo-400 scale-110" : color
        }`}
      >
        {val}
      </p>
    </div>
  );
}
