"use client";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { LayoutGrid, List, PackageSearch, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const PAGE_SIZE = 12;

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  total?: number;
}

export function ProductGrid({ products, isLoading, total }: ProductGridProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  // Reset to page 1 when products list changes (filter/search)
  useEffect(() => { setPage(1); }, [products]);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <PackageSearch className="w-14 h-14 text-gray-200 mb-4" />
        <h3 className="font-semibold text-gray-600 text-lg">
          No products found
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-900">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, products.length)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-900">{products.length}</span>{" "}
          products
        </p>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        key={view}
        className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            : "flex flex-col gap-3"
        }
      >
        {paginated.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} variant={view} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Page <span className="font-medium text-gray-900">{page}</span> of{" "}
            <span className="font-medium text-gray-900">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={page === 1}
              aria-label="Previous page"
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => { setPage(p as number); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === p
                        ? "bg-gray-900 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={page === totalPages}
              aria-label="Next page"
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
