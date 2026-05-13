import { Product, ProductsResponse, ProductFilters } from "@/types/product";

const BASE = "https://dummyjson.com";

export async function fetchProducts(
  limit = 100,
  skip = 0,
): Promise<ProductsResponse> {
  const res = await fetch(`${BASE}/products?limit=${limit}&skip=${skip}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function fetchProductsByCategory(
  category: string,
): Promise<ProductsResponse> {
  const res = await fetch(`${BASE}/products/category/${category}?limit=50`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
  const res = await fetch(
    `${BASE}/products/search?q=${encodeURIComponent(query)}&limit=50`,
  );
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${BASE}/products/categories`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.map((c: { name: string; slug: string }) => c.slug);
}

export function personalizedSort(
  products: Product[],
  recentlyViewed: number[],
  allProducts: Product[],
): Product[] {
  if (recentlyViewed.length === 0) return products;

  const productMap = new Map<number, Product>(
    allProducts.map((p) => [p.id, p]),
  );
  const viewedCategories = recentlyViewed
    .map((id) => productMap.get(id)?.category)
    .filter(Boolean) as string[];

  if (viewedCategories.length === 0) return products;

  const categoryCounts = viewedCategories.reduce<Record<string, number>>(
    (acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    },
    {},
  );

  return [...products].sort((a, b) => {
    const scoreA = categoryCounts[a.category] || 0;
    const scoreB = categoryCounts[b.category] || 0;
    return scoreB - scoreA;
  });
}

export function applyFilters(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  let result = [...products];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }
  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.brand) {
    result = result.filter(
      (p) => p.brand?.toLowerCase() === filters.brand!.toLowerCase(),
    );
  }
  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.minRating !== undefined) {
    result = result.filter((p) => p.rating >= filters.minRating!);
  }

  switch (filters.sortBy) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "discount":
      result.sort((a, b) => b.discountPercentage - a.discountPercentage);
      break;
  }

  return result;
}
