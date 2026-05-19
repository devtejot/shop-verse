"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            const newQty = Math.min(existing.quantity + quantity, product.stock);
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: newQty } : i,
              ),
            };
          }
          const clampedQty = Math.min(quantity, product.stock);
          return { items: [...state.items, { product, quantity: clampedQty }] };
        });
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => {
            if (i.product.id !== productId) return i;
            return { ...i, quantity: Math.min(quantity, i.product.stock) };
          }),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce(
          (sum, i) =>
            sum +
            i.product.price *
              (1 - i.product.discountPercentage / 100) *
              i.quantity,
          0,
        ),
    }),
    { name: "shopverse-cart" },
  ),
);
