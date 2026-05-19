"use client";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCompareStore } from "@/stores/compareStore";
import { useUserPrefsStore } from "@/stores/userPrefsStore";
import { PriceHistoryChart } from "@/components/products/PriceHistoryChart";
import { LiveSignals } from "@/components/products/LiveSignals";
import { ProductCard } from "@/components/products/ProductCard";
import { RecentlyViewed } from "@/components/products/RecentlyViewed";
import { StarRating } from "@/components/ui/StarRating";
import { Skeleton } from "@/components/ui/Skeleton";
import { getProductSpecs } from "@/lib/mockSpecs";
import {
  ShoppingCart,
  Heart,
  GitCompare,
  ArrowLeft,
  Check,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Product } from "@/types/product";

interface Props {
  initialProduct?: Product;
  initialRelated?: Product[];
}

export default function ProductDetailClient({ initialProduct, initialRelated }: Props = {}) {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const { data: product = initialProduct, isLoading: productLoading } = useProduct(id);
  const { data: allProducts } = useProducts();

  const isLoading = !initialProduct && productLoading;

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
  const addRecentlyViewed = useUserPrefsStore((s) => s.addRecentlyViewed);

  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (id) addRecentlyViewed(id);
  }, [id, addRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="h-96 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);
  const wishlisted = isWishlisted(product.id);
  const inCompare = isInCompare(product.id);
  const specs = getProductSpecs(
    product.id,
    product.category,
    product.price,
    product.brand,
  );

  const similar =
    initialRelated ||
    allProducts?.products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4) ||
    [];

  function handleAddToCart() {
    addToCart(product!, qty);
    openCart();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers.
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      setShareCopied(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span>/</span>
        <Link
          href="/products"
          className="hover:text-gray-900 transition-colors"
        >
          Products
        </Link>
        <span>/</span>
        <span className="capitalize text-gray-700">
          {product.category.replace(/-/g, " ")}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Images */}
        <div>
          <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden h-80 sm:h-96 product-image-zoom mb-3">
            <Image
              src={product.images[activeImage] || product.thumbnail}
              alt={product.title}
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.slice(0, 6).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition-colors ${
                    i === activeImage
                      ? "border-gray-900"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-stone-500 mb-1">
              {product.brand}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={product.rating} size="md" />
              <span className="text-sm text-gray-400">
                ({Math.floor(product.rating * 47)} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-gray-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="badge bg-red-100 text-red-600 text-sm px-2 py-0.5">
                  Save {Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>

          {/* Live signals */}
          <LiveSignals product={product} />

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors font-medium"
              >
                −
              </button>
              <span className="px-4 py-2.5 font-semibold text-gray-900 min-w-[40px] text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="px-3 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors font-medium"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-200 ${
                addedToCart
                  ? "bg-green-500 text-white"
                  : "bg-gray-900 hover:bg-gray-700 text-white"
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Secondary actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                wishlisted ? removeWishlist(product.id) : addWishlist(product)
              }
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors text-sm font-medium ${
                wishlisted
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "border-gray-200 text-gray-600 hover:border-rose-200 hover:text-rose-600"
              }`}
            >
              <Heart
                className="w-4 h-4"
                fill={wishlisted ? "currentColor" : "none"}
              />
              {wishlisted ? "Wishlisted" : "Save"}
            </button>

            <button
              onClick={() =>
                inCompare ? removeCompare(product.id) : addCompare(product)
              }
              disabled={!inCompare && isFull()}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors text-sm font-medium ${
                inCompare
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-700"
              } ${!inCompare && isFull() ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <GitCompare className="w-4 h-4" />
              {inCompare ? "In Compare" : "Compare"}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium ml-auto"
            >
              {shareCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              {shareCopied ? "Copied" : "Share"}
            </button>
          </div>
        </div>
      </div>

      {/* Specs + Price history */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Specs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Specifications</h3>
          <div className="space-y-2">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <span className="text-sm text-gray-500">{spec.label}</span>
                <span className="text-sm font-medium text-gray-800">
                  {spec.value}
                  {spec.unit ? ` ${spec.unit}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price history */}
        <PriceHistoryChart
          productId={product.id}
          currentPrice={discountedPrice}
        />
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold text-xl text-gray-900 mb-4">
            Similar Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Recently viewed (excludes current product) */}
      <div className="-mx-4 sm:-mx-6">
        <RecentlyViewed excludeId={product.id} maxItems={8} />
      </div>
    </div>
  );
}
