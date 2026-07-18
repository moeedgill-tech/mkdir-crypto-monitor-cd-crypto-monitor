"use client";

import { useState, useEffect, useRef } from "react";
import PriceChart from "../components/PriceChart";

// Defining the shape of each coin object from the CoinGecko API
interface Coin {
  id: string;
  name: string;
  symbol: string;
}

export default function Page() {
  const [query, setQuery] = useState("");
  const [coinId, setCoinId] = useState("bitcoin");
  const [allCoins, setAllCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Ref to detect clicks outside the dropdown menu
  const dropdownRef = useRef<HTMLFormElement>(null);

  // 1. Fetch the master coin list once when the app component mounts
  useEffect(() => {
    async function fetchAllCoins() {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/list");
        const data = await response.json();
        setAllCoins(data);
      } catch (error) {
        console.error("Failed to fetch the global coin list:", error);
      }
    }
    fetchAllCoins();
  }, []);

  // 2. Event listener to hide the dropdown if a user clicks anywhere outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Filter coins matching either the name or symbol, capped at 10 results
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredCoins([]);
      setShowDropdown(false);
      return;
    }

    const filtered = allCoins
      .filter(
        (coin) =>
          coin.name.toLowerCase().includes(value.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 10); // Performance optimization: only render top 10 matches

    setFilteredCoins(filtered);
    setShowDropdown(true);
  };

  // 4. Handle item selection from the suggestion dropdown
  const handleSelectCoin = (coin: Coin) => {
    setQuery(coin.name);
    setCoinId(coin.id);
    setShowDropdown(false);
  };

  // 5. Fallback logic for when a user submits by hitting Enter or clicking search directly
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const exactMatch = allCoins.find(
      (c) => c.name.toLowerCase() === query.toLowerCase() || c.id === query.toLowerCase()
    );

    if (exactMatch) {
      setCoinId(exactMatch.id);
    } else {
      setCoinId(query.toLowerCase().replace(/\s+/g, "-")); // Simple slugification strategy
    }
    setShowDropdown(false);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Market Insights</h1>
        
        {/* Search Input and Floating Dropdown Menu */}
        <form onSubmit={handleSearchSubmit} className="relative flex gap-2 mb-8" ref={dropdownRef}>
          <div className="relative flex-1">
            <input 
              className="border border-gray-300 p-3 rounded-lg w-full text-black shadow-sm focus:outline-none focus:border-blue-500"
              value={query} 
              onChange={handleInputChange} 
              onFocus={() => query && filteredCoins.length > 0 && setShowDropdown(true)}
              placeholder="Search coin (e.g., ethereum)..."
            />
            
            {/* Auto-complete suggestions overlay dropdown */}
            {showDropdown && filteredCoins.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {filteredCoins.map((coin) => (
                  <button
                    key={coin.id}
                    type="button"
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-gray-800 transition-colors flex justify-between items-center border-b border-gray-50 last:border-none"
                    onClick={() => handleSelectCoin(coin)}
                  >
                    <span className="font-medium">{coin.name}</span>
                    <span className="text-xs uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">
                      {coin.symbol}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>

        <h2 className="text-lg font-semibold mb-4 text-gray-700 uppercase tracking-wide">
          {coinId.replace("-", " ")} 7-DAY TREND
        </h2>

        {/* Chart Viewport Canvas wrapper */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <PriceChart coinId={coinId} />
        </div>
      </div>
    </main>
  );
}