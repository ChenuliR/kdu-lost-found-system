"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import PostCard from "./post-card";
import Link from "next/link";
import { Filter, X } from "lucide-react";

const CATEGORIES = [
  { label: "Select a category", value: null },
  { label: "Laptop/Computer", value: "laptop/computer" },
  { label: "Phone", value: "phone" },
  { label: "Wallet/Cash", value: "wallet/cash" },
  { label: "Backpack/Bag", value: "backpack/bag" },
  { label: "Keys", value: "keys" },
  { label: "Headphones/Earbuds", value: "headphones/earbuds" },
  { label: "Watch", value: "watch" },
  { label: "Water Bottle", value: "water-bottle" },
  { label: "Clothing", value: "clothing" },
  { label: "Documents/ID", value: "documents/id" },
  { label: "Books/Notebooks", value: "books/notebooks" },
  { label: "Jewellery", value: "jewellery" },
  { label: "Other", value: "other" },
];

export default function PostFilter({ posts }: { posts: any[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // search
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedPosts, setDisplayedPosts] = useState<any[]>(posts ?? []);

  // active filters (applied when popup closes)
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");

  // popup state and temporary values
  const [popupOpen, setPopupOpen] = useState(false);
  const [tempType, setTempType] = useState<string>(typeFilter);
  const [tempCategory, setTempCategory] = useState<string | null>(categoryFilter);
  const [tempStart, setTempStart] = useState<string>(startDateFilter);
  const [tempEnd, setTempEnd] = useState<string>(endDateFilter);

  useEffect(() => setDisplayedPosts(posts ?? []), [posts]);

  // apply active filters + query (debounced)
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const timer = setTimeout(() => {
      if (!mounted) return;
      const term = query.trim().toLowerCase();
      const filtered = (posts || []).filter((post) => {
        // type
        if (typeFilter !== "all" && post.type !== typeFilter) return false;
        // category
        if (categoryFilter && categoryFilter !== "all" && post.category !== categoryFilter) return false;
        // date range
        if (startDateFilter) {
          const d = new Date(post.date || post.created_at || "");
          if (isNaN(d.getTime())) return false;
          if (d < new Date(startDateFilter)) return false;
        }
        if (endDateFilter) {
          const d = new Date(post.date || post.created_at || "");
          if (isNaN(d.getTime())) return false;
          if (d > new Date(endDateFilter)) return false;
        }
        // query
        if (term) {
          const name = (post.item_name || "").toLowerCase();
          if (!name.includes(term)) return false;
        }
        return true;
      });
      setDisplayedPosts(filtered);
      setLoading(false);
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [query, typeFilter, categoryFilter, startDateFilter, endDateFilter, posts]);

  // open popup -> initialize temps
  const openPopup = () => {
    setTempType(typeFilter);
    setTempCategory(categoryFilter);
    setTempStart(startDateFilter);
    setTempEnd(endDateFilter);
    setPopupOpen(true);
  };

  const closePopupApply = () => {
    setTypeFilter(tempType);
    setCategoryFilter(tempCategory);
    setStartDateFilter(tempStart);
    setEndDateFilter(tempEnd);
    setPopupOpen(false);
  };

  const clearTempFilters = () => {
    setTempType("all");
    setTempCategory(null);
    setTempStart("");
    setTempEnd("");
  };

  // clicking outside closes popup and applies
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!popupOpen) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closePopupApply();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [popupOpen, tempType, tempCategory, tempStart, tempEnd]);

  const applyNow = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 150);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 mb-4">
        <input
          aria-label="Search posts"
          placeholder="Search by item name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-sm border px-3 py-2"
        />

        <button
          aria-label="Open filters"
          onClick={openPopup}
          className="inline-flex items-center justify-center rounded border px-2 py-2 cursor-pointer"
        >
          <Filter />
        </button>

        <Button onClick={applyNow} className="shrink-0 cursor-pointer">
          Search
        </Button>
      </div>

      {popupOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border bg-white p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-medium">Filters</h3>
            <button
              aria-label="Close filters"
              onClick={() => setPopupOpen(false)}
              className="p-1"
            >
              <X />
            </button>
          </div>

          <div className="mt-3 space-y-3">
            <label className="block text-sm">
              Type
              <select
                className="mt-1 w-full rounded border px-2 py-1"
                value={tempType}
                onChange={(e) => setTempType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </label>

            <label className="block text-sm">
              Category
              <select
                className="mt-1 w-full rounded border px-2 py-1"
                value={tempCategory ?? "null"}
                onChange={(e) => setTempCategory(e.target.value === "null" ? null : e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={String(c.value)} value={c.value ?? "null"}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="block text-sm">
                From
                <input
                  type="date"
                  className="mt-1 w-full rounded border px-2 py-1"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                To
                <input
                  type="date"
                  className="mt-1 w-full rounded border px-2 py-1"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                />
              </label>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={clearTempFilters}>
                Clear
              </Button>
              <div>
                <Button onClick={closePopupApply}>Apply</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="h-30 flex items-center justify-center">
          <svg className="h-6 w-6 animate-spin text-muted-foreground" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      ) : displayedPosts.length === 0 ? (
        <div className="h-30 flex flex-col items-center justify-center">
          <p className="text-muted-foreground text-sm">No items found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedPosts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <PostCard post={post} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}