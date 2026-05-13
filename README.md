# ShopVerse

ShopVerse is a Next.js e-commerce demo focused on fast browsing, informed buying, and low-friction shopping across everyday categories.

To run: `npm install && npm run dev` — no env vars needed.

---

## What I Built

- **Mood quiz personalization**: A quick 3-step quiz (who it’s for, budget, main use) helps tailor what products show up first.
- **Price history chart**: Every product page shows a 30-day price line so users can judge if the deal is real.
- **Product comparison**: Users can select up to 3 items and compare specs side by side in one table.
- **Bundle suggestions**: The cart suggests add-ons that match what’s already inside (like a camera → tripod).
- **Wishlist**: Users can save items to revisit later.
- **Recently viewed**: Recently viewed items are saved to help users pick up where they left off.
- **Quick-access UI**: Cart drawer and compare bar stay available while browsing.

---

## Decisions & Trade-offs

- **App Router + client-heavy UI**: I kept most product browsing and interactivity on the client for speed of iteration and smooth UI state transitions (drawer, compare, filters). The trade-off is less server-rendered content for initial load.
- **Zustand for UI state**: Lightweight global stores made it easy to share cart/compare/wishlist state across routes without prop drilling.
- **URL-driven filters**: Filters live in the URL so results are shareable and back/forward friendly, at the cost of a bit more parsing logic.
- **Mocked data layers**: Using DummyJSON and local mock data allowed rapid prototyping, but real-world concerns like pagination, auth, and inventory are simplified.

## Tech Stack

- **Next.js (App Router)** — file-based routing and optimized data fetching.
- **Zustand** — lightweight client state for cart, compare, wishlist, and preferences.
- **TanStack Query** — cached data fetching with tuned stale times.
- **DummyJSON** — public product API used as the data source.
- **URL-driven filters** — filter state lives in the URL for shareable links and back/forward support.
- **Tailwind** - I have used tailwind for the project as it makes a easier to apply styles instead of normal css files.

---

## What I Would Do Differently With More Time

- Move product list/detail to server components for faster initial load.
- Finish an accessibility pass and add reduced-motion support.
- Add a Frequently bought together feature in the cart.
- Add a live signal that shows how many people are on product pages in real time (with sockets).
- Add comparison highlights with color indicators.
- Reintroduce natural-language search with price, category, and sort hints.
