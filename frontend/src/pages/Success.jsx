import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { getCheckoutStatus } from "../lib/api";
import { useCart } from "../context/CartContext";

export default function Success() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const isManual = params.get("manual") === "1";
  const orderIdParam = params.get("order_id");
  const [state, setState] = useState(isManual ? "paid" : "polling");
  const [data, setData] = useState(null);
  const { clear } = useCart();
  const polledRef = useRef(0);
  const cartClearedRef = useRef(false);

  useEffect(() => {
    if (isManual) return;
    if (!sessionId) {
      setState("error");
      return;
    }
    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      if (polledRef.current >= 8) {
        setState("timeout");
        return;
      }
      polledRef.current += 1;
      try {
        const res = await getCheckoutStatus(sessionId);
        setData(res);
        if (res.payment_status === "paid") {
          setState("paid");
          if (!cartClearedRef.current) {
            cartClearedRef.current = true;
            clear();
          }
          return;
        }
        if (res.status === "expired") {
          setState("expired");
          return;
        }
        setTimeout(poll, 2000);
      } catch (e) {
        setState("error");
      }
    };
    poll();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, isManual]);

  return (
    <div className="bg-[#06080C] text-white min-h-screen flex items-center justify-center px-5 py-20">
      <div className="max-w-xl w-full border border-[#1F2330] bg-[#11141C] p-8 md:p-12 corners relative">
        <div className="absolute inset-0 warning-stripes opacity-15 pointer-events-none" />
        <div className="relative z-10 text-center">
          {state === "paid" && (
            <>
              <CheckCircle2 className="w-14 h-14 text-[#D4AF37] mx-auto mb-4" />
              <div className="label mb-3 text-[#D4AF37]">/ Order locked in</div>
              <h1
                data-testid="success-heading"
                className="font-display text-4xl sm:text-5xl uppercase tracking-[0.05em] mb-3"
              >
                {isManual ? "Reservation Received" : "Mission Complete"}
              </h1>
              <p className="text-[#A0A6B5] mb-6">
                {isManual
                  ? "Your order has been reserved. We'll reach out to confirm payment and shipping."
                  : "Your gear is staged. Confirmation email incoming. We'll send tracking when we ship."}
              </p>
              {data?.order?.id && (
                <div className="font-mono text-xs uppercase tracking-widest text-[#A0A6B5] mb-6">
                  Order # <span className="text-white">{data.order.id.slice(0, 8).toUpperCase()}</span>
                </div>
              )}
              {isManual && orderIdParam && (
                <div className="font-mono text-xs uppercase tracking-widest text-[#A0A6B5] mb-6">
                  Order # <span className="text-white">{orderIdParam.slice(0, 8).toUpperCase()}</span>
                </div>
              )}
            </>
          )}

          {state === "polling" && (
            <>
              <Clock className="w-14 h-14 text-[#D4AF37] mx-auto mb-4 animate-spin" />
              <div className="label mb-3 text-[#D4AF37]">/ Verifying</div>
              <h1 className="font-display text-4xl uppercase tracking-[0.05em] mb-3">Confirming...</h1>
              <p className="text-[#A0A6B5]">Verifying your payment with Stripe.</p>
            </>
          )}

          {(state === "expired" || state === "timeout" || state === "error") && (
            <>
              <XCircle className="w-14 h-14 text-[#D4AF37] mx-auto mb-4" />
              <div className="label mb-3 text-[#D4AF37]">/ Session issue</div>
              <h1 className="font-display text-4xl uppercase tracking-[0.05em] mb-3">
                Something went sideways
              </h1>
              <p className="text-[#A0A6B5] mb-6">
                {state === "expired"
                  ? "Checkout session expired. Try again."
                  : state === "timeout"
                  ? "Status check timed out. Check your email."
                  : "We couldn't verify your payment. If you were charged, contact support."}
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              data-testid="success-shop-btn"
              to="/core"
              className="bg-[#D4AF37] hover:bg-[#E6C454] text-black px-6 py-3 font-mono uppercase tracking-[0.3em] text-xs font-bold"
            >
              Continue Shopping
            </Link>
            <Link
              to="/home"
              className="border border-[#A0A6B5] hover:border-white px-6 py-3 font-mono uppercase tracking-[0.3em] text-xs"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
