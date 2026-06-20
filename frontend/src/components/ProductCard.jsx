import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const CATEGORY_LABEL = {
  tshirt: "TEE",
  hoodie: "HOODIE",
  hat: "HAT",
  beanie: "BEANIE",
  sticker: "STICKER",
  patch: "PATCH",
  coin: "COIN",
  tumbler: "TUMBLER",
};

export default function ProductCard({ product, divisionAccent }) {
  const accent = divisionAccent || product.accent || "#D4AF37";
  const isLegacy = product.is_award_only;
  const image = (product.images && product.images[0]) || product.image || "";

  return (
    <Link
      data-testid={`product-card-${product.slug}`}
      to={`/product/${product.slug}`}
      className="group block bg-[#11141C] border border-[#1F2330] hover:border-[var(--hover)] transition-colors relative"
      style={{ "--hover": accent }}
    >
      <div className="relative aspect-[4/5] overflow-hidden brushed">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${accent}33 0%, transparent 65%)`,
          }}
        />
        <img
          src={image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {product.badge && (
          <div
            className="absolute top-3 left-3 text-[9px] font-mono uppercase tracking-[0.25em] px-2 py-1 border"
            style={
              isLegacy
                ? { background: "#D4AF37", color: "#000", borderColor: "#D4AF37" }
                : { background: "#06080C", color: accent, borderColor: accent }
            }
          >
            {product.badge}
          </div>
        )}
        <div className="absolute top-3 right-3 border border-[#2A3040] bg-[#06080C]/80 text-[9px] font-mono uppercase tracking-[0.25em] px-2 py-1 text-[#A0A6B5]">
          {CATEGORY_LABEL[product.category] || product.category}
        </div>
        {isLegacy && (
          <div className="absolute inset-0 bg-[#06080C]/60 flex items-end justify-center pb-4 opacity-100 group-hover:opacity-0 transition-opacity">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37] border border-[#D4AF37]/60 px-3 py-1 bg-[#06080C]/80">
              <Lock className="w-3 h-3" /> Earned. Never Issued.
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#1F2330]">
        <div
          className="text-[10px] font-mono uppercase tracking-[0.25em] mb-1"
          style={{ color: accent }}
        >
          {product.division === "legacy" ? "Legacy Division" : "Core Division"}
        </div>
        <div className="font-display text-base uppercase tracking-[0.05em] leading-tight mb-2 group-hover:text-[var(--hover)] transition-colors">
          {product.name}
        </div>
        <div className="text-[11px] text-[#A0A6B5] mb-3 line-clamp-1">{product.short}</div>
        <div className="flex items-center justify-between">
          {isLegacy ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
              Awarded
            </span>
          ) : (
            <span className="font-mono text-base font-semibold">${product.price.toFixed(2)}</span>
          )}
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A0A6B5] group-hover:text-white">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
