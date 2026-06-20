import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

const BOOT_LINES = [
  "INITIALIZING AEGIS SYSTEMS...",
  "VERIFYING ORDER PROTOCOLS...",
  "LOADING CAMPAIGN MANIFEST...",
  "FIVE BUILDINGS · ONE MISSION.",
  "READY.",
];

export default function Splash() {
  const navigate = useNavigate();
  const [bootIdx, setBootIdx] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (bootIdx >= BOOT_LINES.length) return;
    const t = setTimeout(() => setBootIdx((i) => i + 1), 320);
    return () => clearTimeout(t);
  }, [bootIdx]);

  const enter = () => {
    setExiting(true);
    setTimeout(() => navigate("/home"), 550);
  };

  return (
    <div
      data-testid="splash-screen"
      className={`fixed inset-0 z-50 bg-[#06080C] grain transition-opacity duration-500 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background image */}
      <div className="absolute inset-0 slow-zoom">
        <img
          src="https://images.unsplash.com/photo-1766521723068-78bf96e98939?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwzfHxwcmlzb24lMjB3YXRjaHRvd2VyJTIwbmlnaHR8ZW58MHx8fHwxNzgxOTgyMzkyfDA&ixlib=rb-4.1.0&q=85"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#06080C]/70 to-[#06080C]" />
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* HUD top bar */}
      <div className="absolute top-0 left-0 right-0 px-6 md:px-10 py-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.3em] text-[#6E7585] z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#D4AF37] hud-dot" />
          AEGIS // PROTOCOL · 0001
        </div>
        <div className="hidden md:block">CLASSIFICATION: PUBLIC</div>
      </div>

      {/* HUD corners */}
      <CornerBracket cls="top-12 left-6 md:top-16 md:left-10" pos="tl" />
      <CornerBracket cls="top-12 right-6 md:top-16 md:right-10" pos="tr" />
      <CornerBracket cls="bottom-12 left-6 md:bottom-16 md:left-10" pos="bl" />
      <CornerBracket cls="bottom-12 right-6 md:bottom-16 md:right-10" pos="br" />

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-5">
        {/* Logo */}
        <div className="flex flex-col items-center fade-up">
          <Logo className="w-16 h-16 md:w-20 md:h-20 mb-6 sticker-glow-gold" />
          <h1 className="font-display text-6xl md:text-9xl tracking-[0.18em] etched leading-none">
            AEGIS
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <div className="h-px w-12 bg-[#D4AF37]" />
            <div className="font-mono uppercase tracking-[0.45em] text-[#D4AF37] text-xs md:text-sm">
              Strength in Order
            </div>
            <div className="h-px w-12 bg-[#D4AF37]" />
          </div>
        </div>

        {/* Boot sequence */}
        <div
          data-testid="splash-boot-sequence"
          className="mt-12 md:mt-16 h-32 flex flex-col items-center text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#A0A6B5]"
        >
          {BOOT_LINES.slice(0, bootIdx).map((l, i) => (
            <div key={i} className="type-line flex items-center gap-2 py-0.5">
              <span className="text-[#D4AF37]">›</span>
              <span className={i === bootIdx - 1 && bootIdx < BOOT_LINES.length ? "flicker" : ""}>
                {l}
              </span>
            </div>
          ))}
        </div>

        {/* Enter button */}
        {bootIdx >= BOOT_LINES.length && (
          <div className="mt-6 flex flex-col items-center fade-up">
            <button
              data-testid="splash-enter-btn"
              onClick={enter}
              className="pulse-ring relative group border-2 border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] px-10 md:px-16 py-4 md:py-5 font-mono uppercase tracking-[0.45em] text-sm md:text-base font-bold transition-all"
            >
              <span className="relative z-10">[ Enter ]</span>
            </button>
            <div className="mt-5 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.4em] text-[#6E7585]">
              Press to enter the Order
            </div>
          </div>
        )}
      </div>

      {/* HUD bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 py-4 flex items-center justify-between text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em] text-[#6E7585] z-10">
        <div>BUILT BY THE LINE · FOR THE LINE</div>
        <div className="hidden md:block">v1.0 · AEGIS APPAREL</div>
      </div>
    </div>
  );
}

function CornerBracket({ cls, pos }) {
  const styles = {
    tl: { borderTop: "2px solid #D4AF37", borderLeft: "2px solid #D4AF37" },
    tr: { borderTop: "2px solid #D4AF37", borderRight: "2px solid #D4AF37" },
    bl: { borderBottom: "2px solid #D4AF37", borderLeft: "2px solid #D4AF37" },
    br: { borderBottom: "2px solid #D4AF37", borderRight: "2px solid #D4AF37" },
  };
  return (
    <div className={`absolute w-12 h-12 z-10 ${cls}`} style={styles[pos]} />
  );
}
