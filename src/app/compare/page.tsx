"use client";
import { useCompareStore } from "@/stores/compareStore";
import { useCartStore } from "@/stores/cartStore";
import { getProductSpecs } from "@/lib/mockSpecs";
import { StarRating } from "@/components/ui/StarRating";
import { GitCompare, X, ShoppingCart, Plus, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ComparePage() {
  const { items, removeItem, clearAll } = useCompareStore();
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <GitCompare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          Nothing to compare
        </h1>
        <p className="text-gray-400 mb-6">
          Add up to 3 products using the Compare button on any product
        </p>
        <Link
          href="/products"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add products
        </Link>
      </div>
    );
  }

  // Build unified spec keys across all products
  const allSpecs = items.map((p) =>
    getProductSpecs(p.id, p.category, p.price, p.brand),
  );
  const specLabels = Array.from(
    new Set(allSpecs.flatMap((specs) => specs.map((s) => s.label))),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <GitCompare className="w-6 h-6 text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">Compare Products</h1>
        <span className="badge bg-gray-100 text-gray-700">
          {items.length} products
        </span>
        <button
          onClick={clearAll}
          className="ml-auto text-sm text-red-400 hover:text-red-600 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] table-fixed">
          {/* Product headers */}
          <thead>
            <tr>
              <th className="text-left py-3 pr-4 w-36 text-sm font-semibold text-gray-500">
                Product
              </th>
              {items.map((product) => (
                <th
                  key={product.id}
                  className="pb-4 px-3 align-top"
                  style={{ width: `${100 / (items.length || 1)}%` }}
                >
                  <div className="bg-white rounded-xl border border-gray-200 p-4 relative">
                    <button
                      onClick={() => removeItem(product.id)}
                      className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <Link href={`/products/${product.id}`}>
                      <div className="relative w-24 h-24 mx-auto mb-3">
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          className="object-contain"
                          sizes="96px"
                        />
                      </div>
                      <p className="text-xs text-stone-500 font-medium mb-0.5">
                        {product.brand}
                      </p>
                      <p className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                        {product.title}
                      </p>
                    </Link>
                    <div className="flex justify-center mt-1">
                      <StarRating rating={product.rating} size="sm" />
                    </div>
                    <p className="font-bold text-lg text-gray-900 mt-2">
                      $
                      {(
                        product.price *
                        (1 - product.discountPercentage / 100)
                      ).toFixed(2)}
                    </p>
                    <button
                      onClick={() => {
                        addToCart(product);
                        openCart();
                      }}
                      className="btn-primary w-full flex items-center justify-center gap-1.5 py-2 text-sm mt-3"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Fixed attributes */}
            {[
              {
                label: "Price",
                render: (p: (typeof items)[0]) =>
                  `$${(p.price * (1 - p.discountPercentage / 100)).toFixed(2)}`,
              },
              {
                label: "Original Price",
                render: (p: (typeof items)[0]) => `$${p.price.toFixed(2)}`,
              },
              {
                label: "Discount",
                render: (p: (typeof items)[0]) =>
                  `${Math.round(p.discountPercentage)}%`,
              },
              {
                label: "Rating",
                render: (p: (typeof items)[0]) => `${p.rating.toFixed(1)} / 5`,
              },
              {
                label: "Stock",
                render: (p: (typeof items)[0]) => `${p.stock} units`,
              },
              {
                label: "Category",
                render: (p: (typeof items)[0]) => p.category.replace(/-/g, " "),
              },
            ].map(({ label, render }) => (
              <tr key={label} className="border-t border-gray-100">
                <td className="py-3 pr-4 text-sm font-medium text-gray-500">
                  {label}
                </td>
                {items.map((product) => (
                  <td
                    key={product.id}
                    className="py-3 px-3 text-center text-sm text-gray-800"
                    style={{ width: `${100 / (items.length || 1)}%` }}
                  >
                    {render(product)}
                  </td>
                ))}
              </tr>
            ))}

            {/* Dynamic specs with diff highlighting */}
            <tr>
              <td colSpan={items.length + 1} className="py-3 pt-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Technical Specifications
                </p>
              </td>
            </tr>

            {specLabels.map((label) => {
              const rowValues = items.map((p, i) => {
                const spec = allSpecs[i].find((s) => s.label === label);
                return spec
                  ? `${spec.value}${spec.unit ? ` ${spec.unit}` : ""}`
                  : null;
              });

              return (
                <tr key={label} className="border-t border-gray-100">
                  <td className="py-3 pr-4 text-sm font-medium text-gray-500">
                    {label}
                  </td>
                  {items.map((product, i) => {
                    const val = rowValues[i];
                    return (
                      <td
                        key={product.id}
                        className="py-3 px-3 text-center text-sm"
                      >
                        {val || <span className="text-gray-300">—</span>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
