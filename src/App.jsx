import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar.jsx";
import StepIndicator from "./components/StepIndicator.jsx";

import Home from "./pages/Home.jsx";
import Setup from "./pages/Setup.jsx";
import Toss from "./pages/Toss.jsx";
import Decision from "./pages/Decision.jsx";
import Scoreboard from "./pages/Scoreboard.jsx";
import Result from "./pages/Result.jsx";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  //  Detect HARD REFRESH only
  useEffect(() => {
    const navType = performance.getEntriesByType("navigation")[0]?.type;

    // Just reloaded? → Go to Home
    if (navType === "reload") {
      navigate("/", { replace: true });
    }
  }, []);

  // StepIndicator hide on Home
  const hideSteps = location.pathname === "/";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {!hideSteps && (
        <div className="w-full sm:max-w-5xl sm:mx-auto px-3 mt-4">
          <StepIndicator />
        </div>
      )}

      <div className="w-full px-2 sm:px-4 py-4 sm:max-w-5xl sm:mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/toss" element={<Toss />} />
          <Route path="/decision" element={<Decision />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </div>
  );
}
