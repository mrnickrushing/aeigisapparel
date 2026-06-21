import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Truck, Shield, RotateCcw, Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { fetchProduct, fetchProducts, redeemLegacy } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { getProductEditorial } from "../content/storefrontContent";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [code, setCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState("");
  const { legacyUnlocks, addUnlocks } = useCart();

  useEffect(() => {
    setProduct(null);
    fetchProduct(slug)
      .then((p) => {
        setProduct(p);
        setSize(p.sizes?.[0] || "");
        setColor(p.colors?.[0] || "");
        setError("");
      })
      .catch((err) => {
        setError(err?.response?.status === 404 ? "Product not found." : "Product details are unavailable right now.");
      });
  }, [slug]);

  useEffect(() => {
    if (product?.division) {
      fetchProducts({ division: product.division })
        .then((all) => {
          setRelated(all.filter((p) => p.slug !== product.slug).slice(0, 4));
        })
        .catch(() => setRelated([]));
    }
  }, [product]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#A0A6B5] font-mono uppercase tracking-widest px-5 text-center">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#A0A6B5] font-mono uppercase tracking-widest">
        Loading…
      </div>
    );
  }

  const isLegacy = product.is_award_only;
  const isUnlocked =
    legacyUnlocks.ids?.includes(product.id) ||
    legacyUnlocks.slugs?.includes(product.slug);
  const accent = product.accent || (product.division === "core" ? "#4A7FC1" : "#D4AF37");
  const image = (product.images && product.images[0]) || "";
  const editorial = getProductEditorial(product);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setRedeeming(true);
    try {
      const res = await redeemLegacy(code.trim());
      addUnlocks(res);
      toast.success(`Verified: ${res.label}.`);
      setCode("");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Invalid code.");
    }
    setRedeeming(false);
  };

  return (
    <div className="bg-[#06080C] text-white">
      <div className="px-5 md:px-12 py-6">
        <Link
          to={product.division === "legacy" ? "/legacy" : "/core"}
          className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.3em] text-[#A0A6B5] hover:text-white"
        >
          <ChevronLeft className="w-3 h-3" /> {product.division === "legacy" ? "Legacy Manifest" : "Core Division"}
        </Link>
      </div>

      <div className="px-5 md:px-12 pb-20">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div>
            <div
              data-testid="product-image-wrap"
              className="relative aspect-[4/5] bg-[#11141C] border border-[#1F2330] brushed overflow-hidden"
            >
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at 50% 40%, ${accent}33 0%, transparent 65%)` }}
              />
              <img
                src={image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {product.badge && (
                <div
                  className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-[0.25em] px-2 py-1"
                  style={isLegacy ? { background: "#D4AF37", color: "#000" } : { background: "#06080C", color: accent, border: `1px solid ${accent}` }}
                >
                  {product.badge}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="label mb-3" style={{ color: accent }}>
              {product.division === "legacy" ? "Legacy · Awarded" : "Core Division"}
            </div>
            <h1
              data-testid="product-name"
              className="font-display text-4xl sm:text-5xl uppercase leading-none tracking-[0.05em]"
            >
              {product.name}
            </h1>
            <p className="text-[#A0A6B5] mt-3 text-base">{product.short}</p>

            {isLegacy && (
              <div
                data-testid="product-legacy-status"
                className={`mt-5 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] px-3 py-1.5 border ${
                  isUnlocked
                    ? "border-[#4ea374] bg-[#4ea374]/10 text-[#4ea374]"
                    : "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                }`}
              >
                {isUnlocked ? "✓ Code Verified · Cleared to redeem" : <><Lock className="w-3 h-3" /> Earned. Never Issued.</>}
              </div>
            )}

            <p className="text-[#A0A6B5] mt-6 leading-relaxed">{product.description}</p>

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="mt-8">
                <div className="label mb-3">Size</div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      data-testid={`size-option-${s.replace(/[/\s]/g, "-")}`}
                      onClick={() => setSize(s)}
                      className={`px-4 py-2 border font-mono text-xs uppercase tracking-[0.25em] transition-colors ${
                        size === s
                          ? "border-[var(--a)] bg-[var(--a)]/10 text-white"
                          : "border-[#1F2330] text-[#A0A6B5] hover:border-white hover:text-white"
                      }`}
                      style={{ "--a": accent }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="mt-6">
                <div className="label mb-3">Color · {color}</div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      data-testid={`color-option-${c.replace(/\s/g, "-")}`}
                      onClick={() => setColor(c)}
                      className={`px-4 py-2 border font-mono text-xs uppercase tracking-[0.25em] transition-colors ${
                        color === c
                          ? "border-white bg-white/5 text-white"
                          : "border-[#1F2330] text-[#A0A6B5] hover:border-[#A0A6B5]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Legacy code redeem */}
            {isLegacy && !isUnlocked && (
              <form
                onSubmit={handleRedeem}
                className="mt-6 border border-[#D4AF37]/40 bg-[#D4AF37]/5 p-4"
                data-testid="product-redeem-form"
              >
                <div className="label text-[#D4AF37] mb-3">/ Enter your award code</div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                    <input
                      data-testid="product-redeem-input"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="ENTER-YOUR-CODE"
                      className="w-full bg-[#06080C] border border-[#1F2330] focus:border-[#D4AF37] outline-none pl-10 pr-4 py-2.5 font-mono text-sm tracking-widest uppercase placeholder:text-[#6E7585]"
                    />
                  </div>
                  <button
                    data-testid="product-redeem-btn"
                    type="submit"
                    disabled={redeeming}
                    className="bg-[#D4AF37] hover:bg-[#E6C454] disabled:opacity-60 text-black px-5 py-2.5 font-mono uppercase tracking-[0.25em] text-xs font-bold"
                  >
                    {redeeming ? "..." : "Verify"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#1F2330] pt-6">
              {[
                { i: Truck, l: "Free $75+" },
                { i: Shield, l: "Heavyweight" },
                { i: RotateCcw, l: "30-day swap" },
              ].map(({ i: Icon, l }, idx) => (
                <div key={idx} className="flex flex-col items-center text-center gap-1">
                  <Icon className="w-5 h-5" style={{ color: accent }} />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A0A6B5]">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <article className="border border-[#1F2330] bg-[#0A0D14] corners p-6 md:p-8">
            <div className="label mb-3" style={{ color: accent }}>
              / Fit Notes
            </div>
            <p className="text-[#A0A6B5] leading-relaxed">{editorial.fit}</p>
            <ul className="mt-4 space-y-2">
              {editorial.sizing.map((note) => (
                <li key={note} className="flex gap-3 text-sm text-[#A0A6B5]">
                  <span className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: accent }}>
                    •
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="border border-[#1F2330] bg-[#0A0D14] corners p-6 md:p-8">
            <div className="label mb-3" style={{ color: accent }}>
              / What Makes It Different
            </div>
            <ul className="space-y-3">
              {editorial.whatMakesDifferent.map((note) => (
                <li key={note} className="flex gap-3 text-sm text-[#A0A6B5] leading-relaxed">
                  <span className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: accent }}>
                    [x]
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="border border-[#1F2330] bg-[#0A0D14] corners p-6 md:p-8">
            <div className="label mb-3" style={{ color: accent }}>
              / Care Instructions
            </div>
            <ul className="space-y-3">
              {editorial.care.map((note) => (
                <li key={note} className="flex gap-3 text-sm text-[#A0A6B5] leading-relaxed">
                  <span className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: accent }}>
                    [x]
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="border border-[#1F2330] bg-[#0A0D14] corners p-6 md:p-8">
            <div className="label mb-3" style={{ color: accent }}>
              / Highlights
            </div>
            <ul className="space-y-3">
              {editorial.highlights.map((note) => (
                <li key={note} className="flex gap-3 text-sm text-[#A0A6B5] leading-relaxed">
                  <span className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: accent }}>
                    [x]
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        {related.length > 0 && (
          <div className="mt-24">
            <div className="label mb-3" style={{ color: accent }}>From the same division</div>
            <h2 className="font-display text-3xl uppercase tracking-[0.05em] mb-8">
              More {product.division === "legacy" ? "Legacy" : "Core"}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} divisionAccent={accent} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
