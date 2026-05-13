"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

interface WishlistItem {
  product: Product;
  addedAt: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (get().isWishlisted(product.id)) return;
        set((state) => ({
          items: [
            ...state.items,
            {
              product,
              addedAt: new Date().toISOString(),
            },
          ],
        }));
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      isWishlisted: (productId) =>
        get().items.some((i) => i.product.id === productId),
    }),
    { name: "shopverse-wishlist" },
  ),
);
