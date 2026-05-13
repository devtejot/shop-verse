"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  UserPrefs,
  ShoppingFor,
  BudgetRange,
  PrimaryUse,
} from "@/types/userPrefs";

interface UserPrefsStore extends UserPrefs {
  completeQuiz: (prefs: {
    shoppingFor: ShoppingFor;
    budget: BudgetRange;
    primaryUse: PrimaryUse;
  }) => void;
  skipQuiz: () => void;
  resetQuiz: () => void;
  addRecentlyViewed: (productId: number) => void;
  getBudgetRange: () => { min: number; max: number } | null;
}

const BUDGET_MAP: Record<BudgetRange, { min: number; max: number }> = {
  budget: { min: 0, max: 300 },
  mid: { min: 300, max: 800 },
  premium: { min: 800, max: 99999 },
  any: { min: 0, max: 99999 },
};

export const useUserPrefsStore = create<UserPrefsStore>()(
  persist(
    (set, get) => ({
      quizCompleted: false,
      shoppingFor: null,
      budget: null,
      primaryUse: null,
      recentlyViewed: [],

      completeQuiz: ({ shoppingFor, budget, primaryUse }) =>
        set({ quizCompleted: true, shoppingFor, budget, primaryUse }),

      skipQuiz: () => set({ quizCompleted: true }),

      resetQuiz: () =>
        set({
          quizCompleted: false,
          shoppingFor: null,
          budget: null,
          primaryUse: null,
        }),

      addRecentlyViewed: (productId) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter(
            (id) => id !== productId,
          );
          return { recentlyViewed: [productId, ...filtered].slice(0, 12) };
        }),

      getBudgetRange: () => {
        const { budget } = get();
        return budget ? BUDGET_MAP[budget] : null;
      },
    }),
    { name: "shopverse-prefs" },
  ),
);
