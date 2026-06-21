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
      className={`fixed inset-0 z-50 bg-[#05070B] grain transition-opacity duration-500 overflow-hidden ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0.08)_10%,rgba(74,127,193,0.12)_24%,rgba(5,7,11,0.1)_48%,rgba(5,7,11,0.96)_74%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,11,0.1)_0%,rgba(5,7,11,0.45)_28%,rgba(5,7,11,0.9)_100%)]" />
      <div className="absolute inset-0 scanlines pointer-events-none" />
      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-[-5%] top-[16%] w-[26rem] h-[26rem] rounded-full bg-[#0e1520] blur-3xl opacity-70" />
        <div className="absolute right-[-6%] top-[10%] w-[30rem] h-[30rem] rounded-full bg-[#2d1f0d] blur-3xl opacity-55" />
        <div className="absolute left-0 right-0 top-[12%] h-[44%] bg-[radial-gradient(circle_at_50%_68%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_12%,transparent_42%)]" />
        <div className="absolute left-0 top-[8%] w-[18%] h-[52%] bg-[linear-gradient(180deg,rgba(212,175,55,0.08)_0%,rgba(5,7,11,0.02)_26%,rgba(5,7,11,0.92)_100%)] opacity-80" />
        <div className="absolute right-0 top-[8%] w-[18%] h-[52%] bg-[linear-gradient(180deg,rgba(74,127,193,0.08)_0%,rgba(5,7,11,0.02)_26%,rgba(5,7,11,0.92)_100%)] opacity-80" />
        <div className="absolute inset-x-0 bottom-[14%] h-32 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[36%] bg-[linear-gradient(180deg,transparent_0%,rgba(5,7,11,0.72)_34%,rgba(5,7,11,0.98)_100%)]" />
        <div className="absolute left-1/2 top-[31%] -translate-x-1/2 w-[70vw] max-w-[58rem] h-[46vh] rounded-[48px] border border-[#d4af37]/10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_22%,rgba(5,7,11,0.06)_48%,rgba(5,7,11,0.72)_100%)] blur-[1px]" />
        <div className="absolute left-1/2 top-[26%] -translate-x-1/2 w-[46rem] max-w-[90vw] h-[46rem] rounded-full border border-[#d4af37]/20 opacity-30 blur-2xl" />
      </div>

      {/* HUD top bar */}
      <div className="absolute top-0 left-0 right-0 px-6 md:px-10 py-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.3em] text-[#6E7585] z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#D4AF37] hud-dot" />
          AEGIS // PROTOCOL · 0001
        </div>
        <div className="hidden md:flex items-center gap-8">
          <span>HOME</span>
          <span>CORE</span>
          <span>LEGACY</span>
          <span>CAMPAIGN</span>
          <span>LOGBOOK</span>
          <span>CONTACT</span>
        </div>
      </div>

      {/* HUD corners */}
      <CornerBracket cls="top-12 left-6 md:top-16 md:left-10" pos="tl" />
      <CornerBracket cls="top-12 right-6 md:top-16 md:right-10" pos="tr" />
      <CornerBracket cls="bottom-12 left-6 md:bottom-16 md:left-10" pos="bl" />
      <CornerBracket cls="bottom-12 right-6 md:bottom-16 md:right-10" pos="br" />

      <div className="relative z-10 h-full w-full flex items-center justify-center px-5">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] items-center gap-10 w-full max-w-7xl pt-24 pb-12">
          <div className="flex flex-col items-start fade-up max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <Logo className="w-16 h-16 md:w-20 md:h-20 sticker-glow-gold" />
              <div className="leading-none">
                <h1 className="font-display text-6xl md:text-8xl lg:text-[150px] tracking-[0.08em] etched leading-none">
                  AEGIS
                </h1>
                <div className="font-mono uppercase tracking-[0.4em] text-[#D4AF37] text-[10px] md:text-xs mt-2">
                  Strength in Order
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-[#D4AF37]" />
              <div className="font-mono uppercase tracking-[0.35em] text-[#D4AF37] text-[10px] md:text-xs">
                Built through adversity. Forged through leadership.
              </div>
            </div>

            <p className="max-w-xl text-[#D0D4DE] text-sm md:text-base leading-relaxed">
              We do not inherit culture. We build it. Through discipline, unity,
              and a standard that never lowers.
            </p>

            <div
              data-testid="splash-boot-sequence"
              className="mt-10 h-28 flex flex-col text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#A0A6B5]"
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

            {bootIdx >= BOOT_LINES.length && (
              <div className="mt-4 flex flex-col items-start fade-up">
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

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/10 blur-3xl" />
            <div className="relative mx-auto w-[34rem] max-w-full aspect-[4/5] rounded-[2.5rem] border border-[#2a3040] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent),radial-gradient(circle_at_50%_28%,rgba(212,175,55,0.26)_0%,rgba(74,127,193,0.14)_30%,rgba(5,7,11,0.08)_58%,rgba(5,7,11,0.96)_100%)] shadow-[0_0_120px_rgba(0,0,0,0.65)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.16)_0%,transparent_26%),linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)] opacity-60" />
              <div className="absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(180deg,transparent_0%,rgba(5,7,11,0.2)_20%,rgba(5,7,11,0.82)_100%)]" />
              <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-[24rem] h-[24rem] rounded-full bg-[#000] border border-[#d4af37]/12 blur-[1px] opacity-70" />
              <div className="absolute left-1/2 top-[19%] -translate-x-1/2 w-[18rem] h-[18rem] rounded-full border border-[#d4af37]/16" />
              <div className="absolute left-1/2 top-[30%] -translate-x-1/2 w-[14rem] h-[14rem] rounded-full border border-[#6b9dd3]/20" />
              <div className="absolute left-1/2 top-[34%] -translate-x-1/2 w-[10rem] h-[10rem] rounded-full border border-[#ffffff]/8" />
              <div className="absolute inset-x-0 bottom-[18%] flex justify-center">
                <Logo className="w-44 h-44 md:w-56 md:h-56 opacity-90 drop-shadow-[0_0_24px_rgba(212,175,55,0.18)]" />
              </div>
              <div className="absolute inset-x-0 bottom-[10%] text-center">
                <div className="font-display text-2xl uppercase tracking-[0.2em] etched">One Mission</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.45em] text-[#D4AF37]">
                  Five Buildings · One Standard
                </div>
              </div>
            </div>
          </div>
        </div>
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
