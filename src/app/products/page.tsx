import { fetchProducts, fetchCategories } from "@/lib/api";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
  const [productsData, categories] = await Promise.all([
    fetchProducts(194).catch(() => null),
    fetchCategories().catch(() => null),
  ]);

  return (
    <ProductsClient
      initialProducts={productsData?.products}
      initialCategories={categories ?? undefined}
      initialTotal={productsData?.total}
    />
  );
}
