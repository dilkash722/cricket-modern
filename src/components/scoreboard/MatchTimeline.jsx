import { ScrollArea } from "@/components/ui/scroll-area";

export default function MatchTimeline({ ballLog, scrollRef }) {
  return (
    <div className="bg-[#0A0F1E] border border-white/5 rounded-3xl p-5 md:p-6 shadow-xl">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] font-medium">
          Match Timeline
        </p>

        <span className="text-[10px] text-indigo-400 uppercase tracking-wider">
          Live
        </span>
      </div>

      {/* SCROLL */}
      <ScrollArea ref={scrollRef} className="h-[350px] w-full">
        <div className="flex flex-col-reverse gap-3 pr-4">
          {ballLog?.length > 0 ? (
            ballLog.map((log, i) => {
              const isBoundary = log.runs === 4 || log.runs === 6;
              const isWicket = log.isWicket;

              return (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border transition ${
                    i === 0
                      ? "border-indigo-500/30 bg-indigo-500/[0.05]"
                      : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  {/* TOP ROW */}
                  <div className="flex items-center justify-between text-sm">
                    {/* LEFT INFO */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] text-slate-500">
                        {log.over}
                      </span>

                      <span className="text-white font-semibold">
                        {log.bowler}
                      </span>

                      <span className="text-slate-500 text-xs">to</span>

                      <span className="text-slate-300">{log.batsman}</span>
                    </div>

                    {/* RESULT BOX */}
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        isWicket
                          ? "bg-red-600 text-white"
                          : isBoundary
                            ? "bg-indigo-600 text-white"
                            : "bg-white/5 text-slate-300"
                      }`}
                    >
                      {isWicket ? "W" : log.event}
                    </div>
                  </div>

                  {/* COMMENTARY */}
                  <p className="mt-2 text-[12px] text-slate-400 leading-relaxed">
                    {isWicket
                      ? `${log.bowler} got ${log.batsman} out (${log.event})`
                      : isBoundary
                        ? `${log.batsman} hits a ${log.runs === 4 ? "FOUR" : "SIX"} off ${log.bowler}`
                        : log.runs === 0
                          ? `Dot ball by ${log.bowler}`
                          : `${log.batsman} takes ${log.runs} run${
                              log.runs > 1 ? "s" : ""
                            }`}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-center text-slate-600 py-16 text-sm">
              No activity yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
