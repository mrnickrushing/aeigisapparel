import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQty,
    subtotal,
    drawerOpen,
    setDrawerOpen,
    count,
  } = useCart();
  const navigate = useNavigate();

  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 7.99;
  const total = subtotal + shipping;

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent
        data-testid="cart-drawer"
        className="bg-[#06080C] border-l border-[#1F2330] text-white w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-5 border-b border-[#1F2330] flex flex-row items-center justify-between">
          <SheetTitle className="font-display text-2xl uppercase tracking-[0.1em] text-white">
            Loadout <span className="text-[#D4AF37]">/ {count}</span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Your cart with selected gear ready for checkout
          </SheetDescription>
          <button
            data-testid="cart-drawer-close"
            onClick={() => setDrawerOpen(false)}
            className="border border-[#1F2330] hover:border-[#D4AF37] p-2"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div
              data-testid="cart-empty-state"
              className="flex flex-col items-center justify-center h-full text-center py-16"
            >
              <ShoppingBag className="w-12 h-12 text-[#2A3040] mb-4" />
              <div className="font-display text-2xl uppercase tracking-[0.1em]">Empty rack</div>
              <p className="text-[#A0A6B5] text-sm mt-2 max-w-xs">
                No gear staged. Build your loadout in the Core Division.
              </p>
              <button
                data-testid="cart-empty-shop-btn"
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/core");
                }}
                className="mt-6 bg-[#D4AF37] hover:bg-[#E6C454] text-black px-6 py-3 font-mono uppercase text-xs tracking-[0.3em] font-bold"
              >
                Enter Core
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#1F2330]">
              {items.map((it) => (
                <li
                  data-testid={`cart-item-${it._key}`}
                  key={it._key}
                  className="py-4 flex gap-3"
                >
                  <div
                    className="w-20 h-20 shrink-0 border border-[#1F2330] bg-[#11141C] relative"
                    style={{
                      background: `radial-gradient(circle, ${it.accent || "#D4AF37"}33 0%, #06080C 70%)`,
                    }}
                  >
                    <img
                      src={it.image}
                      alt={it.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm uppercase tracking-[0.05em] truncate">
                      {it.name}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#A0A6B5] mt-1">
                      {it.size && <span>{it.size}</span>}
                      {it.color && <span> · {it.color}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#1F2330]">
                        <button
                          data-testid={`cart-qty-minus-${it._key}`}
                          onClick={() => updateQty(it._key, it.quantity - 1)}
                          className="p-1.5 hover:bg-[#11141C]"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs px-3">{it.quantity}</span>
                        <button
                          data-testid={`cart-qty-plus-${it._key}`}
                          onClick={() => updateQty(it._key, it.quantity + 1)}
                          className="p-1.5 hover:bg-[#11141C]"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="font-mono text-sm">
                        ${(it.price * it.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <button
                    data-testid={`cart-remove-${it._key}`}
                    onClick={() => removeItem(it._key)}
                    className="self-start text-[#A0A6B5] hover:text-[#D4AF37]"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#1F2330] p-6 space-y-3 bg-[#06080C]">
            <div className="flex justify-between text-sm text-[#A0A6B5]">
              <span>Subtotal</span>
              <span data-testid="cart-subtotal" className="font-mono text-white">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-[#A0A6B5]">
              <span>Shipping</span>
              <span className="font-mono text-white">
                {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#1F2330] pt-3">
              <span className="font-display uppercase text-lg tracking-[0.1em]">Total</span>
              <span
                data-testid="cart-total"
                className="font-mono text-lg font-bold"
              >
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              data-testid="cart-checkout-btn"
              onClick={() => {
                setDrawerOpen(false);
                navigate("/checkout");
              }}
              className="w-full bg-[#D4AF37] hover:bg-[#E6C454] text-black py-4 font-mono uppercase tracking-[0.3em] text-sm font-bold"
            >
              Checkout →
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
