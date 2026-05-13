"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock, TrendingUp, ArrowRight, Zap } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import {
  parseNLSearch,
  TRENDING_SEARCHES,
  SEARCH_CATEGORIES,
} from "@/lib/nlSearchParser";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [nlParsed, setNlParsed] = useState<ReturnType<
    typeof parseNLSearch
  > | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { recentSearches, addSearch, clearRecent } = useSearch();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setNlParsed(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 3) {
      const parsed = parseNLSearch(query);
      const hasFilters = Object.keys(parsed.filters).length > 0;
      setNlParsed(hasFilters ? parsed : null);
    } else {
      setNlParsed(null);
    }
  }, [query]);

  function handleSearch(searchQuery?: string) {
    const q = searchQuery || query;
    if (!q.trim()) return;

    const parsed = parseNLSearch(q);
    addSearch(q);

    const params = new URLSearchParams();
    if (parsed.cleanQuery) params.set("q", parsed.cleanQuery);
    if (parsed.filters.category)
      params.set("category", parsed.filters.category);
    if (parsed.filters.minPrice)
      params.set("minPrice", String(parsed.filters.minPrice));
    if (parsed.filters.maxPrice)
      params.set("maxPrice", String(parsed.filters.maxPrice));
    if (parsed.filters.sortBy) params.set("sortBy", parsed.filters.sortBy);

    router.push(`/search?${params.toString()}`);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") onClose();
  }

  return isOpen ? (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />

      <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Search or type naturally: "running shoes under $80"'
              className="flex-1 text-base outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* NL parse preview */}
          {nlParsed && Object.keys(nlParsed.filters).length > 0 && (
            <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <p className="text-xs text-amber-700">
                <span className="font-semibold">Smart search detected: </span>
                {nlParsed.filters.category &&
                  `Category: ${nlParsed.filters.category} `}
                {nlParsed.filters.maxPrice &&
                  `Under $${nlParsed.filters.maxPrice} `}
                {nlParsed.filters.minPrice &&
                  `Over $${nlParsed.filters.minPrice} `}
                {nlParsed.filters.sortBy && `Sort: ${nlParsed.filters.sortBy}`}
              </p>
            </div>
          )}

          <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">
            {/* Categories */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Browse by category
              </p>
              <div className="flex flex-wrap gap-2">
                {SEARCH_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      router.push(`/products?category=${cat.value}`);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm text-gray-600 transition-colors"
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Recent
                  </p>
                  <button
                    onClick={clearRecent}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.slice(0, 4).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setQuery(s);
                        handleSearch(s);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-600 text-left"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Trending searches
              </p>
              <div className="space-y-1">
                {TRENDING_SEARCHES.slice(0, 5).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setQuery(s);
                      handleSearch(s);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors text-sm text-gray-600 text-left group"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                    {s}
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Try: &quot;kitchen organizer under $40&quot;
            </p>
          </div>
        </div>
      </div>
    </>
  ) : null;
}
