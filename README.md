# ShopVerse

Online e-commerce store for everyday products across categories.

To run: `npm install && npm run dev` — no env vars needed.

---

## Features

- **Mood quiz personalization**: A quick 3-step quiz (who it’s for, budget, main use) helps tailor what products show up first.
- **Price history chart**: Every product page shows a 30-day price line so users can judge if the deal is real.
- **Product comparison**: Users can select up to 3 items and compare specs side by side in one table.
- **Bundle suggestions**: The cart suggests add-ons that match what’s already inside (like a camera → tripod).
- **Wishlist**: Users can save items to revisit later.
- **Recently viewed**: Recently viewed items are saved to help users pick up where they left off.
- **Quick-access UI**: Cart drawer and compare bar stay available while browsing.

---

## Tech Stack

- **Next.js (App Router)** — file-based routing and optimized data fetching.
- **Zustand** — lightweight client state for cart, compare, wishlist, and preferences.
- **TanStack Query** — cached data fetching with tuned stale times.
- **DummyJSON** — public product API used as the data source.
- **URL-driven filters** — filter state lives in the URL for shareable links and back/forward support.

---

## Future Improvements(due to time constrain not able to take them up)

- Move product list/detail to server components for faster initial load.
- Finish an accessibility pass and add reduced-motion support.
- Add a Frequently bought together feature in the cart.
- Add a live signal that shows how many people are on product pages in real time(with sockets).
- compare highlights with color indicators.
- Reintroduce natural-language search with price, category, and sort hints.
