import { Loader2, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useSelector } from "react-redux";
import PlaylistCard from "../components/playlists/PlaylistCard";
import { useCreatePlaylist, usePlaylists } from "../hooks/usePlaylists";
import type { RootState } from "../store/store";

export default function Playlists() {
  const user = useSelector((state: RootState) => state.user);
  const { data: playlists = [], isLoading, isError } = usePlaylists(user?._id);
  const createPlaylist = useCreatePlaylist();

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createPlaylist.mutate(
      { name: name.trim(), description: description.trim() },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          setIsCreating(false);
        },
      }
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Your playlists</h1>
        <button
          onClick={() => setIsCreating((open) => !open)}
          className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus size={18} />
          New playlist
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-8 max-w-md space-y-3 bg-[#0f0f0f] border border-gray-800 rounded-xl p-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Playlist name"
            aria-label="Playlist name"
            autoFocus
            className="w-full bg-[#1a1a1a] text-white px-3 py-2.5 rounded-lg text-sm outline-none border border-transparent focus:border-white/20"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            aria-label="Playlist description"
            className="w-full bg-[#1a1a1a] text-white px-3 py-2.5 rounded-lg text-sm outline-none border border-transparent focus:border-white/20"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || createPlaylist.isPending}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-white text-black disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}
      {isError && <p className="text-red-400">Couldn't load playlists.</p>}
      {!isLoading && !isError && playlists.length === 0 && (
        <p className="py-20 text-center text-gray-500">
          No playlists yet. Create one here, or save a video from its page.
        </p>
      )}

      <div className="grid grid-cols-1 gap-y-8 gap-x-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist._id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
}
