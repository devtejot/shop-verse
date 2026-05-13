"use client";
import { useUserPrefsStore } from "@/stores/userPrefsStore";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface RecentlyViewedProps {
  excludeId?: number;
  maxItems?: number;
  noPadding?: boolean;
}

function RecentlyViewedCard({ product }: { product: Product }) {
  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col gap-2 w-32 sm:w-36 flex-shrink-0"
    >
      <div className="relative w-full aspect-square bg-white rounded-xl border border-gray-100 overflow-hidden group-hover:border-gray-300 group-hover:shadow-md transition-all duration-200">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-contain p-2.5 transition-transform duration-300 group-hover:scale-105"
          sizes="144px"
        />
        {product.discountPercentage >= 10 && (
          <span className="absolute top-1.5 left-1.5 text-[10px] font-semibold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full leading-none">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
      </div>
      <div className="px-0.5">
        <p className="text-xs text-gray-900 font-medium leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors">
          {product.title}
        </p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-sm font-bold text-gray-900">
            ${discountedPrice.toFixed(0)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ${product.price.toFixed(0)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function RecentlyViewed({
  excludeId,
  maxItems = 8,
  noPadding = false,
}: RecentlyViewedProps) {
  const { recentlyViewed } = useUserPrefsStore();
  const { data } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const products = useMemo(() => {
    if (!data?.products || recentlyViewed.length === 0) return [];
    const productMap = new Map<number, Product>(
      data.products.map((p) => [p.id, p]),
    );
    return recentlyViewed
      .filter((id) => id !== excludeId && productMap.has(id))
      .slice(0, maxItems)
      .map((id) => productMap.get(id)!);
  }, [data, recentlyViewed, excludeId, maxItems]);

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [products]);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <section
      className={noPadding ? "py-4" : "max-w-7xl mx-auto px-4 sm:px-6 py-6"}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Recently viewed
          </h2>
        </div>

        {/* Arrow nav — only shown when scrollable */}
        <div className="flex items-center gap-1">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-gray-400 hover:shadow-sm transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-gray-400 hover:shadow-sm transition-all"
            >
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="snap-start">
            <RecentlyViewedCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
