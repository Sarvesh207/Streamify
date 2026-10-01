import { useState, type FormEvent } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useCreatePlaylist, usePlaylists, useTogglePlaylistVideo } from '../hooks/usePlaylists';

interface SaveToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

export default function SaveToPlaylistModal({ isOpen, onClose, videoId }: SaveToPlaylistModalProps) {
  const user = useSelector((state: RootState) => state.user);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const { data: playlists = [], isLoading } = usePlaylists(isOpen ? user?._id : undefined);
  const togglePlaylistVideo = useTogglePlaylistVideo(user?._id);
  const createPlaylist = useCreatePlaylist();

  if (!isOpen) return null;

  const handleToggle = (playlistId: string, isChecked: boolean) => {
    togglePlaylistVideo.mutate({ playlistId, videoId, add: !isChecked });
  };

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    const name = newPlaylistName.trim();
    if (!name) return;

    // Create the playlist, then save the current video into it
    createPlaylist.mutate(
      { name },
      {
        onSuccess: (res) => {
          setNewPlaylistName('');
          togglePlaylistVideo.mutate({ playlistId: res.data._id, videoId, add: true });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-black w-full max-w-[320px] rounded-2xl p-6 shadow-2xl ring-1 ring-white/10 relative z-10 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-base font-semibold">Save to playlist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 mb-6 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
          {isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          )}
          {!isLoading && playlists.length === 0 && (
            <p className="text-sm text-gray-500">You don't have any playlists yet.</p>
          )}
          {playlists.map((playlist) => {
            const isChecked = playlist.videos.includes(videoId);
            return (
              <label key={playlist._id} className="flex items-center gap-3 cursor-pointer group select-none">
                <div
                  className={`
                    w-5 h-5 rounded flex items-center justify-center border transition-all duration-200
                    ${isChecked
                      ? 'bg-white border-white text-black'
                      : 'border-gray-500 bg-transparent group-hover:border-gray-400'
                    }
                  `}
                >
                  {isChecked && <Check size={14} strokeWidth={4} />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isChecked}
                  onChange={() => handleToggle(playlist._id, isChecked)}
                />
                <span className={`text-sm font-medium truncate ${isChecked ? 'text-white' : 'text-gray-300'}`}>
                  {playlist.name}
                </span>
              </label>
            );
          })}
        </div>

        <form onSubmit={handleCreate}>
          <div className="space-y-2 mb-6">
            <label htmlFor="new-playlist-name" className="text-xs font-medium text-gray-400">Name</label>
            <input
              id="new-playlist-name"
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
              className="w-full bg-[#1a1a1a] text-white px-3 py-2.5 rounded-xl text-sm outline-none border border-transparent focus:border-white/20 focus:ring-1 focus:ring-white/20 placeholder:text-gray-600 transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={!newPlaylistName.trim() || createPlaylist.isPending}
            className="w-full bg-[#2a2a2a] hover:bg-[#3f3f3f] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-[0.98]"
          >
            {createPlaylist.isPending ? 'Creating...' : 'Create new playlist'}
          </button>
        </form>
      </div>
    </div>
  );
}
