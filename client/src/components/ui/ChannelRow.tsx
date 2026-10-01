import { Link } from "react-router-dom";
import type { ChannelSummary } from "../../api/types";
import Avatar from "./Avatar";

// A compact channel entry used in subscription lists and search results
export default function ChannelRow({ channel, action }: { channel: ChannelSummary; action?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
      <Link to={`/c/${channel.username}`} className="flex items-center gap-4 flex-1 min-w-0">
        <Avatar src={channel.avatar?.url} name={channel.username} className="w-14 h-14" />
        <div className="min-w-0">
          <h3 className="font-semibold text-white truncate">{channel.fullName || channel.username}</h3>
          <p className="text-sm text-gray-400 truncate">@{channel.username}</p>
        </div>
      </Link>
      {action}
    </div>
  );
}
