import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link
              href="/"
              className="text-white font-bold text-lg mb-3 block tracking-tight"
            >
              ShopVerse
            </Link>
            <p className="text-sm leading-relaxed">
              Everyday shopping with smart search, price tracking, and
              side-by-side comparison.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Shop</h3>
            <ul className="space-y-2 text-sm">
              {["All Products", "Beauty", "Groceries", "Home Decor"].map(
                (l) => (
                  <li key={l}>
                    <Link
                      href="/products"
                      className="hover:text-white transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/compare"
                  className="hover:text-white transition-colors"
                >
                  Compare Products
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="hover:text-white transition-colors"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-white transition-colors"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
