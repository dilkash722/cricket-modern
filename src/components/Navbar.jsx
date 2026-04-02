import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import avatar from "../assets/avtar.jpg";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 py-5 flex items-center justify-between">
        {/* LEFT: Logo Section - Clean & Solid */}
        <div
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="h-10 w-10 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center group-hover:border-indigo-500/50 transition-all duration-500">
            <Trophy className="text-white h-5 w-5 group-hover:text-indigo-400 transition-colors" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-black tracking-[-0.05em] leading-none text-white uppercase">
              NIKHRA CRICKET
            </h1>
            <p className="text-[9px] font-black tracking-[0.2em] text-slate-600 uppercase mt-1">
              Live Engine
            </p>
          </div>
        </div>

        {/* RIGHT: Profile Section - Minimalist */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col text-right">
            <p className="text-xs font-black tracking-tight text-white uppercase">
              Md Dilkash
            </p>
            <p className="text-[9px] font-black tracking-[0.2em] text-indigo-500/60 uppercase mt-0.5">
              Architect
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-indigo-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <img
              src={avatar}
              alt="Md Dilkash"
              className="relative w-10 h-10 rounded-full border border-white/10 object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-[#020617] rounded-full flex items-center justify-center">
              <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
