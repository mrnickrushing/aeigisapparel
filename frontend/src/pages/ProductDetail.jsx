import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingCart, Truck, Shield, RotateCcw, Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { fetchProduct, fetchProducts, redeemLegacy } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [code, setCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const { addItem, legacyUnlocks, addUnlocks } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setProduct(null);
    fetchProduct(slug).then((p) => {
      setProduct(p);
      setSize(p.sizes?.[0] || "");
      setColor(p.colors?.[0] || "");
    });
  }, [slug]);

  useEffect(() => {
    if (product?.division) {
      fetchProducts({ division: product.division }).then((all) => {
        setRelated(all.filter((p) => p.slug !== product.slug).slice(0, 4));
      });
    }
  }, [product]);

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

  const handleAdd = () => {
    if (isLegacy && !isUnlocked) {
      toast.error("This item is award-only. Enter your code below.");
      return;
    }
    if (product.sizes?.length > 0 && !size) {
      toast.error("Select a size");
      return;
    }
    addItem(product, { size, color, quantity: qty });
    toast.success(`Added: ${product.name}`);
  };

  const handleBuyNow = () => {
    if (isLegacy && !isUnlocked) {
      toast.error("This item is award-only.");
      return;
    }
    if (product.sizes?.length > 0 && !size) {
      toast.error("Select a size");
      return;
    }
    addItem(product, { size, color, quantity: qty });
    navigate("/checkout");
  };

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
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-6">
        <Link
          to={product.division === "legacy" ? "/legacy" : "/core"}
          className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.3em] text-[#A0A6B5] hover:text-white"
        >
          <ChevronLeft className="w-3 h-3" /> {product.division === "legacy" ? "Legacy Manifest" : "Core Division"}
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 pb-20">
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

            {isLegacy ? (
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
            ) : (
              <div
                data-testid="product-price"
                className="font-mono text-3xl mt-4 font-semibold"
              >
                ${product.price.toFixed(2)}
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

            {/* Quantity (only for non-award) */}
            {!isLegacy && (
              <div className="mt-6">
                <div className="label mb-3">Quantity</div>
                <div className="inline-flex border border-[#1F2330]">
                  <button
                    data-testid="qty-minus"
                    onClick={() => setQty((v) => Math.max(1, v - 1))}
                    className="px-4 py-2 hover:bg-[#11141C]"
                  >−</button>
                  <span className="px-6 py-2 font-mono">{qty}</span>
                  <button
                    data-testid="qty-plus"
                    onClick={() => setQty((v) => v + 1)}
                    className="px-4 py-2 hover:bg-[#11141C]"
                  >+</button>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                data-testid="add-to-cart-btn"
                onClick={handleAdd}
                disabled={isLegacy && !isUnlocked}
                className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed text-black py-4 font-mono uppercase tracking-[0.3em] text-sm font-bold inline-flex items-center justify-center gap-2"
                style={{ background: accent }}
              >
                <ShoppingCart className="w-4 h-4" />
                {isLegacy ? "Redeem Awarded Piece" : "Add to Loadout"}
              </button>
              {!isLegacy && (
                <button
                  data-testid="buy-now-btn"
                  onClick={handleBuyNow}
                  className="flex-1 border border-white hover:bg-white hover:text-[#06080C] py-4 font-mono uppercase tracking-[0.3em] text-sm transition-colors"
                >
                  Buy Now
                </button>
              )}
            </div>

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
