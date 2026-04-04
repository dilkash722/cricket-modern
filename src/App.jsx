import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar.jsx";
import StepIndicator from "./components/StepIndicator.jsx";

import Home from "./pages/Home.jsx";
import Setup from "./pages/Setup.jsx";
import Toss from "./pages/Toss.jsx";
import Decision from "./pages/Decision.jsx";
import ScoreboardPage from "@/pages/scoreboard/ScoreboardPage";
import Result from "./pages/Result.jsx";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const entries = performance.getEntriesByType("navigation");
    if (entries.length > 0 && entries[0].type === "reload") {
      navigate("/", { replace: true });
    }
  }, []);

  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#020617] text-slate-100 selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[40%] bg-indigo-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-50 w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <Navbar />
      </div>

      <main className="relative z-10 flex-1 w-full flex flex-col items-center">
        {!isHomePage && (
          <div className="w-full px-4 mt-2">
            <div className="max-w-5xl mx-auto w-full flex justify-center">
              <StepIndicator />
            </div>
          </div>
        )}

        <div
          className={`w-full px-4 sm:px-8 lg:px-16 py-6 ${
            isHomePage ? "max-w-none" : "max-w-[1440px]"
          }`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/toss" element={<Toss />} />
            <Route path="/decision" element={<Decision />} />
            <Route path="/scoreboard" element={<ScoreboardPage />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
