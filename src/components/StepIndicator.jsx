import { useLocation, useNavigate } from "react-router-dom";
import { useMatch } from "../context/MatchContext.jsx";

const steps = ["Create Team", "Toss", "Decision", "Scoreboard", "Result"];

const ROUTE_STEP = {
  "/setup": 1,
  "/toss": 2,
  "/decision": 3,
  "/scoreboard": 4,
  "/result": 5,
};

export default function StepIndicator() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useMatch();

  const currentStep = ROUTE_STEP[location.pathname] || 1;

  const step1Done = !!(state.teamA && state.teamB);
  const step2Done = !!state.tossWinner;
  const step3Done = !!state.oversLimit;
  const step4Done = !!state.matchStarted;
  const step5Done = !!state.matchFinished;

  const isCompleted = (s) => {
    if (s === 1) return step1Done;
    if (s === 2) return step2Done;
    if (s === 3) return step3Done;
    if (s === 4) return step4Done;
    if (s === 5) return step5Done;
    return false;
  };

  // Allow only next unlocked step
  const maxStep = (() => {
    if (step5Done) return 5;
    if (step4Done) return 4;
    if (step3Done) return 3;
    if (step2Done) return 2;
    if (step1Done) return 1;
    return 1;
  })();

  return (
    <div className="w-full py-3 flex justify-center">
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 px-2">
        {steps.map((label, index) => {
          const s = index + 1;
          const done = isCompleted(s);
          const active = s === currentStep;
          const disabled = s > maxStep + 1;

          const route = Object.keys(ROUTE_STEP).find(
            (path) => ROUTE_STEP[path] === s
          );

          return (
            <div
              key={s}
              className={
                "flex items-center gap-3 " +
                (disabled ? "cursor-not-allowed" : "cursor-pointer")
              }
              onClick={() => !disabled && navigate(route)}
            >
              <div className="flex flex-col items-center">
                <div
                  className={
                    "w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold " +
                    (done
                      ? "bg-green-600 text-white"
                      : active
                      ? "bg-blue-500 text-white"
                      : disabled
                      ? "bg-slate-200 text-slate-400"
                      : "bg-slate-300 text-slate-700")
                  }
                >
                  {done ? "✔" : s}
                </div>

                <span
                  className={
                    "mt-1 text-[10px] md:text-xs font-medium text-center " +
                    (done
                      ? "text-green-600"
                      : active
                      ? "text-blue-600"
                      : disabled
                      ? "text-slate-300"
                      : "text-slate-500")
                  }
                >
                  {label}
                </span>
              </div>

              {s !== steps.length && (
                <div
                  className={`hidden md:block h-[2px] ${
                    done
                      ? "bg-green-400"
                      : active
                      ? "bg-blue-300"
                      : "bg-slate-300"
                  }`}
                  style={{ width: 60 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
