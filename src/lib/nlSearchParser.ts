import { ProductFilters } from "@/types/product";

interface ParsedQuery {
  filters: ProductFilters;
  cleanQuery: string;
}

export function parseNLSearch(query: string): ParsedQuery {
  return { filters: {}, cleanQuery: query.trim() };
}

export const TRENDING_SEARCHES = [
  "running shoes",
  "summer dress",
  "skin care",
  "kitchen organizer",
  "office chair",
  "grocery snacks",
  "fragrance",
  "home decor",
  "smartwatch",
  "travel backpack",
];

export const SEARCH_CATEGORIES = [
  { label: "Mobile", value: "smartphones", icon: "📱" },
  { label: "Tablets", value: "tablets", icon: "📲" },
  { label: "Beauty", value: "beauty", icon: "💄" },
  { label: "Cars", value: "automotive", icon: "🚗" },
  { label: "Bikes", value: "motorcycle", icon: "🏍️" },
  { label: "Home", value: "home-decoration", icon: "🏡" },
];
