"use client";
import { useCompareStore } from "@/stores/compareStore";
import { GitCompare, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CompareBar() {
  const { items, removeItem, clearAll } = useCompareStore();

  return items.length >= 1 ? (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-700">
          <GitCompare className="w-5 h-5" />
          <span className="font-semibold text-sm hidden sm:inline">
            Compare
          </span>
          <span className="badge bg-gray-100 text-gray-700">
            {items.length}/3
          </span>
        </div>

        {/* Items */}
        <div className="flex items-center gap-3 flex-1 overflow-x-auto">
          {items.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 flex-shrink-0"
            >
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                {product.title}
              </span>
              <button
                onClick={() => removeItem(product.id)}
                className="p-0.5 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
              >
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          ))}

          {/* Placeholder slots */}
          {Array.from({ length: 3 - items.length }).map((_, i) => (
            <div
              key={`slot-${i}`}
              className="w-28 h-10 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <span className="text-xs text-gray-400">Add product</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear
          </button>
          {items.length >= 2 && (
            <Link
              href="/compare"
              className="btn-primary flex items-center gap-1.5 py-2 text-sm"
            >
              Compare
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  ) : null;
}
