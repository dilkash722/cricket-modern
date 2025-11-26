import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* HERO SECTION */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-12 pb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Cricket Scoring App
        </h1>

        <p className="text-gray-600 text-sm sm:text-base mt-3 max-w-md leading-relaxed">
          Start a clean and smooth ball-by-ball scoring experience built for
          casual matches and tournaments.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          {/* Please Read */}
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-5 text-base border-gray-400 text-gray-700 hover:bg-gray-100"
            onClick={() => setShowInfo(true)}
          >
            Please Read
          </Button>

          {/* Start Match */}
          <Button
            size="lg"
            className="px-8 py-5 text-base bg-black text-white hover:bg-neutral-800"
            onClick={() => navigate("/setup")}
          >
            Start New Match
          </Button>
        </div>
      </div>

      {/* PROFILE SECTION */}
      <div className="w-full flex justify-center pb-20">
        <div className="text-center">
          <img
            src="https://media.licdn.com/dms/image/v2/D4D03AQEldctReMxvhQ/profile-displayphoto-crop_800_800/B4DZncvjCtHsAI-/0/1760345076623?e=1766016000&v=beta&t=Rpp3VhI1YAFfjhxUcpc507VJJygB60BuDgZAbRKIMGs"
            alt="Md Dilkash"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto shadow-lg object-cover"
          />

          <h2 className="text-lg sm:text-xl font-semibold mt-4 text-slate-900">
            Developed by <span className="font-bold">Md Dilkash</span>
          </h2>

          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Full Stack Developer
          </p>
        </div>
      </div>

      {/* INFO POPUP */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Before You Start</h2>

            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p>Please read this before you start the match:</p>

              <p className="font-medium">
                Create Team → Toss → Decision → Scoreboard → Result
              </p>

              <p className="pt-2 text-xs text-red-600">
                Important: The match data is only stored in your browser memory.
                If you refresh the page or press back/forward, all match
                progress will be lost.
              </p>
            </div>

            <div className="flex justify-end mt-5">
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
