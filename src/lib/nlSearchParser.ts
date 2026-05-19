import { ProductFilters } from "@/types/product";

interface ParsedQuery {
  filters: ProductFilters;
  cleanQuery: string;
}

const CATEGORY_ALIASES: Record<string, string> = {
  phone: "smartphones",
  phones: "smartphones",
  smartphone: "smartphones",
  mobile: "smartphones",
  tablet: "tablets",
  laptop: "laptops",
  laptops: "laptops",
  beauty: "beauty",
  makeup: "beauty",
  skincare: "skin-care",
  "skin care": "skin-care",
  fragrance: "fragrances",
  perfume: "fragrances",
  furniture: "furniture",
  "home decor": "home-decoration",
  decor: "home-decoration",
  watch: "mens-watches",
  watches: "mens-watches",
  sunglasses: "sunglasses",
  shoes: "womens-shoes",
  bag: "womens-bags",
  bags: "womens-bags",
  shirt: "mens-shirts",
  shirts: "mens-shirts",
  dress: "womens-dresses",
  dresses: "womens-dresses",
  grocery: "groceries",
  groceries: "groceries",
  motorcycle: "motorcycle",
  bike: "motorcycle",
  car: "automotive",
  automotive: "automotive",
  sports: "sports-accessories",
  sport: "sports-accessories",
  jewellery: "womens-jewellery",
  jewelry: "womens-jewellery",
};

const SORT_PATTERNS: Array<{ pattern: RegExp; sortBy: ProductFilters["sortBy"] }> = [
  { pattern: /\b(cheapest|lowest price|price asc|cheap first)\b/i, sortBy: "price-asc" },
  { pattern: /\b(most expensive|highest price|price desc)\b/i, sortBy: "price-desc" },
  { pattern: /\b(best rated|top rated|highest rated|best reviews?)\b/i, sortBy: "rating" },
  { pattern: /\b(biggest discount|most discount|on sale|best deal)\b/i, sortBy: "discount" },
  { pattern: /\b(a-z|alphabetical)\b/i, sortBy: "name" },
];

export function parseNLSearch(query: string): ParsedQuery {
  const lower = query.toLowerCase().trim();
  const filters: ProductFilters = {};
  let clean = lower;

  // Price: "under $50", "below 100", "less than $200", "over $30", "above 50", "between $20 and $100"
  const betweenMatch = clean.match(/between\s+\$?(\d+)\s+and\s+\$?(\d+)/i);
  if (betweenMatch) {
    filters.minPrice = parseInt(betweenMatch[1]);
    filters.maxPrice = parseInt(betweenMatch[2]);
    clean = clean.replace(betweenMatch[0], "").trim();
  }

  const maxMatch = clean.match(/(?:under|below|less than|max|up to)\s+\$?(\d+)/i);
  if (maxMatch && !filters.maxPrice) {
    filters.maxPrice = parseInt(maxMatch[1]);
    clean = clean.replace(maxMatch[0], "").trim();
  }

  const minMatch = clean.match(/(?:over|above|more than|at least|min)\s+\$?(\d+)/i);
  if (minMatch && !filters.minPrice) {
    filters.minPrice = parseInt(minMatch[1]);
    clean = clean.replace(minMatch[0], "").trim();
  }

  // Sort
  for (const { pattern, sortBy } of SORT_PATTERNS) {
    if (pattern.test(clean)) {
      filters.sortBy = sortBy;
      clean = clean.replace(pattern, "").trim();
      break;
    }
  }

  // Category — try multi-word aliases first, then single word
  const sortedAliases = Object.keys(CATEGORY_ALIASES).sort((a, b) => b.length - a.length);
  for (const alias of sortedAliases) {
    if (clean.includes(alias)) {
      filters.category = CATEGORY_ALIASES[alias];
      clean = clean.replace(alias, "").trim();
      break;
    }
  }

  // Clean up stray punctuation/extra spaces
  const cleanQuery = clean.replace(/\s+/g, " ").trim();

  return { filters, cleanQuery };
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
