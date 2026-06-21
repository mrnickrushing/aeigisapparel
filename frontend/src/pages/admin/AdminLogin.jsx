import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import AdminShell from "./AdminShell";
import { adminLogin, getAdminToken } from "../../lib/adminApi";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (getAdminToken()) {
    navigate("/admin", { replace: true });
  }

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(password);
      navigate("/admin", { replace: true });
    } catch {
      toast.error("Incorrect password.");
    }
    setLoading(false);
  };

  return (
    <AdminShell>
      <div
        data-testid="admin-login-page"
        className="min-h-[calc(100vh-34px)] flex items-center justify-center px-5 py-16"
      >
        <form
          onSubmit={submit}
          className="corners fade-up w-full max-w-[460px] bg-[#11141C] border border-[#2A3040] p-10 md:p-12"
        >
          <div className="flex items-center justify-center gap-2 mb-5 label text-[#D4AF37]">
            <span className="hud-dot inline-block w-1.5 h-1.5 bg-[#D4AF37]" />
            AEGIS // Protocol · 0001
          </div>
          <h2 className="etched font-display text-4xl text-center mb-2">ADMIN</h2>
          <div className="flex items-center gap-4 my-6">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
            <span className="label text-[#6E7585] whitespace-nowrap text-[9px]">
              Strength in Order
            </span>
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
          </div>

          <label className="label text-[#6E7585] block mb-2">Admin Password</label>
          <div className="flex items-center gap-2 bg-[#06080C] border border-[#2A3040] focus-within:border-[#D4AF37] px-4 py-3.5 mb-6">
            <Lock className="w-4 h-4 text-[#6E7585]" />
            <input
              data-testid="admin-password-input"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none font-mono text-sm tracking-wider"
              placeholder="••••••••"
            />
          </div>

          <button
            data-testid="admin-login-submit"
            disabled={loading}
            className="pulse-ring w-full border-2 border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-black disabled:opacity-50 text-[#D4AF37] px-5 py-4 font-mono uppercase tracking-[0.4em] text-[13px] font-semibold transition-colors"
          >
            {loading ? "Verifying..." : "[ Authenticate ]"}
          </button>

          <p className="label text-[#6E7585] mt-6 leading-relaxed text-[9px] border-l-2 border-[#2A3040] pl-4">
            Validated against the admin password on the backend. A session token is issued on
            success and held only in this browser.
          </p>
        </form>
      </div>
    </AdminShell>
  );
}
