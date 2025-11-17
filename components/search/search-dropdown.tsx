"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { highlightMatches } from "@/components/ui/search-highlight";
import { useSearch, type SearchResult, type SuggestedCourt } from "@/hooks/use-search";

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/venues", label: "Venues" },
  { href: "/forum", label: "Forum" },
];

export function SearchDropdown({ isOpen, onClose }: SearchDropdownProps) {
  const {
    query,
    setQuery,
    results,
    searching,
    error,
    suggestions,
    loadingSuggestions,
    suggestionError,
  } = useSearch();

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto mt-20 max-w-2xl rounded-lg bg-white p-4 shadow-lg dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-500" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search courts, venues, forum..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent text-lg shadow-none focus-visible:ring-0"
          />
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto">
          {query.trim() ? (
            <SearchResults
              results={results}
              searching={searching}
              error={error}
              query={query}
              onClose={onClose}
            />
          ) : (
            <Suggestions
              suggestions={suggestions}
              loading={loadingSuggestions}
              error={suggestionError}
              onClose={onClose}
            />
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4 dark:border-gray-800">
          <div className="flex gap-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="text-xs text-gray-500">
            Press <kbd className="rounded border px-1">Esc</kbd> to close
          </div>
        </div>
      </div>
    </div>
  );
}

interface SearchResultsProps {
  results: SearchResult[];
  searching: boolean;
  error: string | null;
  query: string;
  onClose: () => void;
}

function SearchResults({ results, searching, error, query, onClose }: SearchResultsProps) {
  if (searching) {
    return <div className="py-8 text-center text-sm text-gray-500">Searching...</div>;
  }

  if (error) {
    return (
      <div className="py-8 text-center text-sm text-red-500">
        Error: {error}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        No results found for "{query}"
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((result, index) => (
        <Link
          key={`${result.type}-${index}`}
          href={result.href}
          className="block rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onClose}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {result.type}
                </span>
                {result.type === "court" && <MapPin className="h-3 w-3 text-gray-400" />}
              </div>
              <h3 className="mt-1 font-medium">
                {highlightMatches(result.title, query)}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {highlightMatches(result.description, query)}
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );
}

interface SuggestionsProps {
  suggestions: SuggestedCourt[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

function Suggestions({ suggestions, loading, error, onClose }: SuggestionsProps) {
  if (loading) {
    return <div className="py-8 text-center text-sm text-gray-500">Loading suggestions...</div>;
  }

  if (error) {
    return (
      <div className="py-8 text-center text-sm text-red-500">
        Error loading suggestions: {error}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        No suggestions available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Popular Courts</h3>
      {suggestions.map((court) => (
        <Link
          key={court.id}
          href={`/courts/${court.slug}`}
          className="block rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onClose}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="font-medium">{court.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {court.venueName}
                {court.venueCity && ` • ${court.venueCity}`}
              </p>
              {court.pricePerHour && (
                <p className="text-sm text-gray-500">
                  Rp{court.pricePerHour.toLocaleString()}/hour
                </p>
              )}
            </div>
            <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );
}