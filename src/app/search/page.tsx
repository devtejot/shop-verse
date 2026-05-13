"use client";
import { Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useSearch } from "@/hooks/useSearch";
import { ProductGrid } from "@/components/products/ProductGrid";
import { applyFilters } from "@/lib/api";
import { ProductFilters } from "@/types/product";
import { Search, Zap } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const { data, isLoading } = useProducts();
  const { addSearch } = useSearch();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || undefined;
  const minPrice = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice")!)
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice")!)
    : undefined;
  const sortBy =
    (searchParams.get("sortBy") as ProductFilters["sortBy"]) || undefined;

  useEffect(() => {
    if (q) addSearch(q);
  }, [q, addSearch]);

  const results = useMemo(() => {
    if (!data?.products) return [];
    const filters: ProductFilters = {
      search: q,
      category,
      minPrice,
      maxPrice,
      sortBy,
    };
    return applyFilters(data.products, filters);
  }, [data, q, category, minPrice, maxPrice, sortBy]);

  const hasSmartFilters = category || minPrice || maxPrice || sortBy;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-5 h-5 text-gray-400" />
          <h1 className="text-xl font-bold text-gray-900">
            {q ? `Results for "${q}"` : "Search Results"}
          </h1>
        </div>

        {hasSmartFilters && (
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
              <Zap className="w-3.5 h-3.5" />
              Smart filters applied:
            </div>
            {category && (
              <span className="badge bg-gray-100 text-gray-700 capitalize">
                {category.replace(/-/g, " ")}
              </span>
            )}
            {maxPrice && (
              <span className="badge bg-gray-100 text-gray-700">
                Under ${maxPrice}
              </span>
            )}
            {minPrice && (
              <span className="badge bg-gray-100 text-gray-700">
                Over ${minPrice}
              </span>
            )}
            {sortBy && (
              <span className="badge bg-gray-100 text-gray-700 capitalize">
                {sortBy.replace(/-/g, " ")}
              </span>
            )}
          </div>
        )}
      </div>

      <ProductGrid
        products={results}
        isLoading={isLoading}
        total={data?.total}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto sm:px-6 px-4 py-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
