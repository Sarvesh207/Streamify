import { Heart, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { Tweet } from "../../api/types";
import { useDeleteTweet, useToggleTweetLike, useUpdateTweet } from "../../hooks/useTweets";
import type { RootState } from "../../store/store";
import { timeAgo } from "../../utils/timeAgo";
import Avatar from "../ui/Avatar";

export default function TweetCard({ tweet }: { tweet: Tweet }) {
  const user = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(tweet.content);

  const updateTweet = useUpdateTweet();
  const deleteTweet = useDeleteTweet();
  const toggleLike = useToggleTweetLike();

  const isOwner = user?._id === tweet.owner._id;

  const saveEdit = () => {
    const content = draft.trim();
    if (content && content !== tweet.content) {
      updateTweet.mutate({ tweetId: tweet._id, content });
    }
    setIsEditing(false);
  };

  return (
    <article className="bg-[#0f0f0f] rounded-xl p-5 border border-gray-800 group">
      <div className="flex justify-between items-start mb-3">
        <Link to={`/c/${tweet.owner.username}`} className="flex gap-3 items-center">
          <Avatar src={tweet.owner.avatar?.url} name={tweet.owner.username} />
          <div>
            <h3 className="font-semibold text-white hover:underline">
              {tweet.owner.fullName || tweet.owner.username}
            </h3>
            <p className="text-xs text-gray-500">
              @{tweet.owner.username} • {timeAgo(tweet.createdAt)}
            </p>
          </div>
        </Link>
        {isOwner && !isEditing && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-500 hover:text-white rounded-full hover:bg-white/5"
              aria-label="Edit post"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => deleteTweet.mutate(tweet._id)}
              className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-white/5"
              aria-label="Delete post"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mb-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            autoFocus
            aria-label="Edit post"
            className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 outline-none border border-white/10 focus:border-white/30 resize-none"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setDraft(tweet.content);
                setIsEditing(false);
              }}
              className="px-4 py-1.5 text-sm font-semibold text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              disabled={!draft.trim()}
              className="px-4 py-1.5 text-sm font-semibold rounded-full bg-white text-black disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-200 mb-4 whitespace-pre-wrap break-words">{tweet.content}</p>
      )}

      <button
        onClick={() => user && toggleLike.mutate(tweet._id)}
        disabled={!user}
        className={`flex items-center gap-2 text-sm transition-colors ${
          tweet.isLikedByMe ? "text-[#ff4e4e]" : "text-gray-400 hover:text-white"
        }`}
        aria-label={tweet.isLikedByMe ? "Unlike post" : "Like post"}
      >
        <Heart size={18} fill={tweet.isLikedByMe ? "currentColor" : "none"} />
        <span>{tweet.likeCount ?? 0}</span>
      </button>
    </article>
  );
}
