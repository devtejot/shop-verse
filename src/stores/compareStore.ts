"use client";
import { create } from "zustand";
import { Product } from "@/types/product";

const MAX_COMPARE = 3;

interface CompareStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  clearAll: () => void;
  isInCompare: (productId: number) => boolean;
  isFull: () => boolean;
}

export const useCompareStore = create<CompareStore>()((set, get) => ({
  items: [],

  addItem: (product) => {
    const { items } = get();
    if (items.length >= MAX_COMPARE) return;
    if (items.find((i) => i.id === product.id)) return;
    set({ items: [...items, product] });
  },

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== productId),
    })),

  clearAll: () => set({ items: [] }),

  isInCompare: (productId) => get().items.some((i) => i.id === productId),

  isFull: () => get().items.length >= MAX_COMPARE,
}));
