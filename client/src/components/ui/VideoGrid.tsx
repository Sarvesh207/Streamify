import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Video } from "../../api/types";
import VideoCard from "./VideoCard";

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
  emptyMessage?: ReactNode;
}

export default function VideoGrid({ videos, isLoading, emptyMessage = "No videos yet." }: VideoGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (videos.length === 0) {
    return <div className="py-20 text-center text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <Link to={`/video/${video._id}`} key={video._id} className="block hover:no-underline">
          <VideoCard video={video} />
        </Link>
      ))}
    </div>
  );
}
