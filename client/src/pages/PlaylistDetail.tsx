import { Loader2, Pencil, Play, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Avatar from "../components/ui/Avatar";
import { useDeletePlaylist, usePlaylist, useTogglePlaylistVideo, useUpdatePlaylist } from "../hooks/usePlaylists";
import type { RootState } from "../store/store";
import { formatDuration } from "../utils/formatDuration";
import { timeAgo } from "../utils/timeAgo";

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const { data: playlist, isLoading, isError } = usePlaylist(id);
  const updatePlaylist = useUpdatePlaylist();
  const deletePlaylist = useDeletePlaylist();
  const removeVideo = useTogglePlaylistVideo(user?._id);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }
  if (isError || !playlist) return <p className="py-20 text-center text-red-400">Playlist not found.</p>;

  const isOwner = user?._id === playlist.owner?._id;
  const firstVideo = playlist.videos[0];

  const startEditing = () => {
    setName(playlist.name);
    setDescription(playlist.description ?? "");
    setIsEditing(true);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updatePlaylist.mutate(
      { playlistId: playlist._id, name: name.trim(), description: description.trim() },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete "${playlist.name}"? This can't be undone.`)) return;
    deletePlaylist.mutate(playlist._id, { onSuccess: () => navigate("/collection") });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Playlist info */}
      <aside className="lg:col-span-1">
        <div className="bg-gradient-to-b from-[#2a2a2a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6 lg:sticky lg:top-24">
          <div className="aspect-video rounded-xl overflow-hidden bg-[#1a1a1a] mb-5">
            {firstVideo && <img src={firstVideo.thumbnail?.url} alt="" className="w-full h-full object-cover" />}
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Playlist name"
                className="w-full bg-[#1a1a1a] text-white px-3 py-2 rounded-lg outline-none border border-white/10 focus:border-white/30"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                aria-label="Playlist description"
                className="w-full bg-[#1a1a1a] text-white px-3 py-2 rounded-lg outline-none border border-white/10 focus:border-white/30 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-sm text-gray-300 hover:text-white">
                  Cancel
                </button>
                <button type="submit" disabled={!name.trim()} className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-white text-black disabled:opacity-50">
                  Save
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2 break-words">{playlist.name}</h1>
              {playlist.description && <p className="text-sm text-gray-400 mb-4 whitespace-pre-wrap">{playlist.description}</p>}
            </>
          )}

          <Link to={`/c/${playlist.owner?.username}`} className="flex items-center gap-2 mb-3 hover:underline">
            <Avatar src={playlist.owner?.avatar?.url} name={playlist.owner?.username} className="w-6 h-6" />
            <span className="text-sm text-white font-medium">{playlist.owner?.fullName || playlist.owner?.username}</span>
          </Link>
          <p className="text-xs text-gray-400 mb-5">
            {playlist.totalVideos} videos • {playlist.totalViews.toLocaleString()} views • Updated {timeAgo(playlist.updatedAt)}
          </p>

          <div className="flex items-center gap-2">
            {firstVideo && (
              <Link
                to={`/video/${firstVideo._id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200"
              >
                <Play size={16} fill="currentColor" /> Play all
              </Link>
            )}
            {isOwner && !isEditing && (
              <>
                <button onClick={startEditing} className="p-2.5 rounded-full bg-[#2a2a2a] hover:bg-[#3f3f3f] text-white" aria-label="Edit playlist">
                  <Pencil size={16} />
                </button>
                <button onClick={handleDelete} className="p-2.5 rounded-full bg-[#2a2a2a] hover:bg-red-600 text-white" aria-label="Delete playlist">
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Videos */}
      <section className="lg:col-span-2 space-y-3">
        {playlist.videos.length === 0 && <p className="py-20 text-center text-gray-500">This playlist has no videos yet.</p>}
        {playlist.videos.map((video, index) => (
          <div key={video._id} className="flex items-center gap-3 group rounded-xl p-2 hover:bg-white/5">
            <span className="w-6 text-center text-sm text-gray-500">{index + 1}</span>
            <Link to={`/video/${video._id}`} className="flex flex-1 gap-3 min-w-0">
              <div className="relative w-[160px] aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-800">
                <img src={video.thumbnail?.url} alt={video.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {formatDuration(video.duration)}
                </span>
              </div>
              <div className="min-w-0 py-0.5">
                <h3 className="font-semibold text-[15px] text-white line-clamp-2">{video.title}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {video.owner?.fullName || video.owner?.username} • {video.views.toLocaleString()} views • {timeAgo(video.createdAt)}
                </p>
              </div>
            </Link>
            {isOwner && (
              <button
                onClick={() => removeVideo.mutate({ playlistId: playlist._id, videoId: video._id, add: false })}
                className="p-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                aria-label={`Remove ${video.title} from playlist`}
              >
                <X size={18} />
              </button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
