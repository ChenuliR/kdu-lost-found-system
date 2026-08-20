"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import PostCard from "./post-card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PostFilter({ posts }: { posts: any[] }) {
    const router = useRouter()
  const [filter, setFilter] = useState<PostTypeFilter>("all");

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true;
    return post.type === filter;
  });

  const handleFilterChange = (value: string | null) => {
    setFilter(value?.toLowerCase() as PostTypeFilter ?? "all");
  };

  return (
    <div>
      <div className="flex justify-between gap-2 mb-4">
        {
          <Select value={filter.charAt(0).toUpperCase() + filter.slice(1)} onValueChange={handleFilterChange}>
            <SelectTrigger id="filter" className={"w-45"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {(["all", "lost", "found"] as const).map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        }
        <Button onClick={() => router.push("/posts/new")} className="cursor-pointer">
            <Plus />
            <span>Create Post</span>
        </Button>
      </div>
      {filteredPosts.length === 0 ? (
        <div className="h-30 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No posts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 flex-wrap gap-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
