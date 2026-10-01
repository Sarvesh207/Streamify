import { useRef, useState } from "react";
import {
  Heart,
  ListPlus,
  Send,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentSection from "../components/comments/CommentSection";
import SaveToPlaylistModal from "../components/SaveToPlaylistModal";
import SubscribeButton from "../components/SubscribeButton";
import Avatar from "../components/ui/Avatar";
import { formatDuration } from "../utils/formatDuration";
import useFeed from "../hooks/useFeed";
import type { RootState } from "../store/store";
import VideoJS from "../components/videoJSPlayer";
import useVideoById from "../hooks/useVideoById";
import useToggleVideoLike from "../hooks/useToggleVideoLike";
import { timeAgo } from "../utils/timeAgo";

export default function VideoDetail() {
  const { id } = useParams();
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  // React Query 
  const { data: video, isLoading, isError } = useVideoById(id || "");
  const toggleLikeMutation = useToggleVideoLike();
  const { data: feed } = useFeed();

  const playerRef = useRef(null);



  if (isLoading) return <div className="flex items-center justify-center p-20 text-gray-400">Loading...</div>;
  if (isError || !video) return <div className="flex items-center justify-center p-20 text-red-400">Video unavailable.</div>;

  const { title, videoFile, views, createdAt, description, owner } = video;

  const displayLiked = video.isLikedByMe ?? false;
  const displayLikesCount = video.likeCount ?? 0;

  const videoUrl = typeof videoFile === "string" ? videoFile : videoFile?.url;
  const ownerAvatar = typeof owner === "string" ? undefined : owner?.avatar?.url;
  const ownerUsername = typeof owner === "string" ? undefined : owner?.username || "Unknown";
  const ownerFullName = typeof owner === "string" ? undefined : owner?.fullName || ownerUsername;
  const subscribersCount = owner?.subscribersCount ?? 0;

  const upNext = (feed?.pages.flatMap((page) => page.videos) ?? []).filter((v) => v._id !== id).slice(0, 10);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: videoUrl ? [{ src: videoUrl, type: "video/mp4" }] : [],
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
  };

  const handleLike = () => {
    if (!id) return;
    if (!user) {
      navigate("/login");
      return;
    }
    toggleLikeMutation.mutate(id);
  };

  const handleSaveToPlaylist = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsPlaylistModalOpen(true);
  };

  const formatViews = (count = 0) => {
    // Format to match "64.572 views" style roughly, or keep simpler
    return count.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 max-w-[1600px] mx-auto px-6">
      {/* LEFT SIDE: Main Content */}
      <div className="lg:col-span-2 space-y-5">

        {/* Video Player */}
        <div className="rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/5 aspect-video relative z-10">
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </div>

        {/* Video Metadata Section - Matching User Image */}
        <div className="px-1">
          {/* Row 1: Time • Views | Likes */}
          <div className="flex items-center justify-between text-[13px] text-gray-400 font-medium mb-3">
            <div className="flex items-center gap-1">
              <span>{timeAgo(createdAt)}</span>
              <span>•</span>
              <span>{formatViews(views)} views</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#ff4e4e]">
              <Heart size={14} fill={displayLiked ? "currentColor" : "none"} />
              <span>{displayLikesCount} likes</span>
            </div>
          </div>

          {/* Row 2: Title | Actions */}
          <div className="flex items-start justify-between gap-6 mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight leading-tight flex-1">
              {title}
            </h1>
            <div className="flex items-center gap-5 pt-1.5 text-white">
              <button
                onClick={handleSaveToPlaylist}
                className="hover:text-gray-300 transition-colors" title="Save to playlist">
                <ListPlus size={26} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="hover:text-gray-300 transition-colors" title="Copy link">
                <Send size={24} strokeWidth={1.5} className="-rotate-45 mb-1" />
              </button>
              <button onClick={handleLike} className={`${displayLiked ? "text-[#ff4e4e]" : "hover:text-gray-300"} transition-colors`} title={displayLiked ? "Unlike" : "Like"}>
                <Heart size={26} strokeWidth={1.5} fill={displayLiked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <SaveToPlaylistModal
            isOpen={isPlaylistModalOpen}
            onClose={() => setIsPlaylistModalOpen(false)}
            videoId={id || ""}
          />

          {/* Row 3: Channel Info | Subscribe */}
          <div className="flex items-center justify-between mb-10">
            <Link to={`/c/${ownerUsername}`} className="flex items-center gap-3 group">
              <Avatar src={ownerAvatar} name={ownerUsername} className="w-12 h-12" />
              <div className="flex flex-col">
                <h3 className="font-bold text-[17px] text-white group-hover:underline">
                  {ownerFullName}
                </h3>
                <span className="text-[13px] text-gray-400 font-medium">
                  {subscribersCount.toLocaleString()} {subscribersCount === 1 ? "Subscriber" : "Subscribers"}
                </span>
              </div>
            </Link>

            {owner?._id && <SubscribeButton channelId={owner._id} isSubscribed={owner.isSubscribed} />}
          </div>

          {/* Row 4: Description */}
          <div className="space-y-3 pb-6 border-b border-white/5">
            <h3 className="text-white font-bold text-[17px]">Description</h3>
            <div className="text-gray-400 leading-relaxed font-light text-[15px] space-y-4">
              <p className="whitespace-pre-wrap">{description || "No description provided."}</p>
            </div>
          </div>

          {/* Comments Section */}
          {id && <CommentSection videoId={id} />}
        </div>
      </div>

      {/* RIGHT SIDE: Up next */}
      <div className="lg:col-span-1 pl-2">
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="text-white text-[15px] font-bold">Up next</h3>
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm font-medium">Autoplay</span>
            <div
              onClick={() => setAutoplay(!autoplay)}
              className={`w-9 h-5 rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${autoplay ? "bg-emerald-500" : "bg-gray-700"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${autoplay ? "translate-x-4" : "translate-x-0"}`} />
            </div>
          </div>
        </div>

        {/* Video List */}
        <div className="space-y-4">
          {upNext.length === 0 && <p className="text-sm text-gray-500 px-1">No other videos yet.</p>}
          {upNext.map((next) => (
            <Link key={next._id} to={`/video/${next._id}`} className="flex gap-3 cursor-pointer group">
              <div className="relative w-[160px] aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-800">
                <img
                  src={next.thumbnail?.url}
                  alt={next.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-[2px] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] tracking-wide">
                  {formatDuration(next.duration)}
                </span>
              </div>
              <div className="flex flex-col min-w-0 py-0.5">
                <h4 className="font-bold text-[14px] text-white group-hover:text-gray-200 line-clamp-2 leading-tight mb-1">
                  {next.title}
                </h4>
                <p className="text-xs text-gray-400">{next.owner?.fullName || next.owner?.username}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {timeAgo(next.createdAt)} • {formatViews(next.views)} views
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
