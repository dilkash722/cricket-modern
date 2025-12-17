import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Info } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* HERO SECTION */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-10">
        <span className="text-xs tracking-widest uppercase text-gray-500">
          Fast • Simple • Reliable
        </span>

        <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
          Cricket Scoring App
        </h1>

        <p className="text-gray-600 text-sm sm:text-base mt-4 max-w-lg leading-relaxed">
          A clean, distraction-free ball-by-ball cricket scoring experience —
          perfect for gully cricket, practice matches, and tournaments.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <Button
            size="lg"
            variant="outline"
            className="px-10 py-6 text-base border-gray-400 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            onClick={() => setShowInfo(true)}
          >
            <Info className="h-5 w-5" />
            Please Read
          </Button>

          <Button
            size="lg"
            className="px-10 py-6 text-base bg-black text-white hover:bg-neutral-800 shadow-lg flex items-center gap-2"
            onClick={() => navigate("/setup")}
          >
            <PlayCircle className="h-5 w-5" />
            Start New Match
          </Button>
        </div>
      </div>

      {/* PROFILE SECTION (NO CARD, JUST CONTENT) */}
      <div className="w-full flex justify-center pb-20">
        <div className="text-center">
          <img
            src="https://media.licdn.com/dms/image/v2/D4D03AQEldctReMxvhQ/profile-displayphoto-crop_800_800/B4DZncvjCtHsAI-/0/1760345076623?e=1766016000&v=beta&t=Rpp3VhI1YAFfjhxUcpc507VJJygB60BuDgZAbRKIMGs"
            alt="Md Dilkash"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto shadow-md object-cover"
          />

          <h2 className="text-lg sm:text-xl font-semibold mt-4 text-slate-900">
            Md Dilkash
          </h2>

          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Full Stack Software Engineer
          </p>
        </div>
      </div>

      {/* INFO POPUP */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-slate-900">
              Before You Start
            </h2>

            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p>Follow the flow to avoid issues during the match:</p>

              <p className="font-medium text-slate-900">
                Create Team → Toss → Decision → Scoreboard → Result
              </p>

              <p className="pt-2 text-xs text-red-600">
                Important: Match data is stored only in your browser.
                Refreshing, going back, or switching device mode will reset the
                match.
              </p>

              <p className="pt-1 text-xs text-blue-700 font-medium">
                Tip: Enable Desktop Mode before starting for better visibility.
                Do not change mode during the match.
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setShowInfo(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
