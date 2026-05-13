export type ShoppingFor = "myself" | "gift" | "work" | "family";
export type BudgetRange = "budget" | "mid" | "premium" | "any";
export type PrimaryUse = "home" | "style" | "beauty" | "outdoors";

export interface UserPrefs {
  quizCompleted: boolean;
  shoppingFor: ShoppingFor | null;
  budget: BudgetRange | null;
  primaryUse: PrimaryUse | null;
  recentlyViewed: number[];
}
