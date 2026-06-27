import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Mail, Facebook, Youtube, Send } from "lucide-react";
import { toast } from "sonner";
import { subscribeNewsletter } from "../lib/api";
import Logo from "./Logo";

const PILLARS = [
  {
    icon: "shield",
    title: "Built on Discipline",
    text: "We do what's right when no one is watching.",
  },
  {
    icon: "cross",
    title: "United as One",
    text: "One team. One standard. One mission.",
  },
  {
    icon: "pulse",
    title: "Hold the Line",
    text: "When chaos comes, we don't break.",
  },
  {
    icon: "laurel",
    title: "Earned. Never Issued.",
    text: "Respect is earned. Legacy is forever.",
  },
  {
    icon: "shield2",
    title: "Strength in Order",
    text: "Discipline first. Integrity always. Purpose every day.",
  },
];

function PillarIcon({ name }) {
  const stroke = "#D4AF37";
  const common = { width: 28, height: 28, fill: "none", stroke, strokeWidth: 1.5 };
  switch (name) {
    case "shield":
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" /></svg>
      );
    case "cross":
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" /></svg>
      );
    case "pulse":
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M2 12h4l2-6 4 12 2-6h8" /></svg>
      );
    case "laurel":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 4l2 4 4 1-4 1-2 4-2-4-4-1 4-1z" />
          <path d="M4 18c4 2 12 2 16 0" />
        </svg>
      );
    default:
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" />
          <path d="M9 12h6M12 9v6" />
        </svg>
      );
  }
}

export function Pillars() {
  return (
    <section
      data-testid="pillars-section"
      className="border-y border-[#1F2330] bg-gradient-to-b from-[#06080C] to-[#0A0D14]"
    >
      <div className="px-5 md:px-12 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[#1F2330]">
        {PILLARS.map((p) => (
          <div
            key={p.title}
            className="bg-[#06080C] p-6 flex flex-col gap-3 transition-colors hover:bg-[#0A0D14]"
          >
            <PillarIcon name={p.icon} />
            <div>
              <div className="font-display text-base uppercase tracking-[0.1em] text-white">
                {p.title}
              </div>
              <p className="text-[#A0A6B5] text-xs mt-2 leading-relaxed">
                {p.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const data = await subscribeNewsletter(email);
      toast.success(data?.message || "Locked in. Welcome to the Order.");
      setEmail("");
    } catch {
      toast.error("Could not subscribe. Try again.");
    }
    setLoading(false);
  };

  return (
    <footer
      data-testid="site-footer"
      className="relative bg-[#06080C] border-t border-[#1F2330] mt-0"
    >
      <Pillars />
      <div className="px-5 md:px-12 pt-16 pb-8">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Link to="/home" className="flex items-center gap-3 mb-4">
              <Logo className="w-10 h-10" />
              <div>
                <div className="font-display text-2xl etched-steel">AEGIS</div>
                <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#6E7585]">
                  Strength in Order
                </div>
              </div>
            </Link>
            <p className="text-[#A0A6B5] text-sm leading-relaxed max-w-md italic">
              More than a brand. It's a mindset. It's a way of life.
            </p>
            <p className="text-[#6E7585] text-xs mt-4 font-mono uppercase tracking-[0.2em]">
              Built by the line. For the line.
            </p>
          </div>

          <div className="lg:col-span-3">
            <div className="label mb-4 text-[#D4AF37]">Navigation</div>
            <ul className="space-y-2 text-sm">
              {[
                ["/home", "Home"],
                ["/core", "Core Division"],
                ["/legacy", "Legacy Division"],
                ["/campaigns", "Campaigns"],
                ["/faq", "FAQ"],
                ["/logbook", "Logbook"],
                ["/contact", "Contact"],
                ["/privacy", "Privacy"],
                ["/terms", "Terms"],
                ["/returns", "Returns"],
                ["/shipping", "Shipping"],
                ["/accessibility", "Accessibility"],
              ].map(([to, l]) => (
                <li key={l}>
                  <Link className="text-[#A0A6B5] hover:text-white" to={to}>
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="label mb-4 text-[#D4AF37]">Join the Order</div>
            <p className="text-[#A0A6B5] text-sm mb-4">
              Receive intel on new drops, campaigns, and earned-only releases.
            </p>
            <form onSubmit={submit} className="flex gap-2 w-full">
              <input
                data-testid="newsletter-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="OFFICER@DEPT.GOV"
                className="flex-1 bg-[#06080C] border border-[#1F2330] focus:border-[#D4AF37] outline-none px-4 py-3 font-mono text-xs tracking-wider uppercase placeholder:text-[#6E7585]"
              />
              <button
                data-testid="newsletter-submit-btn"
                disabled={loading}
                className="bg-[#D4AF37] hover:bg-[#E6C454] disabled:opacity-60 px-5 py-3 font-mono uppercase tracking-widest text-[11px] font-bold text-black inline-flex items-center gap-2"
              >
                {loading ? "..." : (
                  <>
                    Join <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>

            <div className="label mt-6 mb-3 text-[#D4AF37]">Connect</div>
            <div className="flex gap-3">
              {[
                { Icon: Camera, label: "Instagram", href: "#" },
                { Icon: Facebook, label: "Facebook", href: "#" },
                { Icon: Youtube, label: "YouTube", href: "#" },
                { Icon: Mail, label: "Email", href: "mailto:info@strengthinorder.com" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  data-testid={`social-${label.toLowerCase()}`}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 border border-[#1F2330] hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors text-[#A0A6B5]"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="divider-gold my-10" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6E7585]">
            Built on Discipline · United as One · Earned. Never Issued.
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              data-testid="admin-link"
              className="text-[10px] text-[#6E7585] hover:text-[#D4AF37] font-mono uppercase tracking-[0.2em] transition-colors"
            >
              Admin
            </Link>
            <div className="text-[10px] text-[#6E7585] font-mono tracking-wider">
              © {new Date().getFullYear()} AEGIS APPAREL · All rights reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
