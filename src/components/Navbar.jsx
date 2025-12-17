import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* LEFT: Logo Section */}
        <div>
          <h1 className="text-[18px] font-semibold tracking-tight leading-tight text-slate-900">
            Gully Cricket Modern
          </h1>
          <p className="text-[12px] font-normal tracking-wide leading-snug text-slate-500">
            Set Up Matches & Track Live Scores
          </p>
        </div>

        {/* RIGHT: User Profile */}
        <div className="flex items-center gap-3">
          {/* User Name */}
          <div className="text-right leading-tight">
            <p className="text-[14px] font-medium tracking-tight text-slate-900">
              Md Dilkash
            </p>
            <p className="text-[11px] font-normal tracking-wide text-slate-500">
              Creator
            </p>
          </div>

          {/* Avatar */}
          <img
            src="https://media.licdn.com/dms/image/v2/D4D03AQEldctReMxvhQ/profile-displayphoto-crop_800_800/B4DZncvjCtHsAI-/0/1760345076623?e=1767225600&v=beta&t=Xd69igqzxfoCJQRClTPXHGHGqy_3S-dojH1WoXlaMeU"
            alt="Md Dilkash"
            className="
              w-10 h-10 rounded-full border border-slate-300
              object-cover shadow-sm hover:shadow-md transition
            "
          />
        </div>
      </div>
    </nav>
  );
}
