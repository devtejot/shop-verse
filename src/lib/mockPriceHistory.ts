import { PricePoint } from "@/types/product";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function generatePriceHistory(
  productId: number,
  currentPrice: number,
): PricePoint[] {
  const rand = seededRandom(productId * 137);
  const points: PricePoint[] = [];
  const today = new Date();

  // Work backwards 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // Simulate realistic price variation ±20%
    const variation = (rand() - 0.4) * 0.2;
    const price = Math.round(currentPrice * (1 + variation) * 100) / 100;

    points.push({
      date: date.toISOString().split("T")[0],
      price,
    });
  }

  // Last point is always current price
  points[points.length - 1].price = currentPrice;
  return points;
}

export function getLowestPrice(history: PricePoint[]): number {
  return Math.min(...history.map((p) => p.price));
}

export function isCurrentLowest(history: PricePoint[]): boolean {
  const lowest = getLowestPrice(history);
  const current = history[history.length - 1].price;
  return current <= lowest * 1.02; // within 2% of lowest = badge worthy
}
