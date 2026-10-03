import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { FLAVOURS, PACKS } from '../data/flavours';

const CartContext = createContext(null);
const STORAGE_KEY = 'palmo:cart:v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const add = useCallback((flavourId, packId = 'six', qty = 1) => {
    const lineId = `${flavourId}__${packId}`;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === lineId);
      if (existing) {
        return prev.map((item) =>
          item.id === lineId ? { ...item, qty: Math.min(item.qty + qty, 99) } : item
        );
      }
      return [{ id: lineId, flavourId, packId, qty: Math.min(qty, 99) }, ...prev];
    });

    setLastAdded({ id: lineId, at: Date.now() });
    setTimeout(() => {
      setLastAdded(null);
    }, 1500);
  }, []);

  const setQty = useCallback((lineId, qty) => {
    if (qty < 1) {
      setItems((prev) => prev.filter((item) => item.id !== lineId));
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === lineId ? { ...item, qty: Math.min(qty, 99) } : item
        )
      );
    }
  }, []);

  const remove = useCallback((lineId) => {
    setItems((prev) => prev.filter((item) => item.id !== lineId));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const lines = useMemo(() => {
    return items
      .map((item) => {
        const flavour = FLAVOURS.find((f) => f.id === item.flavourId);
        const pack = PACKS.find((p) => p.id === item.packId);
        if (!flavour || !pack) return null;
        const unitPrice = pack.price;
        const total = Math.round(unitPrice * item.qty * 100) / 100;
        return {
          ...item,
          flavour,
          pack,
          unitPrice,
          total,
        };
      })
      .filter(Boolean);
  }, [items]);

  const count = useMemo(() => lines.reduce((acc, l) => acc + l.qty, 0), [lines]);
  const cans = useMemo(() => lines.reduce((acc, l) => acc + l.pack.cans * l.qty, 0), [lines]);
  const subtotal = useMemo(
    () => Math.round(lines.reduce((acc, l) => acc + l.total, 0) * 100) / 100,
    [lines]
  );
  const shipping = subtotal === 0 || subtotal >= 45 ? 0 : 5.9;
  const total = Math.round((subtotal + shipping) * 100) / 100;
  const freeShippingGap = Math.max(0, Math.round((45 - subtotal) * 100) / 100);
  const freeShippingProgress = Math.min(1, subtotal / 45);

  const value = {
    lines,
    count,
    cans,
    subtotal,
    shipping,
    total,
    freeShippingGap,
    freeShippingProgress,
    isOpen,
    lastAdded,
    checkoutModalOpen,
    setCheckoutModalOpen,
    add,
    setQty,
    remove,
    clear,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen((prev) => !prev),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
