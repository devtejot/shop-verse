import { fetchProductById, fetchProducts } from "@/lib/api";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const productId = parseInt(id);

  // Fetch product and related products server-side for fast initial load
  const [product, allProducts] = await Promise.all([
    fetchProductById(productId).catch(() => null),
    fetchProducts(194).catch(() => null),
  ]);

  const related =
    allProducts?.products
      .filter((p) => p.category === product?.category && p.id !== productId)
      .slice(0, 4) || [];

  return (
    <ProductDetailClient
      initialProduct={product ?? undefined}
      initialRelated={related}
    />
  );
}
