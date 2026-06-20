import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Target, Crosshair, Layers } from "lucide-react";
import { fetchProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";

const VALUES = [
  { i: ShieldCheck, label: "Discipline. We Train It." },
  { i: Crosshair, label: "Presence. We Command It." },
  { i: Target, label: "Control. We Maintain It." },
  { i: Layers, label: "The Foundation." },
];

export default function CoreDivision() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const q = { division: "core" };
    if (category) q.category = category;
    fetchProducts(q).then(setProducts);
  }, [category]);

  const cats = ["", "tshirt", "hoodie", "hat"];
  const labels = { "": "All", tshirt: "Tees", hoodie: "Hoodies", hat: "Hats" };

  return (
    <div className="bg-[#06080C] text-white">
      {/* HERO */}
      <section className="relative border-b border-[#1F2330] overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at 70% 50%, rgba(74,127,193,0.15) 0%, transparent 60%)" }}
          />
          <div className="absolute inset-0 brushed opacity-40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 md:px-10 pt-16 pb-12 grid md:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <div className="label mb-2 text-[#6B9DD3]">/ Division 01</div>
            <h1
              data-testid="core-heading"
              className="font-display text-5xl sm:text-7xl md:text-8xl uppercase leading-none tracking-[0.05em] etched-steel"
            >
              Core
            </h1>
            <div className="font-mono uppercase tracking-[0.4em] text-[#6B9DD3] text-xs mt-3">
              The Standard · The Foundation
            </div>
            <p className="text-[#A0A6B5] mt-5 max-w-xl">
              Performance and tactical-inspired apparel designed for everyday
              wear, training, corrections, law enforcement, first responders,
              military, and people who value discipline and readiness.
            </p>
          </div>
          <img
            src="/aegis/core-badge.jpg"
            alt="AEGIS Core badge"
            className="w-48 md:w-64 sticker-glow-steel object-contain"
          />
        </div>

        {/* Value bar */}
        <div className="border-t border-[#1F2330] bg-[#0A0D14]">
          <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1F2330]">
            {VALUES.map(({ i: Icon, label }) => (
              <div
                key={label}
                className="bg-[#06080C] py-4 px-4 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#A0A6B5]"
              >
                <Icon className="w-4 h-4 text-[#6B9DD3]" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-12">
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {cats.map((c) => (
            <button
              key={c || "all"}
              data-testid={`core-cat-${c || "all"}`}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 border font-mono text-[10px] uppercase tracking-[0.3em] transition-colors ${
                category === c
                  ? "border-[#4A7FC1] bg-[#4A7FC1]/10 text-white"
                  : "border-[#1F2330] text-[#A0A6B5] hover:border-[#4A7FC1] hover:text-white"
              }`}
            >
              {labels[c]}
            </button>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="border border-dashed border-[#1F2330] p-12 text-center text-[#A0A6B5]">
            No gear in this category yet. More drops coming.
          </div>
        ) : (
          <div
            data-testid="core-products-grid"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((p) => (
              <ProductCard key={p.id} product={p} divisionAccent="#4A7FC1" />
            ))}
          </div>
        )}
      </section>

      {/* DETAIL STRIP */}
      <section className="border-t border-[#1F2330] bg-[#0A0D14]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 grid md:grid-cols-2 gap-10 items-center">
          <img
            src="/aegis/tactical-white-tee.jpg"
            alt="AEGIS Tactical White"
            className="w-full border border-[#1F2330]"
          />
          <div>
            <div className="label mb-3 text-[#6B9DD3]">/ Spotlight</div>
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-[0.05em] etched-steel leading-none">
              Tactical White.<br />The Foundation Tee.
            </h2>
            <p className="text-[#A0A6B5] mt-4 leading-relaxed">
              Bone-white, heavyweight. Chestplate logo on the front, full CORE
              shield on the back. Built to take the shift and outlast it.
            </p>
            <Link
              to="/product/tactical-white-tee"
              className="mt-6 inline-flex items-center gap-2 border border-[#4A7FC1] hover:bg-[#4A7FC1] hover:text-black text-[#4A7FC1] px-6 py-3 font-mono uppercase tracking-[0.3em] text-[11px] transition-colors"
            >
              Inspect product →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
