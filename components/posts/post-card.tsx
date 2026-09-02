import { Calendar } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

export default function PostCard({ post }: { post: any }) {
  return (
    <div className="dark:bg-muted-foreground/10 dark:hover:bg-muted-foreground/15 rounded-sm shadow overflow-hidden hover:shadow-lg transition-all border-2 border-primary-foreground line-clamp-2 leading-[1.7rem] flex flex-col h-full">
      {/* Image Container */}
      <div className="relative w-full h-64 bg-gray-200">
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.item_name}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex flex-col flex-1 justify-between">
        {/* Title */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-lg">{post.item_name}</h3>
            <Badge
              variant={post.status === "Active" ? "secondary" : "outline"}
              className="shrink-0"
            >
              {post.status ?? "Active"}
            </Badge>
          </div>
          {/* Description */}
          <p className="text-primary/80 text-sm line-clamp-2 min-h-10 leading-5">
            {post.description}
          </p>
        </div>

        <div className="space-y-3">
          <Separator />
          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-primary/70">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString()}
            </span>
            <Badge
              variant={"outline"}
              className="text-primary/70 border-primary-background"
            >
              {post.category}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
