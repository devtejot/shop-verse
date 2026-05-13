"use client";
import { useProducts } from "@/hooks/useProducts";
import { useUserPrefsStore } from "@/stores/userPrefsStore";
import { ProductCard } from "@/components/products/ProductCard";
import { MoodQuiz } from "@/components/onboarding/MoodQuiz";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { FEATURED_CATEGORIES, USE_CASE_PRODUCTS } from "@/lib/mockData";
import { applyFilters } from "@/lib/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { SearchModal } from "@/components/search/SearchModal";
import { RecentlyViewed } from "@/components/products/RecentlyViewed";

export default function HomePage() {
  const { data, isLoading } = useProducts();
  const { quizCompleted, primaryUse, budget, getBudgetRange } =
    useUserPrefsStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const budgetRange = getBudgetRange();

  const featured = useMemo(() => {
    if (!data?.products) return [];
    let products = [...data.products];

    if (primaryUse && USE_CASE_PRODUCTS[primaryUse]) {
      const preferredCategories = USE_CASE_PRODUCTS[primaryUse];
      products = products.filter((p) =>
        preferredCategories.some((c) => p.category.toLowerCase().includes(c)),
      );
    }

    if (budgetRange) {
      products = products.filter(
        (p) => p.price >= budgetRange.min && p.price <= budgetRange.max,
      );
    }

    return products.sort((a, b) => b.rating - a.rating).slice(0, 8);
  }, [data, primaryUse, budgetRange]);

  const topDeals = useMemo(() => {
    if (!data?.products) return [];
    return applyFilters(data.products, { sortBy: "discount" }).slice(0, 4);
  }, [data]);

  const newArrivals = useMemo(() => {
    if (!data?.products) return [];
    return data.products.slice(-8).reverse();
  }, [data]);

  const isPersonalized = quizCompleted && (primaryUse || budget);

  return (
    <>
      <MoodQuiz />

      <div className="pb-20">
        {/* Hero */}
        <section className="border-b border-gray-200 bg-white py-14 sm:py-20 px-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl">
              {isPersonalized && (
                <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-4">
                  Personalized for you
                </p>
              )}
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4 tracking-tight">
                Everyday finds,
                <br />
                honestly curated.
              </h1>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Smart search, price history, and side-by-side comparison
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="btn-primary flex items-center gap-2 px-5 py-3"
                >
                  Search products
                </button>
                <Link
                  href="/products"
                  className="btn-secondary flex items-center gap-2 px-5 py-3"
                >
                  Browse all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide">
              Shop by Category
            </h2>
            <Link
              href="/products"
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {FEATURED_CATEGORIES.map((cat) => (
              <div key={cat.slug} className="h-full">
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-400 transition-all text-center h-full"
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-sm font-medium text-gray-800">
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {cat.description}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Viewed */}
        <RecentlyViewed />

        {/* Personalized / Featured */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide">
              {isPersonalized ? "Picked for you" : "Top picks"}
            </h2>
            <Link
              href="/products"
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(featured.length > 0
                ? featured
                : data?.products?.slice(0, 8) || []
              ).map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Top Deals */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="border border-gray-200 rounded-2xl p-6 sm:p-8 bg-white mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-stone-500 mb-1">
                  Limited time
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  Up to 40% off today
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  While supplies last
                </p>
              </div>
              <Link
                href="/products?sortBy=discount"
                className="btn-primary flex items-center gap-2 px-5 py-2.5"
              >
                Shop deals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {topDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide">
              New Arrivals
            </h2>
            <Link
              href="/products"
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.slice(0, 4).map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
