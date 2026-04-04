import { Button } from "@/components/ui/button";
import { ChevronRight, UserPlus, Repeat } from "lucide-react";

export default function ActionModal({ modal, setModal, dispatch }) {
  if (!modal.type) return null;

  const isWicket = modal.type === "wicket";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#0A0F1E] p-6 rounded-xl w-full max-w-sm border border-white/10">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/10">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center">
            {isWicket ? (
              <UserPlus className="h-4 w-4 text-white" />
            ) : (
              <Repeat className="h-4 w-4 text-white" />
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              {isWicket ? "New Batsman" : "Change Bowler"}
            </h3>
            <p className="text-xs text-slate-400">Enter player name</p>
          </div>
        </div>

        {/* INPUT */}
        <input
          className="w-full mb-4 px-4 py-3 bg-white/5 text-white rounded-lg border border-white/10 focus:border-indigo-500 focus:outline-none placeholder:text-slate-500"
          placeholder="Enter name"
          value={modal.name}
          onChange={(e) => setModal({ ...modal, name: e.target.value })}
        />

        {/* BUTTON */}
        <Button
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
          onClick={() => {
            if (!modal.name.trim()) return;

            // Step 1: Wicket event
            if (isWicket) {
              dispatch({
                type: "BALL_EVENT",
                runs: 0,
                isWicket: true,
                event: "W",
              });
            }

            // Step 2: Update player
            dispatch({
              type: isWicket ? "ADD_BATSMAN" : "CHANGE_BOWLER",
              name: modal.name.trim(),
            });

            // Step 3: Close modal
            setModal({ type: null, name: "" });
          }}
        >
          <span>Confirm</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
