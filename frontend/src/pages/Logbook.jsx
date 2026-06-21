import React from "react";
import { Link } from "react-router-dom";

const LOGS = [
  {
    code: "LOG // 003",
    date: "2026.02",
    title: "Tactical White Drops",
    body: "The AEGIS Tactical White Tee enters general issue. Bone heavyweight, full CORE shield on the back. Designed for the line.",
    tag: "DROP",
  },
  {
    code: "LOG // 002",
    date: "2026.02",
    title: "Mission File 001 Declassified",
    body: "Campaign 001 — A-YARD — open for review. The campaign that birthed the Order. Five buildings. One mission.",
    tag: "BRIEF",
  },
  {
    code: "LOG // 001",
    date: "2026.01",
    title: "The Order Stands Up",
    body: "AEGIS goes live. Two divisions: CORE for the standard, LEGACY for those who earned it. Strength in Order.",
    tag: "STAND-UP",
  },
];

export default function Logbook() {
  return (
    <div className="bg-[#06080C] text-white min-h-screen">
      <section className="border-b border-[#1F2330] relative overflow-hidden">
        <div className="absolute inset-0 warning-stripes opacity-15" />
        <div className="relative px-5 md:px-12 py-16">
          <div className="label mb-2">/ Field Records</div>
          <h1
            data-testid="logbook-heading"
            className="font-display text-5xl sm:text-7xl uppercase tracking-[0.05em] etched-steel leading-none"
          >
            Logbook
          </h1>
          <p className="text-[#A0A6B5] mt-4 max-w-2xl">
            Field updates, drop notices, declassified mission files. Read the
            ledger.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 md:px-10 py-16 space-y-6">
        {LOGS.map((l) => (
          <article
            data-testid={`logbook-entry-${l.code.replace(/[^a-z0-9]/gi, "-")}`}
            key={l.code}
            className="border border-[#1F2330] bg-[#0A0D14] p-6 md:p-8 hover:border-[#D4AF37] transition-colors corners relative"
          >
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A6B5]">
                {l.code} · {l.date}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5">
                {l.tag}
              </div>
            </div>
            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-[0.05em]">
              {l.title}
            </h2>
            <p className="text-[#A0A6B5] mt-3 leading-relaxed">{l.body}</p>
          </article>
        ))}

        <div className="text-center pt-8">
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-2 border border-[#1F2330] hover:border-[#D4AF37] hover:text-[#D4AF37] text-[#A0A6B5] px-6 py-3 font-mono uppercase tracking-[0.3em] text-[11px] transition-colors"
          >
            View campaigns →
          </Link>
        </div>
      </section>
    </div>
  );
}
