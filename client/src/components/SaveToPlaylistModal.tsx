import React, { useState } from 'react';
import { X, Check, Trash2 } from 'lucide-react';

interface SaveToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Playlist {
  id: string;
  name: string;
  checked: boolean;
}

export default function SaveToPlaylistModal({ isOpen, onClose }: SaveToPlaylistModalProps) {
  // Dummy data as requested
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: '1', name: 'Beat MODE', checked: true },
    { id: '2', name: 'Ill Lyricsist', checked: true },
    { id: '3', name: 'HYPEBEAST', checked: true },
    { id: '4', name: 'Good Vibes', checked: true },
    { id: '5', name: 'Rap Caviar', checked: true },
  ]);

  const [newPlaylistName, setNewPlaylistName] = useState('');

  if (!isOpen) return null;

  const togglePlaylist = (id: string) => {
    setPlaylists(playlists.map(p =>
      p.id === id ? { ...p, checked: !p.checked } : p
    ));
  };

  const createPlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name: newPlaylistName,
        checked: true // Auto check the new one upon creation
      };
      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName('');
    }
  };

  const deletePlaylist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPlaylists(playlists.filter(p => p.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-black w-full max-w-[320px] rounded-2xl p-6 shadow-2xl ring-1 ring-white/10 relative z-10 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-base font-semibold">Save To playlist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 mb-6 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
          {playlists.map((playlist) => (
            <label key={playlist.id} className="flex items-center gap-3 cursor-pointer group select-none">
              <div
                className={`
                            w-5 h-5 rounded flex items-center justify-center border transition-all duration-200
                            ${playlist.checked
                    ? 'bg-white border-white text-black'
                    : 'border-gray-500 bg-transparent group-hover:border-gray-400'
                  }
                        `}
              >
                {playlist.checked && <Check size={14} strokeWidth={4} />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={playlist.checked}
                onChange={() => togglePlaylist(playlist.id)}
              />
              <span className={`text-sm font-medium ${playlist.checked ? 'text-white' : 'text-gray-300'}`}>
                {playlist.name}
              </span>
              <button
                onClick={(e) => deletePlaylist(playlist.id, e)}
                className="ml-auto text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                aria-label="Delete playlist"
              >
                <Trash2 size={14} />
              </button>
            </label>
          ))}
        </div>

        <div className="space-y-2 mb-6">
          <label className="text-xs font-medium text-gray-400">Name</label>
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Enter playlist name"
            className="w-full bg-[#1a1a1a] text-white px-3 py-2.5 rounded-xl text-sm outline-none border border-transparent focus:border-white/20 focus:ring-1 focus:ring-white/20 placeholder:text-gray-600 transition-all font-medium"
          />
        </div>

        <button
          onClick={createPlaylist}
          className="w-full bg-[#2a2a2a] hover:bg-[#3f3f3f] text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-[0.98]"
        >
          Create new Playlist
        </button>
      </div>
    </div>
  );
}
