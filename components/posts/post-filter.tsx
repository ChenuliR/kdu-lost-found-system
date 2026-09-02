"use client";

import { Filter, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import PostCard from "./post-card";

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
  // Search state
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedPosts, setDisplayedPosts] = useState<any[]>(posts ?? []);

  // Active filters (applied when popup closes/applies)
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");

  // Popup state and temporary values
  const [popupOpen, setPopupOpen] = useState(false);
  const [tempType, setTempType] = useState<string>(typeFilter);
  const [tempCategory, setTempCategory] = useState<string | null>(
    categoryFilter,
  );
  const [tempStart, setTempStart] = useState<string>(startDateFilter);
  const [tempEnd, setTempEnd] = useState<string>(endDateFilter);
  const [filterApplied, setFilterApplied] = useState<boolean>(false);

  useEffect(() => {
    setDisplayedPosts(posts ?? []);
  }, [posts]);

  // Synchronize temporary states whenever the popup is opened
  useEffect(() => {
    if (popupOpen) {
      setTempType(typeFilter);
      setTempCategory(categoryFilter);
      setTempStart(startDateFilter);
      setTempEnd(endDateFilter);
    }
  }, [popupOpen, typeFilter, categoryFilter, startDateFilter, endDateFilter]);

  // Apply active filters + search query (debounced)
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const timer = setTimeout(() => {
      if (!mounted) return;
      const term = query.trim().toLowerCase();
      const filtered = (posts || []).filter((post) => {
        // Type filter
        if (typeFilter !== "all" && post.type !== typeFilter) return false;

        // Category filter
        if (
          categoryFilter &&
          categoryFilter !== "all" &&
          post.category !== categoryFilter
        ) {
          return false;
        }

        // Date range filter
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

        // Search query filter
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
  }, [
    query,
    typeFilter,
    categoryFilter,
    startDateFilter,
    endDateFilter,
    posts,
  ]);

  const closePopupApply = () => {
    setTypeFilter(tempType);
    setCategoryFilter(tempCategory);
    setStartDateFilter(tempStart);
    setEndDateFilter(tempEnd);
    setPopupOpen(false);

    if (
      tempType !== "all" ||
      tempCategory !== null ||
      tempStart !== "" ||
      tempEnd !== ""
    ) {
      setFilterApplied(true);
    } else {
      setFilterApplied(false);
    }
  };

  const clearTempFilters = () => {
    setTempType("all");
    setTempCategory(null);
    setTempStart("");
    setTempEnd("");
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <input
            aria-label="Search posts"
            placeholder="Search by item name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-2xl rounded-sm border px-3 py-2 text-sm"
          />

          <DropdownMenu open={popupOpen} onOpenChange={setPopupOpen}>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open filters"
                  className="relative inline-flex items-center justify-center rounded border px-2 py-2 cursor-pointer"
                >
                  <Filter />
                  {filterApplied && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </Button>
              }
            />
            <DropdownMenuContent className="w-80 p-4">
              <div className="space-y-4">
                <label className="block text-sm">
                  Type
                  <select
                    className="mt-2 w-full rounded border px-2 py-1"
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
                    className="mt-2 w-full rounded border px-2 py-1"
                    value={tempCategory ?? "null"}
                    onChange={(e) =>
                      setTempCategory(
                        e.target.value === "null" ? null : e.target.value,
                      )
                    }
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
                      className="mt-2 w-full rounded border px-2 py-1"
                      value={tempStart}
                      onChange={(e) => setTempStart(e.target.value)}
                    />
                  </label>
                  <label className="block text-sm">
                    To
                    <input
                      type="date"
                      className="mt-2 w-full rounded border px-2 py-1"
                      value={tempEnd}
                      onChange={(e) => setTempEnd(e.target.value)}
                    />
                  </label>
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={clearTempFilters}
                    className="cursor-pointer"
                  >
                    Clear
                  </Button>
                  <Button onClick={closePopupApply} className="cursor-pointer">
                    Apply
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link href="/posts/new">
          <Button className="cursor-pointer">
            <Plus />
            <span>Create Post</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="h-30 flex items-center justify-center">
          <svg
            className="h-6 w-6 animate-spin text-muted-foreground"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      ) : displayedPosts.length === 0 ? (
        <div className="h-30 flex flex-col items-center justify-center">
          <p className="text-muted-foreground text-sm">
            No items found matching your search.
          </p>
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
