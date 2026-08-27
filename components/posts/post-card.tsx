import Image from "next/image";
import { Separator } from "../ui/separator";
import { Calendar } from "lucide-react";
import { Badge } from "../ui/badge";

export default function PostCard({ post }: { post: any }) {
  return (
    <div className="bg-white rounded-sm shadow overflow-hidden hover:shadow-lg transition-shadow">
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
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-lg">{post.item_name}</h3>
          <Badge
            variant={post.status === "Active" ? "secondary" : "outline"}
            className="shrink-0"
          >
            {post.status ?? "Active"}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">{post.description}</p>

        <Separator />

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(post.date).toLocaleDateString()}
          </span>
          <Badge variant={"outline"}>{post.category}</Badge>
        </div>
      </div>
    </div>
  );
}
