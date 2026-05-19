"use client";
import { getStockLevel } from "@/lib/mockData";
import { Product } from "@/types/product";
import { Package, AlertTriangle, Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface LiveSignalsProps {
  product: Product;
}

function useLiveViewers(productId: number) {
  // Deterministic base so SSR/hydration match, then jitter client-side
  const base = 3 + (productId % 29);
  const [viewers, setViewers] = useState(base);

  useEffect(() => {
    // Initial jitter after mount to avoid hydration mismatch
    setViewers(base + Math.floor(Math.random() * 8));

    const interval = setInterval(() => {
      setViewers((v) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(2, v + delta);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [base]);

  return viewers;
}

export function LiveSignals({ product }: LiveSignalsProps) {
  const stock = getStockLevel(product);
  const viewers = useLiveViewers(product.id);

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

      {/* Live viewers */}
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <Eye className="w-3.5 h-3.5" />
        <span>
          <strong className="text-gray-700">{viewers}</strong> viewing now
        </span>
      </div>
    </div>
  );
}
