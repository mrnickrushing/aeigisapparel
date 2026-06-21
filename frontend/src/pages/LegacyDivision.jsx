import React, { useEffect, useState } from "react";
import { Lock, ShieldCheck, Send, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { fetchProducts, redeemLegacy, requestLegacy } from "../lib/api";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

export default function LegacyDivision() {
  const [products, setProducts] = useState([]);
  const [code, setCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const { legacyUnlocks, addUnlocks } = useCart();
  const [error, setError] = useState("");
  const [requestForm, setRequestForm] = useState({
    full_name: "",
    email: "",
    unit: "",
    story: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts({ division: "legacy" })
      .then((data) => {
        setProducts(data);
        setError("");
      })
      .catch(() => setError("Legacy manifest is unavailable right now."));
  }, []);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setRedeeming(true);
    try {
      const res = await redeemLegacy(code.trim());
      addUnlocks(res);
      toast.success(`Verified: ${res.label}. ${res.unlocked_names.length} item(s) unlocked.`);
      setCode("");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Invalid code.");
    }
    setRedeeming(false);
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!requestForm.full_name || !requestForm.email || !requestForm.story) {
      toast.error("Fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await requestLegacy(requestForm);
      toast.success("Request received. The Order will be in touch.");
      setRequestForm({ full_name: "", email: "", unit: "", story: "" });
    } catch {
      toast.error("Submission failed. Try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-[#06080C] text-white">
      {/* HERO */}
      <section className="relative border-b border-[#1F2330] overflow-hidden dusky-sky dusky-clouds">
        <div className="absolute inset-0 warning-stripes opacity-15" />
        <div className="relative px-5 md:px-12 pt-16 pb-12 grid md:grid-cols-[auto_1fr] gap-10 items-center">
          <img
            src="/aegis/legacy-badge.jpg"
            alt="AEGIS Legacy badge"
            className="w-48 md:w-64 sticker-glow-gold object-contain"
          />
          <div>
            <div className="label mb-2 text-[#D4AF37]">/ Division 02 · Restricted</div>
            <h1
              data-testid="legacy-heading"
              className="font-display text-5xl sm:text-7xl md:text-8xl uppercase leading-none tracking-[0.05em] etched"
            >
              Legacy
            </h1>
            <div className="font-mono uppercase tracking-[0.4em] text-[#D4AF37] text-xs mt-3">
              Earned. Never Issued.
            </div>
            <p className="text-[#A0A6B5] mt-5 max-w-2xl">
              Legacy pieces are not sold to the public. They are awarded to
              individuals who earned them through service, commitment,
              leadership, or contribution to a specific team, unit, or mission.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 font-mono uppercase text-[10px] tracking-[0.3em] text-[#D4AF37] border border-[#D4AF37]/60 bg-[#D4AF37]/5 px-3 py-1.5">
              Honor · Sacrifice · Loyalty · Legacy
            </div>
          </div>
        </div>
      </section>

      {/* REDEEM BAR */}
      <section className="border-b border-[#1F2330] bg-[#0A0D14]">
        <div className="px-5 md:px-12 py-8 grid lg:grid-cols-2 gap-6 items-center">
          <div>
            <div className="label mb-2 text-[#D4AF37]">/ Authentication</div>
            <h2 className="font-display text-xl md:text-2xl uppercase tracking-[0.1em]">
              Redeem Award Code
            </h2>
            <p className="text-xs text-[#A0A6B5] font-mono uppercase tracking-widest mt-1">
              Enter the code issued with your gear to unlock the manifest.
            </p>
            {legacyUnlocks.slugs?.length > 0 && (
              <div
                data-testid="legacy-unlocked-banner"
                className="mt-3 text-xs text-[#4ea374] font-mono uppercase tracking-widest"
              >
                ✓ Cleared: {legacyUnlocks.label} · {legacyUnlocks.slugs.length} item(s) unlocked
              </div>
            )}
          </div>
          <form onSubmit={handleRedeem} className="flex gap-2 w-full">
            <div className="relative flex-1">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
              <input
                data-testid="legacy-code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ENTER-YOUR-CODE"
                className="w-full bg-[#06080C] border border-[#1F2330] focus:border-[#D4AF37] outline-none pl-10 pr-4 py-3 font-mono text-sm tracking-widest uppercase placeholder:text-[#6E7585]"
              />
            </div>
            <button
              data-testid="legacy-redeem-btn"
              disabled={redeeming}
              className="bg-[#D4AF37] hover:bg-[#E6C454] disabled:opacity-60 text-black px-6 py-3 font-mono uppercase tracking-[0.25em] text-xs font-bold"
            >
              {redeeming ? "..." : "Verify"}
            </button>
          </form>
        </div>
      </section>

      {/* MANIFEST */}
      <section className="px-5 md:px-12 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="label mb-2 text-[#D4AF37]">/ Legacy Manifest</div>
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-[0.05em]">
              Awarded Pieces
            </h2>
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#A0A6B5] hidden md:block">
            {products.length} entries
          </div>
        </div>

        {error ? (
          <div className="border border-dashed border-[#1F2330] p-12 text-center text-[#A0A6B5]">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="border border-dashed border-[#1F2330] p-12 text-center text-[#A0A6B5]">
            Manifest loading…
          </div>
        ) : (
          <div
            data-testid="legacy-products-grid"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((p) => (
              <ProductCard key={p.id} product={p} divisionAccent="#D4AF37" />
            ))}
          </div>
        )}
      </section>

      {/* REQUEST FORM */}
      <section className="border-t border-[#1F2330] bg-[#0A0D14]">
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-16">
          <div className="border border-[#1F2330] bg-[#11141C] p-6 md:p-10 corners relative">
            <div className="absolute inset-0 warning-stripes opacity-15 pointer-events-none" />
            <div className="relative">
              <div className="label mb-2 text-[#D4AF37]">/ Petition</div>
              <h2 className="font-display text-2xl md:text-3xl uppercase tracking-[0.05em] mb-2">
                Request Legacy Recognition
              </h2>
              <p className="text-[#A0A6B5] text-sm mb-6">
                If you believe you've earned Legacy recognition for your
                service, commitment, or contribution to a mission, submit your
                story. The Order will review.
              </p>

              <form
                data-testid="legacy-request-form"
                onSubmit={handleRequest}
                className="grid sm:grid-cols-2 gap-4"
              >
                <Field label="Full name" required>
                  <input
                    data-testid="legacy-req-name"
                    required
                    value={requestForm.full_name}
                    onChange={(e) => setRequestForm({ ...requestForm, full_name: e.target.value })}
                    className={inputCls}
                    placeholder="Sgt. J. Smith"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    data-testid="legacy-req-email"
                    required
                    type="email"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                    className={inputCls}
                    placeholder="you@dept.gov"
                  />
                </Field>
                <Field label="Unit / Facility" className="sm:col-span-2">
                  <input
                    data-testid="legacy-req-unit"
                    value={requestForm.unit}
                    onChange={(e) => setRequestForm({ ...requestForm, unit: e.target.value })}
                    className={inputCls}
                    placeholder="MCSP A-Yard / EOP / etc."
                  />
                </Field>
                <Field label="Your Story" className="sm:col-span-2" required>
                  <textarea
                    data-testid="legacy-req-story"
                    required
                    value={requestForm.story}
                    onChange={(e) => setRequestForm({ ...requestForm, story: e.target.value })}
                    rows={5}
                    className={`${inputCls} resize-none`}
                    placeholder="Tell us about your service, the mission, the team. What earned you this recognition?"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <button
                    data-testid="legacy-req-submit"
                    type="submit"
                    disabled={submitting}
                    className="bg-[#D4AF37] hover:bg-[#E6C454] disabled:opacity-60 text-black px-6 py-3 font-mono uppercase tracking-[0.3em] text-xs font-bold inline-flex items-center gap-2"
                  >
                    {submitting ? "Sending..." : (
                      <>
                        Submit Petition <Send className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const inputCls =
  "w-full bg-[#06080C] border border-[#1F2330] focus:border-[#D4AF37] outline-none px-4 py-3 text-sm text-white font-mono tracking-wide";

function Field({ label, required, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#A0A6B5] block mb-2">
        {label} {required && <span className="text-[#D4AF37]">*</span>}
      </span>
      {children}
    </label>
  );
}
