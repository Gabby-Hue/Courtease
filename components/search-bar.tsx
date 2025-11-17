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

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

// Example dataset used to populate search results. Each item includes
// a title, subtitle, participant count, relative date, and an optional
// thumbnail URL. Feel free to adjust or replace with real data.
const searchData = {
  campaigns: [
    {
      id: 1,
      title: "E-learning Fascinating Public Speaking",
      subtitle: "Pusdiklat PSDM",
      count: 153,
      date: "4 years ago",
      thumbnail: "https://via.placeholder.com/56x56.png?text=1",
    },
    {
      id: 2,
      title: "Lets Save Karnataka From Fascism",
      subtitle: "PFI Dk",
      count: 122,
      date: "4 years ago",
      thumbnail: "https://via.placeholder.com/56x56.png?text=2",
    },
    {
      id: 3,
      title: "TESDAMAN",
      subtitle: "Tesdaman",
      count: 4200,
      date: "4 years ago",
      thumbnail: "https://via.placeholder.com/56x56.png?text=3",
    },
  ],
  collections: [
    {
      id: 1,
      title: "Basic Collection Example",
      subtitle: "John Doe",
      count: 10,
      date: "2 years ago",
      thumbnail: "https://via.placeholder.com/56x56.png?text=C1",
    },
  ],
  creators: [
    {
      id: 1,
      title: "Creator Example",
      subtitle: "@creator",
      count: 50,
      date: "1 year ago",
      thumbnail: "https://via.placeholder.com/56x56.png?text=U1",
    },
  ],
};

// Simple filtering function that returns a new object of the same
// structure as searchData with each array filtered by the query. In a
// production application, you might call your backend or use a fuzzy
// matching library here.
function filterSearchResults(query: string) {
  const lower = query.toLowerCase();
  const result: typeof searchData = {
    campaigns: [],
    collections: [],
    creators: [],
  };
  (Object.keys(searchData) as Array<keyof typeof searchData>).forEach((key) => {
    result[key] = searchData[key].filter((item) =>
      item.title.toLowerCase().includes(lower),
    );
  });
  return result;
}

export default function SearchBar() {
  // Current search text
  const [query, setQuery] = useState<string>("");
  // Whether the overlay/dropdown is currently visible
  const [open, setOpen] = useState<boolean>(false);
  // Active tab for categorised results
  const [activeTab, setActiveTab] = useState<
    "campaigns" | "collections" | "creators"
  >("campaigns");

  // Filtered results recomputed whenever the query changes
  const results = filterSearchResults(query);

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // Show overlay only when there is text
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
              {(["campaigns", "collections", "creators"] as const).map(
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
              {results[activeTab].length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No results found.
                </p>
              ) : (
                results[activeTab].map((item) => (
                  <Link
                    href="#"
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt="thumbnail"
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                        {item.subtitle}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                        <span>{item.count.toLocaleString()}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            {/* Footer button */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <button className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
                <Search className="h-4 w-4" />
                See All Campaigns
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
            {(["campaigns", "collections", "creators"] as const).map((tab) => (
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
            {results[activeTab].length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No results found.
              </p>
            ) : (
              results[activeTab].map((item) => (
                <Link
                  href="#"
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt="thumbnail"
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                      {item.subtitle}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                      <span>{item.count.toLocaleString()}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          {/* Footer button */}
          <div className="p-4">
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
              <Search className="h-4 w-4" />
              See All Campaigns
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
