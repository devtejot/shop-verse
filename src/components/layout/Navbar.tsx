"use client";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCompareStore } from "@/stores/compareStore";
import { ShoppingCart, Heart, GitCompare, Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { SearchModal } from "@/components/search/SearchModal";

const NAV_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/products?category=beauty", label: "Beauty" },
  { href: "/products?category=groceries", label: "Groceries" },
  { href: "/products?category=furniture", label: "Furniture" },
];

export function Navbar() {
  const cartCount = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const compareCount = useCompareStore((s) => s.items.length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="font-bold text-xl text-gray-900 hover:text-gray-700 transition-colors tracking-tight"
            >
              ShopVerse
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline text-gray-400">
                  Search...
                </span>
              </button>

              <Link
                href="/wishlist"
                className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gray-900 text-white text-xs rounded-full flex items-center justify-center font-bold px-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {compareCount > 0 && (
                <Link
                  href="/compare"
                  className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Compare"
                >
                  <GitCompare className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gray-900 text-white text-xs rounded-full flex items-center justify-center font-bold px-1">
                    {compareCount}
                  </span>
                </Link>
              )}

              <button
                onClick={openCart}
                className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gray-900 text-white text-xs rounded-full flex items-center justify-center font-bold px-1">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
