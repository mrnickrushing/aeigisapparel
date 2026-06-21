import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { to: "/home", label: "Home" },
  { to: "/core", label: "Core" },
  { to: "/legacy", label: "Legacy" },
  { to: "/campaigns", label: "Campaign" },
  { to: "/logbook", label: "Logbook" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Tactical top bar */}
      <div
        data-testid="top-banner"
        className="w-full bg-[#11141C] border-b border-[#2A3040] text-[10px] font-mono uppercase tracking-[0.3em] py-1.5 text-center text-[#A0A6B5]"
      >
        <span className="hud-dot inline-block w-1.5 h-1.5 bg-[#D4AF37] mr-2 align-middle" />
        Built through adversity · Forged through leadership · Strength in Order
      </div>

      <header
        data-testid="site-header"
        className="sticky top-0 z-40 w-full bg-[#06080C]/90 backdrop-blur-xl border-b border-[#1F2330]"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-[68px] flex items-center justify-between">
          <Link
            data-testid="logo-home-link"
            to="/home"
            className="flex items-center gap-3 group"
          >
            <Logo className="w-11 h-11" />
            <div className="leading-none">
              <div className="font-display text-2xl tracking-[0.15em] etched-steel">
                AEGIS
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#6E7585] mt-0.5">
                Strength in Order
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <NavLink
                key={l.label}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
                to={l.to}
                className={({ isActive }) =>
                  `text-[11px] font-mono uppercase tracking-[0.3em] transition-colors ${
                    isActive ? "text-[#D4AF37]" : "text-[#A0A6B5] hover:text-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              data-testid="profile-btn"
              className="hidden md:flex w-10 h-10 border border-[#1F2330] hover:border-[#D4AF37] items-center justify-center transition-colors"
              aria-label="Profile"
              onClick={() => navigate("/legacy")}
            >
              <User className="w-4 h-4 text-[#A0A6B5]" />
            </button>
            <button
              data-testid="mobile-menu-toggle"
              className="lg:hidden p-2 border border-[#1F2330]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            data-testid="mobile-menu"
            className="lg:hidden border-t border-[#1F2330] bg-[#06080C]"
          >
            <div className="px-5 py-4 flex flex-col gap-3">
              {navLinks.map((l) => (
                <button
                  key={l.label}
                  data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                  onClick={() => {
                    setMobileOpen(false);
                    navigate(l.to);
                  }}
                  className="text-left text-sm font-mono uppercase tracking-[0.25em] text-[#A0A6B5] hover:text-white py-2 border-b border-[#1F2330]/60"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
