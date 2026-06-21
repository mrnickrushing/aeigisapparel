import React from "react";

function FrameCorner({ position }) {
  const pos = {
    tl: "top-[54px] left-[18px] border-t-2 border-l-2",
    tr: "top-[54px] right-[18px] border-t-2 border-r-2",
    bl: "bottom-[18px] left-[18px] border-b-2 border-l-2",
    br: "bottom-[18px] right-[18px] border-b-2 border-r-2",
  };
  return (
    <div
      className={`fixed w-[42px] h-[42px] pointer-events-none z-50 border-[#D4AF37] ${pos[position]}`}
    />
  );
}

export default function AdminShell({ children }) {
  return (
    <div className="min-h-screen dusky-sky grain scanlines relative">
      <div className="relative z-10 w-full bg-[#11141C] border-b border-[#2A3040] text-[10px] font-mono uppercase tracking-[0.3em] py-1.5 text-center text-[#A0A6B5]">
        <span className="hud-dot inline-block w-1.5 h-1.5 bg-[#D4AF37] mr-2 align-middle" />
        Built through adversity · Forged through leadership · Strength in Order
      </div>
      <FrameCorner position="tl" />
      <FrameCorner position="tr" />
      <FrameCorner position="bl" />
      <FrameCorner position="br" />
      <div className="relative z-[6]">{children}</div>
    </div>
  );
}
