"use client";

import { useState } from "react";
import PriceChart from "@/components/PriceChart";

export default function CryptoDashboard() {
  const [query, setQuery] = useState("bitcoin");
  const [coinId, setCoinId] = useState("bitcoin");

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Market Insights</h1>
        
        <form onSubmit={(e) => { e.preventDefault(); setCoinId(query.toLowerCase()); }} className="flex gap-2">
          <input 
            className="border border-gray-300 p-3 rounded-xl flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Search coin (e.g. ethereum)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700">
            Search
          </button>
        </form>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 uppercase">{coinId} 7-Day Trend</h2>
          <PriceChart coinId={coinId} />
        </section>
      </div>
    </main>
  );
}