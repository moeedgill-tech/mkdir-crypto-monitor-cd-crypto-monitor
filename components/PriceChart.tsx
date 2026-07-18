"use client";

import { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import Skeleton from "./Skeleton";

interface PriceChartProps {
  coinId: string;
}

interface MarketChartData {
  prices: [number, number][];
}

export default function PriceChart({ coinId }: PriceChartProps) {
  const [data, setChartData] = useState<MarketChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
        );
        const result = await response.json();
        setChartData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (coinId) {
      fetchData();
    }
  }, [coinId]);

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const chartData = data?.prices?.map((item: [number, number]) => ({
    date: new Date(item[0]).toLocaleDateString(),
    price: item[1],
  })) || [];

  return (
    <div className="h-[400px] w-full"> 
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" hide />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#2563eb" 
            strokeWidth={2} 
            dot={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}