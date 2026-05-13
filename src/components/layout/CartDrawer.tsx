"use client";
import { useCartStore } from "@/stores/cartStore";
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCartStore();

  const discountedPrice = (price: number, discount: number) =>
    price * (1 - discount / 100);

  return isOpen ? (
    <>
      <div onClick={closeCart} className="fixed inset-0 bg-black/30 z-50" />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            <h2 className="font-semibold text-lg text-gray-900">Cart</h2>
            {totalItems() > 0 && (
              <span className="badge bg-gray-100 text-gray-700">
                {totalItems()} item{totalItems() !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-8">
              <ShoppingCart className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">
                Add some products to get started
              </p>
              <button onClick={closeCart} className="btn-primary mt-4 text-sm">
                Browse Products
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 bg-gray-50 rounded-xl p-3"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-100">
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.product.title}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {item.product.brand}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-bold text-gray-900">
                        $
                        {discountedPrice(
                          item.product.price,
                          item.product.discountPercentage,
                        ).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="w-6 h-6 rounded-md bg-white border border-red-100 flex items-center justify-center hover:bg-red-50 transition-colors ml-1"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-lg text-gray-900">
                ${totalPrice().toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-secondary w-full inline-flex items-center justify-center py-2 text-sm"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  ) : null;
}
