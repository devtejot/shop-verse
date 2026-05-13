"use client";
import { useState, useEffect, useCallback } from "react";
import { parseNLSearch } from "@/lib/nlSearchParser";
import { ProductFilters } from "@/types/product";

const STORAGE_KEY = "shopverse-recent-searches";
const MAX_RECENT = 8;

export function useSearch() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const addSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((s) => s !== query)].slice(
        0,
        MAX_RECENT,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const parseQuery = useCallback(
    (query: string): { cleanQuery: string; filters: ProductFilters } => {
      return parseNLSearch(query);
    },
    [],
  );

  return { recentSearches, addSearch, clearRecent, parseQuery };
}
