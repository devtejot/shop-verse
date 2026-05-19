"use client";
import { Product } from "@/types/product";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCompareStore } from "@/stores/compareStore";
import { Heart, ShoppingCart, GitCompare, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list";
}

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const {
    addItem: addWishlist,
    removeItem: removeWishlist,
    isWishlisted,
  } = useWishlistStore();
  const {
    addItem: addCompare,
    removeItem: removeCompare,
    isInCompare,
    isFull,
  } = useCompareStore();
  const [addedToCart, setAddedToCart] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const inCompare = isInCompare(product.id);
  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    openCart();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeWishlist(product.id);
    } else {
      addWishlist(product);
    }
  }

  function handleCompare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeCompare(product.id);
    } else {
      addCompare(product);
    }
  }

  if (variant === "list") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden">
        <Link href={`/products/${product.id}`} className="flex gap-4 p-4">
          <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden product-image-zoom">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-contain p-1"
              sizes="96px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-stone-500 font-medium mb-0.5">
                  {product.brand}
                </p>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                  {product.title}
                </h3>
                <StarRating rating={product.rating} size="sm" />
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">
                    ${discountedPrice.toFixed(2)}
                  </p>
                  {product.discountPercentage > 0 && (
                    <>
                      <p className="text-xs text-gray-400 line-through">
                        ${product.price.toFixed(2)}
                      </p>
                      <span className="badge bg-red-100 text-red-600">
                        -{Math.round(product.discountPercentage)}%
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleWishlist}
                    className={`p-1.5 rounded-lg border transition-colors ${wishlisted ? "bg-rose-50 border-rose-200 text-rose-500" : "border-gray-200 text-gray-400 hover:border-rose-200 hover:text-rose-500"}`}
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={wishlisted ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={handleCompare}
                    className={`p-1.5 rounded-lg border transition-colors ${inCompare ? "bg-gray-100 border-gray-300 text-gray-700" : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-700"} ${!inCompare && isFull() ? "opacity-40 cursor-not-allowed" : ""}`}
                    disabled={!inCompare && isFull()}
                  >
                    <GitCompare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary py-1.5 text-xs flex items-center gap-1.5"
                  >
                    {addedToCart ? (
                      "Added!"
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden group h-full flex flex-col">
      <Link href={`/products/${product.id}`} className="block">
        {/* Image */}
        <div className="relative h-48 bg-gray-50 overflow-hidden product-image-zoom">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.discountPercentage >= 10 && (
              <span className="badge bg-red-100 text-red-600">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
            {product.stock <= 5 && (
              <span className="badge bg-orange-100 text-orange-700">
                Low Stock
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleWishlist}
              aria-label={wishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
              aria-pressed={wishlisted}
              className={`w-8 h-8 rounded-full shadow-sm border flex items-center justify-center transition-colors ${wishlisted ? "bg-rose-500 border-rose-500 text-white" : "bg-white border-gray-200 text-gray-500 hover:text-rose-500"}`}
            >
              <Heart
                className="w-4 h-4"
                fill={wishlisted ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={handleCompare}
              disabled={!inCompare && isFull()}
              aria-label={inCompare ? `Remove ${product.title} from compare` : `Add ${product.title} to compare`}
              aria-pressed={inCompare}
              className={`w-8 h-8 rounded-full shadow-sm border flex items-center justify-center transition-colors ${inCompare ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-500 hover:text-gray-900"} ${!inCompare && isFull() ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <GitCompare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs font-medium text-stone-500 mb-1">
            {product.brand}
          </p>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">
            {product.title}
          </h3>
          <StarRating rating={product.rating} />

          <div className="flex items-center justify-between mt-auto pt-3">
            <div>
              <p className="font-bold text-lg text-gray-900">
                ${discountedPrice.toFixed(2)}
              </p>
              {product.discountPercentage > 0 && (
                <p className="text-xs text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              aria-label={addedToCart ? `${product.title} added to cart` : `Add ${product.title} to cart`}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                addedToCart
                  ? "bg-green-500 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-700"
              }`}
            >
              {addedToCart ? (
                <span className="text-xs font-bold" aria-hidden="true">✓</span>
              ) : (
                <ShoppingCart className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
