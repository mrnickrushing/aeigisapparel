import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const CartContext = createContext(null);

const CART_KEY = "aegis_cart_v2";
const UNLOCK_KEY = "aegis_legacy_unlocks_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [legacyUnlocks, setLegacyUnlocks] = useState({ ids: [], slugs: [], label: "" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setItems(JSON.parse(saved));
      const u = localStorage.getItem(UNLOCK_KEY);
      if (u) setLegacyUnlocks(JSON.parse(u));
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(UNLOCK_KEY, JSON.stringify(legacyUnlocks));
  }, [legacyUnlocks]);

  const addItem = useCallback((product, { size, color, quantity = 1 }) => {
    setItems((prev) => {
      const key = `${product.id}|${size || ""}|${color || ""}`;
      const idx = prev.findIndex((p) => p._key === key);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [
        ...prev,
        {
          _key: key,
          product_id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: (product.images && product.images[0]) || product.image || "",
          accent: product.accent,
          size,
          color,
          quantity,
        },
      ];
    });
    setDrawerOpen(true);
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((p) => p._key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    setItems((prev) =>
      prev.map((p) => (p._key === key ? { ...p, quantity: Math.max(1, qty) } : p))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const addUnlocks = useCallback((unlock) => {
    setLegacyUnlocks((prev) => {
      const ids = Array.from(new Set([...(prev.ids || []), ...(unlock.unlocked_product_ids || [])]));
      const slugs = Array.from(new Set([...(prev.slugs || []), ...(unlock.unlocked_slugs || [])]));
      return { ids, slugs, label: unlock.label || prev.label };
    });
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clear,
        subtotal,
        count,
        drawerOpen,
        setDrawerOpen,
        legacyUnlocks,
        addUnlocks,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
