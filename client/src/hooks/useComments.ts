import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { addComment, deleteComment, getComments, updateComment } from "../api/comment.api";
import { toggleCommentLike } from "../api/like.api";
import type { Comment, PaginatedDocs } from "../api/types";
import { toastApiError } from "../utils/apiError";

type CommentPages = InfiniteData<PaginatedDocs<Comment>>;

const commentsKey = (videoId: string) => ["comments", videoId];

export const useComments = (videoId: string) => {
  return useInfiniteQuery<PaginatedDocs<Comment>>({
    queryKey: commentsKey(videoId),
    queryFn: ({ pageParam = 1 }) => getComments(videoId, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    enabled: !!videoId,
  });
};

// Applies `update` to every cached comment of a video (used for optimistic edits/likes)
const mapCachedComments = (
  pages: CommentPages | undefined,
  update: (comment: Comment) => Comment | null
): CommentPages | undefined => {
  if (!pages) return pages;
  return {
    ...pages,
    pages: pages.pages.map((page) => ({
      ...page,
      docs: page.docs.map(update).filter((c): c is Comment => c !== null),
    })),
  };
};

export const useAddComment = (videoId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => addComment(videoId, content),
    onError: (error) => toastApiError(error, "Failed to add comment"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: commentsKey(videoId) }),
  });
};

export const useUpdateComment = (videoId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      updateComment(commentId, content),
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey: commentsKey(videoId) });
      const previous = queryClient.getQueryData<CommentPages>(commentsKey(videoId));
      queryClient.setQueryData<CommentPages>(commentsKey(videoId), (old) =>
        mapCachedComments(old, (c) => (c._id === commentId ? { ...c, content } : c))
      );
      return { previous };
    },
    onError: (error, _vars, context) => {
      queryClient.setQueryData(commentsKey(videoId), context?.previous);
      toastApiError(error, "Failed to update comment");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: commentsKey(videoId) }),
  });
};

export const useDeleteComment = (videoId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: commentsKey(videoId) });
      const previous = queryClient.getQueryData<CommentPages>(commentsKey(videoId));
      queryClient.setQueryData<CommentPages>(commentsKey(videoId), (old) =>
        mapCachedComments(old, (c) => (c._id === commentId ? null : c))
      );
      return { previous };
    },
    onError: (error, _vars, context) => {
      queryClient.setQueryData(commentsKey(videoId), context?.previous);
      toastApiError(error, "Failed to delete comment");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: commentsKey(videoId) }),
  });
};

export const useToggleCommentLike = (videoId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => toggleCommentLike(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: commentsKey(videoId) });
      const previous = queryClient.getQueryData<CommentPages>(commentsKey(videoId));
      queryClient.setQueryData<CommentPages>(commentsKey(videoId), (old) =>
        mapCachedComments(old, (c) =>
          c._id === commentId
            ? {
                ...c,
                isLikedByMe: !c.isLikedByMe,
                likeCount: Math.max(0, (c.likeCount ?? 0) + (c.isLikedByMe ? -1 : 1)),
              }
            : c
        )
      );
      return { previous };
    },
    onError: (error, _vars, context) => {
      queryClient.setQueryData(commentsKey(videoId), context?.previous);
      toastApiError(error, "Failed to like comment");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: commentsKey(videoId) }),
  });
};
