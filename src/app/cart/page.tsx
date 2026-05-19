"use client";
import { useCartStore } from "@/stores/cartStore";
import { useProducts } from "@/hooks/useProducts";
import { getFrequentlyBoughtTogether } from "@/lib/api";
import { ProductCard } from "@/components/products/ProductCard";
import { useMemo, useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Tag,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
  } = useCartStore();
  const { data } = useProducts();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const fbtProducts = useMemo(
    () =>
      getFrequentlyBoughtTogether(
        items.map((i) => i.product),
        data?.products || [],
      ),
    [items, data],
  );

  const discountedPrice = (price: number, discount: number) =>
    price * (1 - discount / 100);
  const originalTotal = items.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0,
  );
  const savings = originalTotal - totalPrice();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        {totalItems() > 0 && (
          <span className="badge bg-gray-100 text-gray-700">
            {totalItems()} item{totalItems() !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-500 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-400 mb-6">Add some items to get started</p>
          <Link href="/products" className="btn-primary inline-flex">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4"
              >
                <Link
                  href={`/products/${item.product.id}`}
                  className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100"
                >
                  <Image
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-500 font-medium">
                    {item.product.brand}
                  </p>
                  <Link
                    href={`/products/${item.product.id}`}
                    className="font-semibold text-gray-900 hover:text-gray-600 line-clamp-1 transition-colors"
                  >
                    {item.product.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="font-bold text-gray-900">
                      $
                      {discountedPrice(
                        item.product.price,
                        item.product.discountPercentage,
                      ).toFixed(2)}
                    </p>
                    {item.product.discountPercentage > 0 && (
                      <p className="text-xs text-gray-400 line-through">
                        ${item.product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="px-2.5 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 font-semibold text-sm min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="px-2.5 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="font-bold text-gray-900">
                    $
                    {(
                      discountedPrice(
                        item.product.price,
                        item.product.discountPercentage,
                      ) * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              {showClearConfirm ? (
                <div className="flex-1 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-700 flex-1">Remove all items?</span>
                  <button
                    onClick={() => { clearCart(); setShowClearConfirm(false); }}
                    className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
                  >
                    Yes, clear
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex-1 text-sm text-red-400 hover:text-red-600 transition-colors"
                >
                  Clear cart
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
              <h2 className="font-bold text-lg text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({totalItems()} items)
                  </span>
                  <span className="font-medium">
                    ${originalTotal.toFixed(2)}
                  </span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Discounts
                    </span>
                    <span className="text-green-600 font-medium">
                      -${savings.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-gray-900">
                    ${totalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              {savings > 0 && (
                <div className="bg-green-50 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-700">
                    Saving <strong>${savings.toFixed(2)}</strong> on this order
                  </p>
                </div>
              )}

              <Link
                href="/checkout"
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="btn-secondary flex items-center justify-center w-full text-center py-2.5 text-sm mt-2"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Frequently bought together */}
      {items.length > 0 && fbtProducts.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-gray-900">
              Frequently Bought Together
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {fbtProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
