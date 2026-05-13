"use client";
import { getStockLevel } from "@/lib/mockData";
import { Product } from "@/types/product";
import { Package, AlertTriangle } from "lucide-react";

interface LiveSignalsProps {
  product: Product;
}

export function LiveSignals({ product }: LiveSignalsProps) {
  const stock = getStockLevel(product);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Stock level */}
      <div
        className={`flex items-center gap-1.5 text-sm ${
          stock.urgency === "high"
            ? "text-red-600"
            : stock.urgency === "medium"
              ? "text-orange-600"
              : "text-gray-500"
        }`}
      >
        {stock.urgency === "high" ? (
          <AlertTriangle className="w-4 h-4" />
        ) : (
          <Package className="w-4 h-4" />
        )}
        <span>
          {stock.urgency === "high" ? (
            <strong>{stock.label}</strong>
          ) : (
            stock.label
          )}
        </span>
      </div>
    </div>
  );
}
