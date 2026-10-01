import { ListVideo } from "lucide-react";
import { Link } from "react-router-dom";
import type { Playlist } from "../../api/types";
import { timeAgo } from "../../utils/timeAgo";

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const count = playlist.videos.length;

  return (
    <Link to={`/playlist/${playlist._id}`} className="group block">
      <div className="relative mb-3 aspect-video rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#111] border border-gray-800 flex items-center justify-center overflow-hidden">
        <ListVideo className="w-10 h-10 text-gray-500 group-hover:text-white transition-colors" />
        <span className="absolute bottom-1.5 right-1.5 rounded px-1.5 py-0.5 text-xs font-medium bg-black/80 text-white">
          {count} {count === 1 ? "video" : "videos"}
        </span>
      </div>
      <h3 className="text-[15px] font-semibold text-white line-clamp-1">{playlist.name}</h3>
      {playlist.description && <p className="text-sm text-gray-400 line-clamp-1">{playlist.description}</p>}
      <p className="text-xs text-gray-500 mt-0.5">Updated {timeAgo(playlist.updatedAt)}</p>
    </Link>
  );
}
