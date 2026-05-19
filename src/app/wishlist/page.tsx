"use client";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { Heart, Trash2, ShoppingCart, TrendingDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";
import { generatePriceHistory } from "@/lib/mockPriceHistory";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  function addAllToCart() {
    items.forEach((item) => addToCart(item.product));
    openCart();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
        <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
        {items.length > 0 && (
          <span className="badge bg-rose-100 text-rose-600">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
        )}
        {items.length > 1 && (
          <button
            onClick={addAllToCart}
            className="ml-auto btn-primary flex items-center gap-2 py-2 text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Add all to Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-500 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-400 mb-6">
            Save products you love to revisit later
          </p>
          <Link href="/products" className="btn-primary inline-flex">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => {
            const discounted =
              item.product.price * (1 - item.product.discountPercentage / 100);

            // Check if price dropped since item was added to wishlist
            const history = generatePriceHistory(item.product.id, discounted);
            const addedDate = new Date(item.addedAt).toISOString().split("T")[0];
            const pointAtAdd = history.find((p) => p.date >= addedDate);
            const priceWhenAdded = pointAtAdd?.price ?? discounted;
            const priceDrop = priceWhenAdded - discounted;
            const hasPriceDrop = priceDrop > 0.5;

            return (
              <div
                key={item.product.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 hover:border-gray-300 hover:shadow-md transition-all"
              >
                <Link
                  href={`/products/${item.product.id}`}
                  className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100"
                >
                  <Image
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-500 font-medium">
                    {item.product.brand}
                  </p>
                  <Link
                    href={`/products/${item.product.id}`}
                    className="font-semibold text-gray-900 hover:text-gray-600 transition-colors line-clamp-1"
                  >
                    {item.product.title}
                  </Link>
                  <StarRating rating={item.product.rating} size="sm" />
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="font-bold text-gray-900">
                      ${discounted.toFixed(2)}
                    </span>
                    {item.product.discountPercentage > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        ${item.product.price.toFixed(2)}
                      </span>
                    )}
                    {hasPriceDrop && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        <TrendingDown className="w-3 h-3" />
                        Down ${priceDrop.toFixed(2)} since saved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    aria-label={`Remove ${item.product.title} from wishlist`}
                    className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-gray-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      addToCart(item.product);
                      openCart();
                    }}
                    className="btn-primary flex items-center gap-1.5 py-2 text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
