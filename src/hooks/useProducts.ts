"use client";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductById,
  searchProducts,
  fetchCategories,
} from "@/lib/api";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(194),
    staleTime: 1000 * 60 * 10,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    staleTime: 1000 * 60 * 10,
    enabled: !!id,
  });
}

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchProducts(query),
    enabled: query.length > 1,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60,
  });
}
