"use client";

/**
 * SearchBar component
 *
 * This component encapsulates the search UI for both desktop and mobile
 * views. On desktop (md and above), the search input sits in the
 * navbar and reveals a dropdown directly beneath it when a query is
 * entered. On mobile, clicking the search icon opens a full-screen
 * overlay with its own input and a cancel button. The search results
 * are filtered from a small sample dataset defined within this file.
 * You can replace the mock data and filtering logic with real API
 * integration as needed. Import this component into your Navbar and
 * remove the old search logic from there.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

// Database search result type
type SearchResult = {
  type: "court" | "venue" | "forum";
  title: string;
  description: string;
  href: string;
};

// Search categories for organizing results
type SearchCategory = "courts" | "venues" | "forums";

// Search results organized by category
type SearchResults = {
  courts: SearchResult[];
  venues: SearchResult[];
  forums: SearchResult[];
};

// Function to fetch search results from the database API
async function fetchSearchResults(query: string): Promise<SearchResults> {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }

    const { data } = await response.json();

    // Organize results by category
    const organizedResults: SearchResults = {
      courts: [],
      venues: [],
      forums: [],
    };

    (data || []).forEach((item: SearchResult) => {
      switch (item.type) {
        case "court":
          organizedResults.courts.push(item);
          break;
        case "venue":
          organizedResults.venues.push(item);
          break;
        case "forum":
          organizedResults.forums.push(item);
          break;
      }
    });

    return organizedResults;
  } catch (error) {
    console.error("Search error:", error);
    return {
      courts: [],
      venues: [],
      forums: [],
    };
  }
}

export default function SearchBar() {
  // Current search text
  const [query, setQuery] = useState<string>("");
  // Whether the overlay/dropdown is currently visible
  const [open, setOpen] = useState<boolean>(false);
  // Active tab for categorized results
  const [activeTab, setActiveTab] = useState<SearchCategory>("courts");
  // Search results from database
  const [results, setResults] = useState<SearchResults>({
    courts: [],
    venues: [],
    forums: [],
  });
  // Loading state for search
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch search results from database when query changes
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length === 0) {
      setResults({ courts: [], venues: [], forums: [] });
      return;
    }

    setLoading(true);
    try {
      const searchResults = await fetchSearchResults(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error("Search failed:", error);
      setResults({ courts: [], venues: [], forums: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length > 0) {
        performSearch(query);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Close the overlay when the escape key is pressed
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    if (open) {
      window.addEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  // Handle changes in the search input
  // Handle input changes with proper search logic
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // Show overlay when there is text
    setOpen(value.trim().length > 0);
  };

  return (
    <div className="relative">
      {/* Desktop search input (hidden on small screens) */}
      <div className="relative hidden md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(query.trim().length > 0)}
          placeholder="Search venue, court, or forum"
          className="w-56 md:w-72 lg:w-80 rounded-full border border-gray-300 bg-white py-2 pl-9 pr-9 text-sm text-gray-900 placeholder-gray-500 transition focus:border-orange-500 focus:ring-2 focus:ring-orange-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-teal-400 dark:focus:ring-teal-300"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Mobile search trigger (shows full-screen overlay) */}
      <button
        type="button"
        aria-label="Cari konten"
        onClick={() => setOpen(true)}
        className="md:hidden rounded-full border border-white p-2 bg-white text-orange-500 transition-colors duration-200 hover:bg-gray-100 dark:border-teal-200 dark:bg-teal-200 dark:text-teal-700 dark:hover:bg-teal-300"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Desktop dropdown anchored below the input */}
      {open && (
        <div className="hidden md:block absolute left-0 right-0 mt-2 z-40">
          <div className="rounded-xl bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
            {/* Tabs for categories */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 text-sm font-medium">
              {(["courts", "venues", "forums"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 transition-colors ${
                      activeTab === tab
                        ? "border-b-2 border-orange-500 text-gray-900 dark:text-white"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ),
              )}
            </div>
            {/* Results list */}
            <div className="max-h-72 overflow-y-auto py-2">
              {loading ? (
                <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Searching...
                </p>
              ) : results[activeTab].length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No results found.
                </p>
              ) : (
                results[activeTab].map((item, index) => (
                  <Link
                    href={item.href}
                    key={`${item.type}-${index}`}
                    className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="flex-1">
                      <p className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
            {/* Footer button */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <button className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
                <Search className="h-4 w-4" />
                See All Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile full-screen overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900">
          {/* Top bar with search input and cancel */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={handleInputChange}
                placeholder="Search"
                className="w-full rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 py-2 pl-10 pr-9 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-orange-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-orange-300 dark:focus:ring-teal-300"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-2 text-sm font-semibold text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              Cancel
            </button>
          </div>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 text-sm font-medium">
            {(["courts", "venues", "forums"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-orange-500 text-gray-900 dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* Results list */}
          <div className="flex-1 overflow-y-auto py-2">
            {loading ? (
              <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Searching...
              </p>
            ) : results[activeTab].length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No results found.
              </p>
            ) : (
              results[activeTab].map((item, index) => (
                <Link
                  href={item.href}
                  key={`${item.type}-${index}`}
                  className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
          {/* Footer button */}
          <div className="p-4">
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
              <Search className="h-4 w-4" />
              See All Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
