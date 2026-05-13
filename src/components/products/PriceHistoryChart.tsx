"use client";
import { generatePriceHistory, isCurrentLowest } from "@/lib/mockPriceHistory";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { TrendingDown, Award } from "lucide-react";

interface PriceHistoryChartProps {
  productId: number;
  currentPrice: number;
}

export function PriceHistoryChart({
  productId,
  currentPrice,
}: PriceHistoryChartProps) {
  const history = useMemo(
    () => generatePriceHistory(productId, currentPrice),
    [productId, currentPrice],
  );

  const lowestPrice = Math.min(...history.map((p) => p.price));
  const highestPrice = Math.max(...history.map((p) => p.price));
  const currentIsLowest = isCurrentLowest(history);
  const avgPrice = history.reduce((s, p) => s + p.price, 0) / history.length;

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">
            Price History (30 days)
          </h3>
        </div>
        {currentIsLowest && (
          <div className="flex items-center gap-1.5 badge bg-green-100 text-green-700 px-2 py-1">
            <Award className="w-3.5 h-3.5" />
            <span>Lowest price!</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          {
            label: "Current",
            value: `$${currentPrice.toFixed(2)}`,
            color: "text-gray-900",
          },
          {
            label: "Lowest (30d)",
            value: `$${lowestPrice.toFixed(2)}`,
            color: "text-green-600",
          },
          {
            label: "Average",
            value: `$${avgPrice.toFixed(2)}`,
            color: "text-gray-700",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-center bg-gray-50 rounded-xl p-3"
          >
            <p className={`font-bold text-lg ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={history}
            margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient
                id={`price-grad-${productId}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#374151" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#374151" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              interval={6}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${Number(v).toFixed(2)}`}
              domain={[lowestPrice * 0.95, highestPrice * 1.05]}
              width={60}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
              formatter={(v) => [`$${Number(v).toFixed(2)}`, "Price"]}
              labelFormatter={(l) => `Date: ${l}`}
            />
            <ReferenceLine
              y={lowestPrice}
              stroke="#22c55e"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#374151"
              strokeWidth={2}
              fill={`url(#price-grad-${productId})`}
              dot={false}
              activeDot={{ r: 4, fill: "#374151" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Dashed green line = 30-day lowest price
      </p>
    </div>
  );
}
