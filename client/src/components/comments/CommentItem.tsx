import { Heart, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Comment } from "../../api/types";
import { timeAgo } from "../../utils/timeAgo";
import Avatar from "../ui/Avatar";

interface CommentItemProps {
  comment: Comment;
  isOwner: boolean;
  onLike: () => void;
  onEdit: (content: string) => void;
  onDelete: () => void;
}

export default function CommentItem({ comment, isOwner, onLike, onEdit, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);

  const saveEdit = () => {
    const content = draft.trim();
    if (content && content !== comment.content) onEdit(content);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setDraft(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="flex gap-4 group">
      <Link to={`/c/${comment.owner.username}`}>
        <Avatar src={comment.owner.avatar?.url} name={comment.owner.username} />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 items-center mb-1">
          <Link to={`/c/${comment.owner.username}`} className="font-semibold text-white text-sm hover:underline">
            {comment.owner.fullName || comment.owner.username}
          </Link>
          <span className="text-xs text-gray-500">
            {timeAgo(comment.createdAt)}
            {comment.updatedAt !== comment.createdAt && " (edited)"}
          </span>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              autoFocus
              aria-label="Edit comment"
              className="w-full bg-transparent border-b border-white/40 focus:border-white text-white text-[14px] pb-1 outline-none"
            />
            <div className="flex justify-end gap-2">
              <button onClick={cancelEdit} className="px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white">
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={!draft.trim()}
                className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white text-black disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[14px] text-gray-300 leading-relaxed max-w-2xl font-light whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        )}

        {!isEditing && (
          <div className="flex items-center gap-5 mt-2.5">
            <button
              onClick={onLike}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                comment.isLikedByMe ? "text-[#ff4e4e]" : "text-gray-400 hover:text-white"
              }`}
              aria-label={comment.isLikedByMe ? "Unlike comment" : "Like comment"}
            >
              <Heart size={14} fill={comment.isLikedByMe ? "currentColor" : "none"} />
              {!!comment.likeCount && <span>{comment.likeCount}</span>}
            </button>
            {isOwner && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Edit comment"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={onDelete}
                  className="text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Delete comment"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
