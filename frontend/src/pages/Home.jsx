import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { fetchCampaigns } from "../lib/api";
import Logo from "../components/Logo";

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchCampaigns().then(setCampaigns).catch(() => {});
  }, []);

  return (
    <div className="bg-[#06080C] text-white">
      {/* ============ HERO ============ */}
      <section
        data-testid="hero-section"
        className="relative min-h-[92vh] overflow-hidden grain"
      >
        <div className="absolute inset-0 slow-zoom">
          <img
            src="https://images.unsplash.com/photo-1768106047915-d5065b18352d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwyfHxncml0dHklMjBzcGFydGFuJTIwaGVsbWV0fGVufDB8fHx8MTc4MTk4MjM5Mnww&ixlib=rb-4.1.0&q=85"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080C] via-[#06080C]/70 to-[#06080C]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080C] via-transparent to-[#06080C]/50" />
        <div className="absolute inset-0 scanlines pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 pt-24 md:pt-32 pb-20">
          <div
            data-testid="hero-eyebrow"
            className="inline-flex items-center gap-2 border border-[#D4AF37]/40 bg-[#D4AF37]/5 px-3 py-1.5 mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#D4AF37] hud-dot" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]">
              AEGIS · Strength in Order
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Logo className="w-14 h-14" />
            <h1
              data-testid="hero-headline"
              className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[160px] uppercase leading-[0.85] tracking-[0.1em] etched"
            >
              AEGIS
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-4 mb-8">
            <div className="h-px w-12 md:w-24 bg-[#D4AF37]" />
            <div className="font-mono uppercase tracking-[0.4em] text-[#D4AF37] text-xs md:text-sm">
              Strength in Order
            </div>
            <div className="h-px w-12 md:w-24 bg-[#D4AF37]" />
          </div>

          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl uppercase leading-tight max-w-4xl tracking-[0.02em]">
            <span className="text-white">Built through adversity.</span>
            <br />
            <span className="etched-steel">Forged through leadership.</span>
          </h2>
          <p
            data-testid="hero-subtext"
            className="mt-6 text-[#A0A6B5] text-base md:text-lg max-w-2xl leading-relaxed italic"
          >
            We do not inherit culture. We build it. Through discipline, unity,
            and a standard that never lowers.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <Link
              data-testid="hero-enter-core"
              to="/core"
              className="flex-1 group relative bg-[#11141C] border border-[#4A7FC1] hover:bg-[#4A7FC1]/10 px-6 py-5 transition-colors text-left"
            >
              <div className="label text-[#6B9DD3]">/ Enter</div>
              <div className="font-display text-2xl uppercase mt-1 tracking-wide">
                Core <span className="text-[#6B9DD3]">Division</span>
              </div>
              <div className="text-xs text-[#A0A6B5] mt-1 font-mono uppercase tracking-widest">
                The Standard
              </div>
              <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B9DD3] group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              data-testid="hero-enter-legacy"
              to="/legacy"
              className="flex-1 group relative bg-[#11141C] border border-[#D4AF37] hover:bg-[#D4AF37]/10 px-6 py-5 transition-colors text-left"
            >
              <div className="label text-[#D4AF37]">/ Enter</div>
              <div className="font-display text-2xl uppercase mt-1 tracking-wide">
                Legacy <span className="text-[#D4AF37]">Division</span>
              </div>
              <div className="text-xs text-[#A0A6B5] mt-1 font-mono uppercase tracking-widest">
                Earned. Never Issued.
              </div>
              <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bottom marquee */}
        <div className="absolute bottom-0 left-0 right-0 border-y border-[#1F2330] bg-[#06080C]/90 overflow-hidden z-10">
          <div className="flex animate-marquee whitespace-nowrap py-3">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex shrink-0">
                {[
                  "BUILT ON DISCIPLINE",
                  "UNITED AS ONE",
                  "HOLD THE LINE",
                  "EARNED · NEVER ISSUED",
                  "STRENGTH IN ORDER",
                  "FIVE BUILDINGS · ONE MISSION",
                  "BUILT BY THE LINE · FOR THE LINE",
                ].map((t, j) => (
                  <span
                    key={j}
                    className="font-display text-xl md:text-2xl uppercase tracking-[0.15em] mx-8 text-white/70"
                  >
                    {t} <span className="text-[#D4AF37] mx-2">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DIVISIONS ============ */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-20 md:py-28">
        <div className="text-center mb-12">
          <div className="label mb-3">/ 02 — Choose Your Path</div>
          <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-[0.05em] etched-steel">
            Two Divisions. One Order.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* CORE */}
          <Link
            data-testid="division-core"
            to="/core"
            className="group relative bg-[#11141C] border border-[#1F2330] hover:border-[#4A7FC1] overflow-hidden corners-steel transition-colors"
          >
            <div className="absolute inset-0 brushed opacity-60" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 70% 30%, rgba(74,127,193,0.18) 0%, transparent 65%)",
              }}
            />
            <div className="relative p-8 md:p-12 min-h-[520px] flex flex-col">
              <div className="label text-[#6B9DD3] mb-3">Core Division</div>
              <h3 className="font-display text-4xl md:text-5xl uppercase leading-none tracking-[0.05em] etched-steel">
                The Standard.<br />The Identity.
              </h3>
              <p className="mt-4 text-[#A0A6B5] max-w-md">
                The foundation. Performance and tactical apparel designed for
                everyday wear, training, corrections, law enforcement, military,
                and people who value discipline and readiness.
              </p>

              <div className="my-8 flex-1 flex items-center justify-center relative">
                <img
                  src="/aegis/core-badge.jpg"
                  alt="AEGIS CORE"
                  className="w-56 md:w-64 sticker-glow-steel object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="inline-flex items-center gap-3 font-mono uppercase text-xs tracking-[0.3em] text-[#6B9DD3] group-hover:gap-5 transition-all">
                <ShieldCheck className="w-4 h-4" /> Enter Core Division <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* LEGACY */}
          <Link
            data-testid="division-legacy"
            to="/legacy"
            className="group relative bg-[#11141C] border border-[#1F2330] hover:border-[#D4AF37] overflow-hidden corners transition-colors"
          >
            <div className="absolute inset-0 warning-stripes opacity-30" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(212,175,55,0.18) 0%, transparent 65%)",
              }}
            />
            <div className="relative p-8 md:p-12 min-h-[520px] flex flex-col">
              <div className="label text-[#D4AF37] mb-3">Legacy Division</div>
              <h3 className="font-display text-4xl md:text-5xl uppercase leading-none tracking-[0.05em] etched">
                The People.<br />The Reason.
              </h3>
              <p className="mt-4 text-[#A0A6B5] max-w-md">
                The places. The stories. The reason we exist. Legacy pieces are
                not sold to the public. They are awarded for service,
                commitment, leadership, or contribution to a mission.
              </p>

              <div className="my-8 flex-1 flex items-center justify-center relative">
                <img
                  src="/aegis/legacy-badge.jpg"
                  alt="AEGIS LEGACY"
                  className="w-56 md:w-64 sticker-glow-gold object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="inline-flex items-center gap-3 font-mono uppercase text-xs tracking-[0.3em] text-[#D4AF37] group-hover:gap-5 transition-all">
                <Lock className="w-4 h-4" /> Enter Legacy Division <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ============ CAMPAIGN MODE ============ */}
      <section className="border-y border-[#1F2330] bg-gradient-to-b from-[#06080C] to-[#0A0D14] relative overflow-hidden">
        <div className="absolute inset-0 warning-stripes opacity-20" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <div className="label mb-3">/ 03 — Mission Files</div>
              <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-[0.05em] etched">
                Campaign Mode
              </h2>
              <p className="text-[#A0A6B5] mt-4 max-w-lg">
                Each campaign is a story. A unit. A mission. Earn the gear.
                Hold the standard. Build the legacy.
              </p>
            </div>
            <Link
              data-testid="view-all-campaigns"
              to="/campaigns"
              className="font-mono text-xs uppercase tracking-[0.3em] text-[#D4AF37] hover:underline"
            >
              View all campaigns →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {campaigns.map((c) => (
              <CampaignCard key={c.slug} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ MISSION STATEMENT ============ */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <div className="label mb-3">/ 04 — The Order</div>
            <h2 className="font-display text-3xl sm:text-5xl uppercase leading-tight etched-steel">
              We're changing the culture in the most negative environment.
            </h2>
          </div>
          <div className="space-y-4 text-[#A0A6B5] text-base leading-relaxed">
            <p>
              AEGIS isn't just clothing. It's about <span className="text-white">identity</span>, <span className="text-white">belonging</span>, and earning your place.
            </p>
            <p>
              It was inspired by those who worked hard to unite the yard. When
              there was no support, in high-stress environments where
              discipline, resilience, teamwork, and professionalism matter
              most.
            </p>
            <p className="italic text-[#D4AF37]">
              When you wear AEGIS, you're joining something bigger than a
              shirt. You're joining the Order.
            </p>
            <Link
              to="/legacy"
              className="inline-flex items-center gap-2 mt-4 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] px-6 py-3 font-mono uppercase tracking-[0.3em] text-[11px] transition-colors"
            >
              Join the Order <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function CampaignCard({ c }) {
  const isLocked = c.status === "coming_soon";
  const isClassified = c.status === "classified";
  const accent = c.accent || "#D4AF37";

  const Body = (
    <div
      data-testid={`campaign-card-${c.slug}`}
      className="group relative bg-[#11141C] border border-[#1F2330] hover:border-[var(--accent)] transition-colors h-full flex flex-col"
      style={{ "--accent": accent }}
    >
      <div className="relative aspect-square overflow-hidden brushed">
        <div
          className="absolute inset-0 opacity-50"
          style={{ background: `radial-gradient(circle, ${accent}33 0%, transparent 65%)` }}
        />
        <img
          src={c.image}
          alt={c.name}
          className={`absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-700 ${
            !isLocked && !isClassified ? "group-hover:scale-105" : "opacity-30 grayscale"
          }`}
          loading="lazy"
        />
        {(isLocked || isClassified) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-10 h-10 text-[#6E7585]" />
          </div>
        )}
        <div className="absolute top-2 left-2 text-[9px] font-mono uppercase tracking-[0.25em] text-[#A0A6B5] border border-[#2A3040] bg-[#06080C]/80 px-1.5 py-0.5">
          CAMPAIGN // {c.code}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="font-display text-xl uppercase tracking-[0.08em] leading-tight">
          {c.name}
        </div>
        <p className="text-[11px] text-[#A0A6B5] mt-1 line-clamp-2 flex-1">{c.tagline}</p>
        <div
          className="mt-3 text-[10px] font-mono uppercase tracking-[0.25em]"
          style={{ color: isLocked || isClassified ? "#6E7585" : accent }}
        >
          {isLocked ? "Coming Soon →" : isClassified ? "Classified" : "View Campaign →"}
        </div>
      </div>
    </div>
  );

  if (isLocked || isClassified) {
    return <div className="cursor-not-allowed">{Body}</div>;
  }
  return <Link to={`/campaigns/${c.slug}`}>{Body}</Link>;
}
