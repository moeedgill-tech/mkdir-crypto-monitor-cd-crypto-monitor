"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher"; // Assume this is your fetch utility
import Skeleton from "./Skeleton";

export default function PriceChart({ coinId }: { coinId: string }) {
  const { data, isLoading } = useSWR(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`,
    fetcher
  );

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const chartData = data.prices.map(([timestamp, price]: [number, number]) => ({
    date: new Date(timestamp).toLocaleDateString("en-US", { weekday: 'short' }),
    price: price,
  }));

  return (
    <div className="h-64 w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
          <YAxis domain={['auto', 'auto']} stroke="#9ca3af" fontSize={12} />
          <Tooltip contentStyle={{ borderRadius: '8px' }} />
          <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}