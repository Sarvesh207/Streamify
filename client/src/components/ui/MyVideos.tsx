import { useQuery } from "@tanstack/react-query";
import { getMyVideos } from "../../api/video.api";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import React, { useState } from "react";
import { Play, Plus } from "lucide-react";
import VideoCard from "./VideoCard";
import { Link } from "react-router-dom";

interface MyVideosProps {
  setIsUploadModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function MyVideos({ setIsUploadModalOpen }: MyVideosProps) {
  const [activeTab, setActiveTab] = useState("Videos");
  const [activeFilter, setActiveFilter] = useState("Previously uploaded");
  const user = useSelector((state: RootState) => state.user);
  const videoFilters = ["Previously uploaded", "Oldest"];
  const tabs = ["Videos", "Playlist", "Tweets", "Following"];
  const {
    data: myVideoData,
    isLoading: videoLoading,
    error: videoError,
  } = useQuery({
    queryKey: ["getMyVideos", user?.username],
    queryFn: () => getMyVideos(),
    enabled: !!user?.username,
  });

  const { videos } = myVideoData || {};
  console.log(videos, videoLoading, videoError, myVideoData);
  return (
    <>
      <div className="border-b border-gray-800 px-4 md:px-8">
        <div className="flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm md:text-base font-medium whitespace-nowrap relative px-2 transition-colors ${activeTab === tab
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Videos" && (
        <div className="p-4 md:p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
              {videoFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === filter
                      ? "bg-[#2a2a2a] hover:bg-[#3f3f3f] text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            {videos && videos.length > 0 && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3f3f3f] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0"
              >
                <Plus size={18} />
                <span>New video</span>
              </button>
            )}
          </div>

          {videos && videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                <Play className="w-8 h-8 text-white fill-current" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No videos uploaded
              </h3>
              <p className="text-gray-400 max-w-sm mb-8">
                Click to upload new video. You have yet to upload a video.
              </p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#2a2a2a] hover:bg-[#3f3f3f] text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                <Plus size={20} />
                <span>New video</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos &&
                videos.map((video) => (
                  <Link
                    to={`/video/${video._id}`}
                    key={video._id}
                    className="block hover:no-underline"
                  >
                    <VideoCard video={video} />
                  </Link>
                ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default MyVideos;
