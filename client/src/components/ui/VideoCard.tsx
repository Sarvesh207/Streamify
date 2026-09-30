import { EllipsisVertical } from "lucide-react";
import type { Video } from "../../api/types";
import { timeAgo } from "../../utils/timeAgo";

import { formatDuration } from "../../utils/formatDuration";

function VideoCard({ video }: { video: Video }) {
  const thumbnail =
    typeof video.thumbnail === "string" ? video.thumbnail : video.thumbnail?.url;
  const owner = typeof video.owner === "string" ? null : video.owner;
  const avatar = owner?.avatar?.url;
  const username = owner?.username;
  const fullName = owner?.fullName;

  return (
    <div className="group cursor-pointer">
      <div className="relative mb-3 overflow-hidden rounded-xl aspect-video bg-[#1a1a1a]">
        <img
          src={thumbnail}
          alt={video?.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-1.5 right-1.5 rounded px-1.5 py-0.5 text-xs font-medium bg-black/80 text-white shadow-sm backdrop-blur-[2px]">
          {formatDuration(video?.duration)}
        </div>
      </div>
      <div className="flex gap-3 items-start">
        <img
          src={avatar}
          alt={username}
          className="object-cover rounded-full w-9 h-9 border border-transparent group-hover:border-gray-500/50 transition-colors"
        />
        <div className="flex-1 min-w-0">
          <h3 className="mb-1 text-[15px] font-semibold leading-snug text-white line-clamp-2 group-hover:text-white/90">
            {video?.title}
          </h3>
          <div className="text-sm text-gray-400">
            <div className="hover:text-gray-300 transition-colors truncate">
              {fullName || username}
            </div>
            <div className="flex items-center text-xs mt-0.5 text-gray-400/80">
              <span className="text-gray-400">{video.views} views</span>
              <span className="mx-1">•</span>
              <span className="text-gray-400">{timeAgo(video?.createdAt)}</span>
            </div>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-full transition-all duration-200">
          <EllipsisVertical className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

export default VideoCard;
