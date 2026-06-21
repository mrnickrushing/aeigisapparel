import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { fetchCampaigns } from "../lib/api";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCampaigns()
      .then(setCampaigns)
      .catch(() => setError("Campaign files could not be loaded."));
  }, []);

  return (
    <div className="bg-[#06080C] text-white min-h-screen">
      <section className="border-b border-[#1F2330] relative overflow-hidden">
        <div className="absolute inset-0 warning-stripes opacity-20" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-16">
          <div className="label mb-2 text-[#D4AF37]">/ Mission Files</div>
          <h1
            data-testid="campaigns-heading"
            className="font-display text-5xl sm:text-7xl uppercase tracking-[0.05em] etched leading-none"
          >
            Campaigns
          </h1>
          <p className="text-[#A0A6B5] mt-4 max-w-2xl">
            Each campaign is a chapter in the Order. A team. A facility. A
            mission. Earned pieces are tied to the campaigns they were forged
            in.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-10 py-12">
        {error ? (
          <div className="border border-dashed border-[#1F2330] p-12 text-center text-[#A0A6B5]">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((c) => {
              const locked = c.status === "coming_soon" || c.status === "classified";
              const accent = c.accent;
              const Body = (
                <div
                  data-testid={`campaign-list-card-${c.slug}`}
                  className="group relative bg-[#11141C] border border-[#1F2330] hover:border-[var(--accent)] transition-all duration-300 h-full overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.28)] hover:shadow-[0_22px_56px_rgba(0,0,0,0.46)] hover:-translate-y-1"
                  style={{ "--accent": accent }}
                >
                  <div className="aspect-[16/10] relative overflow-hidden brushed">
                    <div
                      className="absolute inset-0 opacity-50"
                      style={{ background: `radial-gradient(circle, ${accent}33 0%, transparent 65%)` }}
                    />
                    <img
                      src={c.image}
                      alt={c.name}
                      className={`absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-700 ${
                        locked ? "opacity-30 grayscale" : "group-hover:scale-105"
                      }`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,transparent_24%,rgba(0,0,0,0.15)_70%,rgba(0,0,0,0.72)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#06080C] to-transparent" />
                    {locked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-10 h-10 text-[#6E7585]" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#A0A6B5] border border-[#2A3040] bg-[#06080C]/80 px-2 py-1">
                      CAMPAIGN // {c.code}
                    </div>
                    <div
                      className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-[0.25em] px-2 py-1 border"
                      style={{
                        color: locked ? "#6E7585" : "#000",
                        background: locked ? "transparent" : accent,
                        borderColor: locked ? "#2A3040" : accent,
                      }}
                    >
                      {c.status === "active" ? "Active" : c.status === "coming_soon" ? "Coming Soon" : "Classified"}
                    </div>
                  </div>
                  <div className="p-5 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]">
                    <div className="font-display text-2xl uppercase tracking-[0.08em] leading-tight drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]">
                      {c.name}
                    </div>
                    <p className="text-sm text-[#A0A6B5] mt-2">{c.tagline}</p>
                    <div
                      className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em]"
                      style={{ color: locked ? "#6E7585" : accent }}
                    >
                      {locked ? "Restricted →" : "View Mission File →"}
                    </div>
                  </div>
                </div>
              );
              if (locked) return <div key={c.slug}>{Body}</div>;
              return (
                <Link key={c.slug} to={`/campaigns/${c.slug}`}>
                  {Body}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
