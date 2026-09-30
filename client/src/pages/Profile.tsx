import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Edit2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserChannelData } from "../api/user.api";
import MyVideos from "../components/ui/MyVideos";
import UploadVideoModal from "../components/UploadVideoModal";
import type { RootState } from "../store/store";

export default function Profile() {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();


  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const {
    data: userChannelData,
    isLoading: userChannelLoading,
    error: userChannelError,
  } = useQuery({
    queryKey: ["userChannelData", user?.username],
    queryFn: () => getUserChannelData(user?.username || ""),
    enabled: !!user?.username,
  });

  function handleEditClick() {
    navigate("/settings");
  }

  if (userChannelError) {
    return (
      <div>
        <p>Something went wrong</p>
      </div>
    );
  }

  if (userChannelLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!userChannelData) {
    return (
      <div>
        <p>No data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white w-full">
      {user?.coverImage?.url ? (
        <div className="w-full h-32 md:h-48 lg:h-64 relative">
          <img
            src={user.coverImage.url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-32 md:h-48 lg:h-64 bg-gradient-to-r from-pink-500 via-orange-400 to-cyan-400"></div>
      )}

      <div className="px-4 md:px-8 -mt-10 md:-mt-16 mb-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
          <div className="relative group">
            <img
              src={user?.avatar?.url}
              alt="Profile"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold">
                {user?.fullName}
              </h1>
              <CheckCircle
                className="w-5 h-5 text-blue-500 hidden md:block"
                fill="currentColor"
                color="white"
              />
            </div>
            <p className="text-gray-400 mt-1">{user?.username}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-400 mt-1">
              <span>{userChannelData?.subscribersCount} Subscribers</span>
              <span>•</span>
              <span>
                {userChannelData?.channelsSubscribedToCount} Subscribed
              </span>
            </div>
          </div>

          <div className="mt-4 md:mt-0 mb-4 md:mb-6 shrink-0">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-6 py-2 bg-[#2a2a2a] hover:bg-[#3f3f3f] text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>

      <MyVideos setIsUploadModalOpen={setIsUploadModalOpen} />

      <UploadVideoModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={() => {}}
      />

      {/* {activeTab !== "Videos" && (
        <div className="p-12 text-center text-gray-500">
          Content for {activeTab} tab
        </div>
      )} */}
    </div>
  );
}
