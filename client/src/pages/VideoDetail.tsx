import { useRef, useState } from "react";
import {
  Heart,
  ListPlus,
  Send,
} from "lucide-react";
import { useParams } from "react-router-dom";
import SaveToPlaylistModal from "../components/SaveToPlaylistModal";
import VideoJS from "../components/videoJSPlayer";
import useVideoById from "../hooks/useVideoById";
import useToggleVideoLike from "../hooks/useToggleVideoLike";
import { timeAgo } from "../utils/timeAgo";

export default function VideoDetail() {
  const { id } = useParams();
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Up next");
  const [autoplay, setAutoplay] = useState(true);

  // React Query 
  const { data: video, isLoading, isError } = useVideoById(id || "");
  const toggleLikeMutation = useToggleVideoLike();

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
    toggleLikeMutation.mutate(id);
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
                onClick={() => setIsPlaylistModalOpen(true)}
                className="hover:text-gray-300 transition-colors" title="Save to playlist">
                <ListPlus size={26} strokeWidth={1.5} />
              </button>
              <button className="hover:text-gray-300 transition-colors" title="Share">
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
          />

          {/* Row 3: Channel Info | Subscribe */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <img
                src={ownerAvatar || `https://ui-avatars.com/api/?name=${ownerUsername}&background=random`}
                alt="Channel Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <h3 className="font-bold text-[17px] text-white flex items-center gap-1.5">
                  {ownerFullName}
                  <span className="bg-[#3ca2ff] rounded-full p-[2px] flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                </h3>
                <span className="text-[13px] text-gray-400 font-medium">864k Subscribers</span>
              </div>
            </div>

            <button className="bg-[#2a2a2a] hover:bg-[#3f3f3f] text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-all">
              Subscribe
            </button>
          </div>

          {/* Row 4: Description */}
          <div className="space-y-3 pb-6 border-b border-white/5">
            <h3 className="text-white font-bold text-[17px]">Description</h3>
            <div className="text-gray-400 leading-relaxed font-light text-[15px] space-y-4">
              <p className="whitespace-pre-wrap">{description || "No description provided."}</p>
              <p className="text-sm text-gray-500">
                Music video by {ownerFullName} performing {title}. (C) 2023 Feel the Music Ltd.
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8">
            <div className="flex items-center gap-6 mb-8">
              <h2 className="text-[17px] font-bold text-white">634 comments</h2>
              <button className="flex items-center gap-2 text-sm text-white font-medium hover:text-gray-300"><ListPlus size={18} className="rotate-180" /> Sort by</button>
            </div>

            <div className="flex gap-4 items-start mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shrink-0">U</div>
              <div className="flex-1 border-b border-white/20 pb-2 focus-within:border-white transition-colors">
                <input type="text" placeholder="Add a comment..." className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500" />
              </div>
            </div>

            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-800 shrink-0 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex gap-2 items-center mb-1">
                      <span className="font-semibold text-white text-sm">Vincent Taylor</span>
                      <span className="text-xs text-gray-500">2 days ago • 8 likes</span>
                    </div>
                    <p className="text-[14px] text-gray-300 leading-relaxed max-w-2xl font-light">
                      This music video is amazing! The scenography, colors, and captivating storytelling make it a true work of art.
                    </p>
                    <div className="flex items-center gap-5 mt-2.5">
                      <button className="text-gray-400 hover:text-white transition-colors"><Heart size={14} /></button>
                      <button className="text-gray-400 hover:text-white transition-colors text-xs font-semibold">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Recommendations */}
      <div className="lg:col-span-1 pl-2">
        {/* Filters */}
        <div className="flex items-center gap-2.5 mb-6 overflow-x-auto no-scrollbar">
          {["Up next", "Top trending", "Olivia Knight", "Riverside"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap ${activeTab === tab ? "bg-white text-black" : "bg-[#272727] text-white hover:bg-[#3f3f3f]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="text-gray-300 text-sm font-medium">Autoplay</h3>
          <div
            onClick={() => setAutoplay(!autoplay)}
            className={`w-9 h-5 rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${autoplay ? "bg-emerald-500" : "bg-gray-700"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${autoplay ? "translate-x-4" : "translate-x-0"}`} />
          </div>
        </div>

        {/* Video List */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex gap-3 cursor-pointer group">
              <div className="relative w-[160px] aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-800">
                <img
                  src={`https://picsum.photos/300/180?random=${i + 15}`}
                  alt="Thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-[2px] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] tracking-wide">
                  3:4{i}
                </span>
              </div>
              <div className="flex flex-col min-w-0 py-0.5">
                <h4 className="font-bold text-[14px] text-white group-hover:text-gray-200 line-clamp-2 leading-tight mb-1">
                  Street Revolution - Urban Culture Documentary
                </h4>
                <p className="text-xs text-gray-400 hover:text-white transition-colors">Jazzy J <span className="inline-block w-2.5 h-2.5 bg-gray-500 rounded-full text-[8px] text-center leading-[10px] text-black align-middle ml-0.5">✓</span></p>
                <p className="text-xs text-gray-500 mt-0.5">21 days ago • 6.1m views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
