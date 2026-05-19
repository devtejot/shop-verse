"use client";
import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { RecentlyViewed } from "@/components/products/RecentlyViewed";
import { Product, ProductFilters as Filters } from "@/types/product";
import { applyFilters, personalizedSort } from "@/lib/api";
import { useUserPrefsStore } from "@/stores/userPrefsStore";

interface ProductsClientProps {
  initialProducts?: Product[];
  initialCategories?: string[];
  initialTotal?: number;
}

function ProductsContent({ initialProducts, initialCategories, initialTotal }: ProductsClientProps) {
  const searchParams = useSearchParams();
  const { data, isLoading: queryLoading } = useProducts();
  const { data: categories } = useCategories();

  // Use server-fetched data until client query resolves
  const products = data?.products || initialProducts || [];
  const allCategories = categories || initialCategories || [];
  const total = data?.total || initialTotal;
  const isLoading = !initialProducts && queryLoading;

  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("q");
    const sortBy = searchParams.get("sortBy") as Filters["sortBy"];
    setFilters({
      ...(category ? { category } : {}),
      ...(search ? { search } : {}),
      ...(sortBy ? { sortBy } : {}),
    });
  }, [searchParams]);

  const { recentlyViewed } = useUserPrefsStore();

  const filtered = useMemo(() => {
    if (!products.length) return [];
    const base = applyFilters(products, filters);
    if (!filters.sortBy && recentlyViewed.length > 0) {
      return personalizedSort(base, recentlyViewed, products);
    }
    return base;
  }, [products, filters, recentlyViewed]);

  const isPersonalized = !filters.sortBy && recentlyViewed.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <RecentlyViewed maxItems={8} noPadding />

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {filters.category
              ? filters.category
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())
              : "All Products"}
          </h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          {isPersonalized
            ? "Showing categories you've browsed first"
            : "Discover popular products across every category"}
        </p>
      </div>

      {/* Mobile filters — full width above grid */}
      <div className="lg:hidden mb-4">
        <ProductFilters
          filters={filters}
          categories={allCategories}
          onFiltersChange={setFilters}
        />
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <ProductFilters
            filters={filters}
            categories={allCategories}
            onFiltersChange={setFilters}
          />
        </aside>

        <div className="flex-1 min-w-0">
          <ProductGrid
            products={filtered}
            isLoading={isLoading}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProductsClient(props: ProductsClientProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 px-4 py-8">
          <p className="text-gray-500">Loading products...</p>
        </div>
      }
    >
      <ProductsContent {...props} />
    </Suspense>
  );
}
