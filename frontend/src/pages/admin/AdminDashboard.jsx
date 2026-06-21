import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, Send, Users, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Logo from "../../components/Logo";
import AdminShell from "./AdminShell";
import {
  clearAdminToken,
  fetchContactMessages,
  fetchSubscribers,
  getAdminToken,
  sendNewsletterBlast,
} from "../../lib/adminApi";

const TABS = [
  { id: "roster", label: "Roster" },
  { id: "broadcast", label: "Broadcast" },
  { id: "messages", label: "Messages" },
];

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="corners bg-[#11141C] border border-[#2A3040] p-6 flex items-center gap-4">
      <Icon className="w-6 h-6 text-[#D4AF37]" />
      <div>
        <div className="font-display text-4xl text-white">{value}</div>
        <div className="label text-[#6E7585] mt-1">{label}</div>
      </div>
    </div>
  );
}

function Panel({ title, endpoint, children }) {
  return (
    <div className="bg-[#11141C] border border-[#2A3040]">
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#1F2330]">
        <h3 className="font-display text-lg tracking-[0.1em]">{title}</h3>
        {endpoint && <div className="label text-[#6E7585] text-[9px]">{endpoint}</div>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("roster");
  const [subscribers, setSubscribers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleAuthError = useCallback(
    (err) => {
      if (err?.response?.status === 401) {
        clearAdminToken();
        navigate("/admin/login", { replace: true });
        return true;
      }
      return false;
    },
    [navigate]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [subRes, msgRes] = await Promise.all([fetchSubscribers(), fetchContactMessages()]);
      setSubscribers(subRes.subscribers);
      setMessages(msgRes.messages);
    } catch (err) {
      if (!handleAuthError(err)) toast.error("Could not load admin data.");
    }
    setLoading(false);
  }, [handleAuthError]);

  useEffect(() => {
    if (!getAdminToken()) {
      navigate("/admin/login", { replace: true });
      return;
    }
    loadData();
  }, [navigate, loadData]);

  const logout = () => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  };

  const submitBlast = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    if (
      !window.confirm(
        `Transmit this broadcast to ${subscribers.length} subscriber(s)? This cannot be undone.`
      )
    ) {
      return;
    }
    setSending(true);
    try {
      const res = await sendNewsletterBlast(subject, body);
      toast.success(
        `Sent to ${res.sent} subscriber(s).${res.failed ? ` ${res.failed} failed.` : ""}`
      );
      setSubject("");
      setBody("");
    } catch (err) {
      if (!handleAuthError(err)) toast.error("Could not send newsletter.");
    }
    setSending(false);
  };

  return (
    <AdminShell>
      <div data-testid="admin-dashboard-page">
        <header className="border-b border-[#1F2330] bg-[#06080C]/90 backdrop-blur-xl sticky top-0 z-30">
          <div className="px-5 md:px-10 h-[84px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo className="w-12 h-12" />
              <div className="leading-none">
                <div className="font-display text-2xl etched-steel tracking-[0.12em]">AEGIS</div>
                <div className="label text-[#6E7585] mt-1">Admin · Command</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 label text-[#A0A6B5]">
                <span className="hud-dot inline-block w-1.5 h-1.5 bg-[#4EA374]" />
                Connected
              </div>
              <button
                data-testid="admin-logout-btn"
                onClick={logout}
                className="flex items-center gap-2 border border-[#2A3040] hover:border-[#D4AF37] px-4 py-2.5 font-mono uppercase tracking-[0.25em] text-[10px] text-[#A0A6B5] hover:text-[#D4AF37] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="px-5 md:px-10 py-10 max-w-6xl mx-auto">
          <div className="flex border-b border-[#2A3040] mb-8 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                data-testid={`admin-tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`px-6 py-4 -mb-px font-mono text-[11px] uppercase tracking-[0.3em] border-b-2 transition-colors whitespace-nowrap ${
                  tab === t.id
                    ? "text-[#D4AF37] border-[#D4AF37]"
                    : "text-[#6E7585] border-transparent hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <StatCard icon={Users} label="Newsletter Subscribers" value={subscribers.length} />
            <StatCard icon={MessageSquare} label="Contact Messages" value={messages.length} />
          </div>

          {tab === "roster" && (
            <section data-testid="admin-roster-tab">
              <Panel title="Newsletter Roster" endpoint="GET /api/admin/newsletter">
                {loading ? (
                  <div className="text-[#6E7585] text-sm py-6">Loading...</div>
                ) : subscribers.length === 0 ? (
                  <div className="text-[#6E7585] text-sm py-6">No subscribers yet.</div>
                ) : (
                  <div className="max-h-[480px] overflow-y-auto -mx-6">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-[#11141C]">
                        <tr className="text-left label text-[#6E7585] border-b border-[#1F2330]">
                          <th className="px-6 py-3 font-normal">#</th>
                          <th className="px-6 py-3 font-normal">Email</th>
                          <th className="px-6 py-3 font-normal">Signed Up</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((s, i) => (
                          <tr key={s.id} className="border-b border-[#1F2330]/60 hover:bg-[#181C26]/60">
                            <td className="px-6 py-3 text-[#6E7585] font-mono text-xs">
                              {String(i + 1).padStart(3, "0")}
                            </td>
                            <td className="px-6 py-3 font-mono">
                              <span className="inline-flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-[#6E7585]" />
                                {s.email}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-[#A0A6B5] font-mono text-xs">
                              {new Date(s.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>
            </section>
          )}

          {tab === "broadcast" && (
            <section data-testid="admin-broadcast-tab" className="grid lg:grid-cols-2 gap-6">
              <Panel title="Compose Broadcast" endpoint="POST /api/admin/newsletter/send">
                <form onSubmit={submitBlast} className="space-y-5">
                  <div>
                    <label className="label text-[#6E7585] block mb-2">Subject Line</label>
                    <input
                      data-testid="admin-blast-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      placeholder="AEGIS // FIELD UPDATE"
                      className="w-full bg-[#06080C] border border-[#2A3040] focus:border-[#D4AF37] outline-none px-4 py-3 font-mono text-sm tracking-wider uppercase placeholder:text-[#6E7585]"
                    />
                  </div>
                  <div>
                    <label className="label text-[#6E7585] block mb-2">Body (HTML)</label>
                    <textarea
                      data-testid="admin-blast-body"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      required
                      rows={9}
                      placeholder="<h2>Strength in Order</h2><p>Hold the line.</p>"
                      className="w-full bg-[#06080C] border border-[#2A3040] focus:border-[#D4AF37] outline-none px-4 py-3 font-mono text-xs leading-relaxed placeholder:text-[#6E7585]"
                    />
                  </div>
                  <button
                    data-testid="admin-blast-submit"
                    disabled={sending || subscribers.length === 0}
                    className="w-full flex items-center justify-center gap-2 border-2 border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-black disabled:opacity-50 text-[#D4AF37] px-5 py-4 font-mono uppercase tracking-[0.3em] text-[12px] font-semibold transition-colors"
                  >
                    {sending ? (
                      "Sending..."
                    ) : (
                      <>
                        Transmit to {subscribers.length} Subscribers <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                  <p className="label text-[#6E7585] text-[9px] leading-relaxed border-l-2 border-[#2A3040] pl-4">
                    Sent via Resend with an AEGIS letterhead and a per-subscriber unsubscribe link
                    added automatically.
                  </p>
                </form>
              </Panel>

              <Panel title="Live Preview" endpoint="Rendered HTML">
                <div
                  data-testid="admin-blast-preview"
                  className="bg-[#F8F5EC] text-[#1A1A1A] min-h-[280px] p-6 font-serif leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: body || "<em style='color:#998'>Broadcast preview renders here…</em>",
                  }}
                />
              </Panel>
            </section>
          )}

          {tab === "messages" && (
            <section data-testid="admin-messages-tab">
              <Panel title="Contact Form Messages" endpoint="GET /api/admin/contacts">
                {loading ? (
                  <div className="text-[#6E7585] text-sm py-6">Loading...</div>
                ) : messages.length === 0 ? (
                  <div className="text-[#6E7585] text-sm py-6">No messages yet.</div>
                ) : (
                  <div className="divide-y divide-[#1F2330]/60 max-h-[520px] overflow-y-auto -mx-6 -mb-6">
                    {messages.map((m) => (
                      <div key={m.id} className="px-6 py-4">
                        <div className="flex justify-between items-baseline gap-3 mb-1">
                          <div className="text-white text-sm font-medium">{m.full_name}</div>
                          <div className="text-[#6E7585] font-mono text-[10px]">
                            {new Date(m.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-[#A0A6B5] text-xs mb-2">
                          {m.email}
                          {m.subject ? ` · ${m.subject}` : ""}
                        </div>
                        <p className="text-[#A0A6B5] text-sm leading-relaxed">{m.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </section>
          )}
        </main>
      </div>
    </AdminShell>
  );
}
