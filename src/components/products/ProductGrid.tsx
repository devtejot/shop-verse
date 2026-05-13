"use client";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { LayoutGrid, List, PackageSearch } from "lucide-react";
import { useState } from "react";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  total?: number;
}

export function ProductGrid({ products, isLoading, total }: ProductGridProps) {
  const [view, setView] = useState<"grid" | "list">("grid");

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
          <span className="font-medium text-gray-900">{products.length}</span>
          {total && total !== products.length && (
            <>
              {" "}
              of <span className="font-medium text-gray-900">{total}</span>
            </>
          )}{" "}
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
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} variant={view} />
          </div>
        ))}
      </div>
    </div>
  );
}
