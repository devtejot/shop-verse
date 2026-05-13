export const MOCK_BRANDS = [
  "Apple",
  "Samsung",
  "Sony",
  "LG",
  "Dell",
  "HP",
  "Lenovo",
  "Asus",
  "Acer",
  "Microsoft",
  "OnePlus",
  "Xiaomi",
  "Huawei",
];

export const FEATURED_CATEGORIES = [
  {
    name: "Mobile",
    slug: "smartphones",
    emoji: "📱",
    description: "Phones & accessories",
  },
  {
    name: "Tablets",
    slug: "tablets",
    emoji: "📲",
    description: "Work and play",
  },
  {
    name: "Beauty",
    slug: "beauty",
    emoji: "💄",
    description: "Skincare & makeup",
  },
  {
    name: "Cars",
    slug: "automotive",
    emoji: "🚗",
    description: "Auto essentials",
  },
  {
    name: "Bikes",
    slug: "motorcycle",
    emoji: "🏍️",
    description: "Ride gear",
  },
  {
    name: "Home",
    slug: "home-decoration",
    emoji: "🏡",
    description: "Comfort at home",
  },
];

export const USE_CASE_PRODUCTS: Record<string, string[]> = {
  home: ["furniture", "home-decoration", "kitchen-accessories"],
  style: ["womens-dresses", "mens-shirts", "womens-bags"],
  beauty: ["beauty", "skin-care", "fragrances"],
  outdoors: ["sports-accessories", "sunglasses", "vehicle"],
};

export function getStockLevel(product: { id: number; stock: number }): {
  count: number;
  label: string;
  urgency: "low" | "medium" | "high";
} {
  const count = product.stock;
  if (count <= 5)
    return { count, label: `Only ${count} left!`, urgency: "high" };
  if (count <= 15)
    return { count, label: `${count} left in stock`, urgency: "medium" };
  return { count, label: "In stock", urgency: "low" };
}
