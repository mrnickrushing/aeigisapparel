import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { fetchCampaign } from "../lib/api";

export default function CampaignDetail() {
  const { slug } = useParams();
  const [c, setC] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setC(null);
    fetchCampaign(slug)
      .then((data) => {
        setC(data);
        setError("");
      })
      .catch((err) => {
        setError(err?.response?.status === 404 ? "Campaign not found." : "Campaign details are unavailable right now.");
      });
  }, [slug]);

  const statusLabel =
    c?.status === "active" ? "Active" : c?.status === "coming_soon" ? "Coming Soon" : "Classified";

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#A0A6B5] font-mono uppercase tracking-widest px-5 text-center">
        {error}
      </div>
    );
  }

  if (!c) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#A0A6B5] font-mono uppercase tracking-widest">
        Loading mission file…
      </div>
    );
  }

  const accent = c.accent;

  return (
    <div className="bg-[#06080C] text-white min-h-screen">
      <div className="px-5 md:px-12 py-6">
        <Link
          to="/campaigns"
          className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.3em] text-[#A0A6B5] hover:text-white"
        >
          <ChevronLeft className="w-3 h-3" /> All campaigns
        </Link>
      </div>

      {/* Mission file header */}
      <section className="border-y border-[#1F2330] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: `radial-gradient(circle at 80% 40%, ${accent}33 0%, transparent 60%)` }}
        />
        <div className="absolute inset-0 warning-stripes opacity-15" />

        <div className="relative px-5 md:px-12 py-12 grid md:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#A0A6B5] mb-2">
              MISSION FILE // {c.code}
            </div>
            <h1
              data-testid="campaign-name"
              className="font-display text-5xl sm:text-7xl uppercase leading-none tracking-[0.05em]"
              style={{ color: accent }}
            >
              {c.name}
            </h1>
            <p className="mt-3 text-[#A0A6B5] text-lg max-w-2xl">{c.tagline}</p>
            <div className="mt-5 flex items-center gap-2 font-mono uppercase text-[10px] tracking-[0.3em] border border-[#2A3040] bg-[#11141C] px-3 py-1.5 inline-flex" style={{ color: accent }}>
              <ShieldCheck className="w-3 h-3" /> Status: {statusLabel}
            </div>
          </div>
          <img
            src={c.image}
            alt={c.name}
            className="w-48 md:w-72 object-contain"
            style={{ filter: `drop-shadow(0 0 24px ${accent}66)` }}
          />
        </div>
      </section>

      {/* Body */}
      <section className="max-w-4xl mx-auto px-5 md:px-10 py-16 space-y-10">
        <div className="border border-[#1F2330] bg-[#0A0D14] p-6 md:p-10 corners relative">
          <div className="label mb-3" style={{ color: accent }}>/ Mission Overview</div>
          <p className="text-[#A0A6B5] leading-relaxed text-base">{c.description}</p>

          {c.bullets?.length > 0 && (
            <ul className="mt-6 space-y-2">
              {c.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: accent }}>
                    [0{i + 1}]
                  </span>
                  <span className="text-[#A0A6B5]">{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#6E7585] mb-4">
            Gear tied to this campaign is awarded — not sold.
          </p>
          <Link
            data-testid="campaign-to-legacy"
            to="/legacy"
            className="inline-flex items-center gap-2 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] px-6 py-3 font-mono uppercase tracking-[0.3em] text-[11px] transition-colors"
          >
            View Legacy Manifest →
          </Link>
        </div>
      </section>
    </div>
  );
}
