import React, { useState } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { sendContact } from "../lib/api";

export default function Contact() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.message) {
      toast.error("Fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await sendContact(form);
      toast.success("Transmission received. We'll reply soon.");
      setForm({ full_name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Could not send. Try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-[#06080C] text-white min-h-screen">
      <section className="border-b border-[#1F2330] relative overflow-hidden">
        <div className="absolute inset-0 warning-stripes opacity-15" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-16">
          <div className="label mb-2">/ Establish Comms</div>
          <h1
            data-testid="contact-heading"
            className="font-display text-5xl sm:text-7xl uppercase tracking-[0.05em] etched-steel leading-none"
          >
            Contact
          </h1>
          <p className="text-[#A0A6B5] mt-4 max-w-2xl">
            Bulk / unit orders, partnership requests, press inquiries, or
            general questions. Send a transmission.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 md:px-10 py-16">
        <div className="border border-[#1F2330] bg-[#0A0D14] p-6 md:p-10 corners relative">
          <div className="absolute inset-0 warning-stripes opacity-10 pointer-events-none" />
          <form
            data-testid="contact-form"
            onSubmit={submit}
            className="relative grid sm:grid-cols-2 gap-4"
          >
            <Field label="Full name" required>
              <input
                data-testid="contact-name"
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className={inputCls}
                placeholder="Sgt. J. Smith"
              />
            </Field>
            <Field label="Email" required>
              <input
                data-testid="contact-email"
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls}
                placeholder="you@dept.gov"
              />
            </Field>
            <Field label="Subject" className="sm:col-span-2">
              <input
                data-testid="contact-subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className={inputCls}
                placeholder="Unit bulk order / Press / Partnership"
              />
            </Field>
            <Field label="Message" className="sm:col-span-2" required>
              <textarea
                data-testid="contact-message"
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputCls} resize-none`}
                placeholder="Brief us. Who, what, where."
              />
            </Field>
            <div className="sm:col-span-2">
              <button
                data-testid="contact-submit"
                type="submit"
                disabled={submitting}
                className="bg-[#D4AF37] hover:bg-[#E6C454] disabled:opacity-60 text-black px-6 py-3 font-mono uppercase tracking-[0.3em] text-xs font-bold inline-flex items-center gap-2"
              >
                {submitting ? "Sending..." : (
                  <>
                    Send Transmission <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 flex items-center gap-3 text-[#A0A6B5] text-sm">
          <Mail className="w-4 h-4 text-[#D4AF37]" />
          <a
            href="mailto:hello@aegisapparel.com"
            className="font-mono uppercase tracking-widest text-xs"
          >
            hello@aegisapparel.com
          </a>
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
