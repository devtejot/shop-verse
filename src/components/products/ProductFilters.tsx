"use client";
import { ProductFilters as Filters } from "@/types/product";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface ProductFiltersProps {
  filters: Filters;
  categories: string[];
  onFiltersChange: (filters: Filters) => void;
}

const SORT_OPTIONS = [
  { label: "Relevance", value: undefined },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Best Discount", value: "discount" },
  { label: "Name A-Z", value: "name" },
] as const;

const PRICE_RANGES = [
  { label: "All prices", min: undefined, max: undefined },
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 – $500", min: 100, max: 500 },
  { label: "$500 – $1000", min: 500, max: 1000 },
  { label: "Over $1000", min: 1000, max: undefined },
];

const RATING_OPTIONS = [
  { label: "Any", value: undefined },
  { label: "4★ & up", value: 4 },
  { label: "3★ & up", value: 3 },
];

export function ProductFilters({
  filters,
  categories,
  onFiltersChange,
}: ProductFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount = [
    filters.category,
    filters.minPrice !== undefined || filters.maxPrice !== undefined,
    filters.minRating,
    filters.sortBy,
  ].filter(Boolean).length;

  function resetAll() {
    onFiltersChange({});
  }

  const content = (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Sort by</h3>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  sortBy: opt.value as Filters["sortBy"],
                })
              }
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filters.sortBy === opt.value
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => onFiltersChange({ ...filters, category: undefined })}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
              !filters.category
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onFiltersChange({ ...filters, category: cat })}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors capitalize ${
                filters.category === cat
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Price Range
        </h3>
        <div className="space-y-1">
          {PRICE_RANGES.map((r) => {
            const active =
              filters.minPrice === r.min && filters.maxPrice === r.max;
            return (
              <button
                key={r.label}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    minPrice: r.min,
                    maxPrice: r.max,
                  })
                }
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Rating</h3>
        <div className="space-y-1">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() =>
                onFiltersChange({ ...filters, minRating: opt.value })
              }
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filters.minRating === opt.value
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {activeCount > 0 && (
        <button
          onClick={resetAll}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="badge bg-gray-100 text-gray-700">
              {activeCount}
            </span>
          )}
        </button>

        {mobileOpen && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-lg">
            {content}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-800">Filters</h2>
            {activeCount > 0 && (
              <span className="badge bg-gray-100 text-gray-700">
                {activeCount}
              </span>
            )}
          </div>
        </div>
        {content}
      </div>
    </>
  );
}
