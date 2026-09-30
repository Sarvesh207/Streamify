import {
  Edit2,
  Eye,
  Heart,
  Plus,
  Trash2,
  Users
} from "lucide-react";
import { useState } from "react";
import UploadVideoModal from "../components/UploadVideoModal";
import EditVideoModal from "../components/EditVideoModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { getMyVideos } from "../api/video.api";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "../utils/formateDate";
import { useTogglePublishStatus } from "../hooks/useVideoMutations";
import type { Video } from "../api/types";

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.user);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Track which video is currently toggling
  const [togglingVideoId, setTogglingVideoId] = useState<string | null>(null);

  const togglePublishMutation = useTogglePublishStatus();

  const {
    data: myVideoData,
    isLoading: videoLoading,
    error: videoError,
  } = useQuery({
    queryKey: ["getMyVideos", user?.username],
    queryFn: () => getMyVideos(1, 10, "", "createdAt", "desc", "", "all"),
    enabled: !!user?.username,
  });

  const { videos } = myVideoData || {};

  const handleTogglePublish = (videoId: string) => {
    setTogglingVideoId(videoId);
    togglePublishMutation.mutate(videoId, {
      onSettled: () => {
        setTogglingVideoId(null);
      },
    });
  };

  const handleEditClick = (video: Video) => {
    setSelectedVideo(video);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (video: Video) => {
    setSelectedVideo(video);
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedVideo(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedVideo(null);
  };

  if (videoLoading) return <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">Loading...</div>;

  if (videoError) return <div className="min-h-screen bg-black text-white p-6">Error: {videoError.message}</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.fullName}</h1>
          <p className="text-gray-400 text-sm">
            Measure video reach, watch time, and audience behavior effortlessly.</p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-5 py-2.5 rounded-lg font-medium transition-colors w-fit"
        >
          <Plus size={20} />
          Upload Video
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Views */}
        <div className="bg-black border border-gray-800 p-6 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
            <Eye className="text-white w-5 h-5" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Views</p>
          <h2 className="text-3xl font-bold">221,234</h2>
        </div>

        {/* Total Followers */}
        <div className="bg-black border border-gray-800 p-6 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
            <Users className="text-white w-5 h-5" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Followers</p>
          <h2 className="text-3xl font-bold">4,053</h2>
        </div>

        {/* Total Likes */}
        <div className="bg-black border border-gray-800 p-6 rounded-xl relative overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
            <Heart className="text-white w-5 h-5" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Likes</p>
          <h2 className="text-3xl font-bold">63,021</h2>

          {/* Decorative r circle from image */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-8 border-gray-800/50 flex items-center justify-center">
            <span className="text-gray-700 font-bold text-4xl">r</span>
          </div>
        </div>
      </div>

      {/* Video Table */}
      <div className="border border-gray-800 rounded-xl overflow-hidden bg-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Publish Status</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Uploaded</th>
                <th className="p-4 font-medium">Date uploaded</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {videos && videos.map((video) => (
                <tr
                  key={video._id}
                  className="group hover:bg-gray-900/50 transition-colors"
                >
                  {/* Toggle Switch Column */}
                  <td className="p-4">
                    <button
                      onClick={() => handleTogglePublish(video._id)}
                      disabled={togglingVideoId === video._id}
                      className={`
                        relative w-12 h-6 rounded-full transition-all duration-300 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
                        disabled:opacity-60 disabled:cursor-not-allowed
                        ${video.isPublished
                          ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50"
                          : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)] ring-1 ring-rose-400/50"
                        }
                      `}
                      role="switch"
                      aria-checked={video.isPublished}
                      aria-label={`Toggle publish status for ${video.title}`}
                    >
                      {/* Loading spinner overlay */}
                      {togglingVideoId === video._id && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                        </span>
                      )}

                      {/* Toggle knob */}
                      <span
                        className={`
                          absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md
                          transition-transform duration-300 ease-in-out
                          ${video.isPublished ? "translate-x-6" : "translate-x-0"}
                          ${togglingVideoId === video._id ? "opacity-0" : "opacity-100"}
                        `}
                      />
                    </button>
                  </td>

                  {/* Status Badge Column */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs border ${video.isPublished === true
                        ? "border-green-500/30 text-green-400 bg-green-500/10"
                        : "border-orange-500/30 text-orange-400 bg-orange-500/10"
                        }`}
                    >
                      {video.isPublished ? "Published" : "Unpublished"}
                    </span>
                  </td>

                  {/* Uploaded Video Info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3 min-w-[240px]">
                      <img
                        src={video.thumbnail.url}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span title={video.title} className="text-sm font-medium text-white truncate max-w-[200px]">
                        {video.title}
                      </span>
                    </div>
                  </td>

                  {/* Date Uploaded */}
                  <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                    {formatDate(video.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleDeleteClick(video)}
                        className="text-gray-500 hover:text-red-500 transition-colors p-1"
                        aria-label={`Delete ${video.title}`}
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => handleEditClick(video)}
                        className="text-gray-500 hover:text-white transition-colors p-1"
                        aria-label={`Edit ${video.title}`}
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <UploadVideoModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <EditVideoModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        video={selectedVideo}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        video={selectedVideo}
      />
    </div>
  );
}
