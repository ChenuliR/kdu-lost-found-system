"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import PostCard from "./post-card";
import Link from "next/link";

export default function PostFilter({ posts }: { posts: any[] }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedPosts, setDisplayedPosts] = useState<any[]>(posts ?? []);

  useEffect(() => setDisplayedPosts(posts ?? []), [posts]);

  // debounced search by item_name only
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const timer = setTimeout(() => {
      if (!mounted) return;
      const term = query.trim().toLowerCase();
      const filtered = (posts || []).filter((post) => {
        if (!term) return true;
        const name = (post.item_name || "").toLowerCase();
        return name.includes(term);
      });
      setDisplayedPosts(filtered);
      setLoading(false);
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [query, posts]);

  const applyNow = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 150);
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-4">
        <input
          aria-label="Search posts"
          placeholder="Search by item name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-[80%] rounded-sm border px-3 py-2"
        />
        <Button onClick={applyNow} className="w-[15%] p">
          Search
        </Button>
      </div>

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