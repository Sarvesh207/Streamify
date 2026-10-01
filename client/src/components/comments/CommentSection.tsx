import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  useAddComment,
  useComments,
  useDeleteComment,
  useToggleCommentLike,
  useUpdateComment,
} from "../../hooks/useComments";
import type { RootState } from "../../store/store";
import Avatar from "../ui/Avatar";
import LoadMoreButton from "../ui/LoadMoreButton";
import CommentItem from "./CommentItem";

export default function CommentSection({ videoId }: { videoId: string }) {
  const user = useSelector((state: RootState) => state.user);
  const [content, setContent] = useState("");

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useComments(videoId);
  const addComment = useAddComment(videoId);
  const updateComment = useUpdateComment(videoId);
  const deleteComment = useDeleteComment(videoId);
  const toggleLike = useToggleCommentLike(videoId);

  const comments = data?.pages.flatMap((page) => page.docs) ?? [];
  const totalComments = data?.pages[0]?.totalDocs ?? 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    addComment.mutate(trimmed, { onSuccess: () => setContent("") });
  };

  return (
    <div className="mt-8">
      <h2 className="text-[17px] font-bold text-white mb-8">
        {totalComments} {totalComments === 1 ? "comment" : "comments"}
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-4 items-start mb-8">
          <Avatar src={user.avatar?.url} name={user.username} />
          <div className="flex-1">
            <div className="border-b border-white/20 pb-2 focus-within:border-white transition-colors">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a comment..."
                aria-label="Add a comment"
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500"
              />
            </div>
            {content && (
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setContent("")}
                  className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || addComment.isPending}
                  className="px-4 py-2 text-sm font-semibold rounded-full bg-white text-black disabled:opacity-50"
                >
                  {addComment.isPending ? "Posting..." : "Comment"}
                </button>
              </div>
            )}
          </div>
        </form>
      ) : (
        <p className="mb-8 text-sm text-gray-400">
          <Link to="/login" className="text-white font-semibold hover:underline">
            Log in
          </Link>{" "}
          to join the conversation.
        </p>
      )}

      {isLoading && (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}
      {isError && <p className="text-sm text-red-400">Couldn't load comments.</p>}

      <div className="space-y-8">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            isOwner={user?._id === comment.owner._id}
            onLike={() => (user ? toggleLike.mutate(comment._id) : undefined)}
            onEdit={(newContent) => updateComment.mutate({ commentId: comment._id, content: newContent })}
            onDelete={() => deleteComment.mutate(comment._id)}
          />
        ))}
      </div>

      <LoadMoreButton
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </div>
  );
}
