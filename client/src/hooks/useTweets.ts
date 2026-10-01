import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from "@tanstack/react-query";
import { toggleTweetLike } from "../api/like.api";
import { createTweet, deleteTweet, getTweetFeed, getUserTweets, updateTweet } from "../api/tweet.api";
import type { Tweet, TweetFeedPage } from "../api/types";
import { toastApiError } from "../utils/apiError";

export const useTweetFeed = () => {
  return useInfiniteQuery<TweetFeedPage>({
    queryKey: ["tweets", "feed"],
    queryFn: ({ pageParam = 1 }) => getTweetFeed(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
  });
};

export const useUserTweets = (userId?: string) => {
  return useQuery({
    queryKey: ["tweets", "user", userId],
    queryFn: () => getUserTweets(userId as string),
    enabled: !!userId,
  });
};

type TweetCache = InfiniteData<TweetFeedPage> | Tweet[] | undefined;

// Tweets are cached both as the infinite feed and as per-user lists; update both shapes
const mapCachedTweets = (cache: TweetCache, update: (tweet: Tweet) => Tweet | null): TweetCache => {
  if (!cache) return cache;
  const apply = (tweets: Tweet[]) => tweets.map(update).filter((t): t is Tweet => t !== null);
  if (Array.isArray(cache)) return apply(cache);
  return {
    ...cache,
    pages: cache.pages.map((page) => ({ ...page, tweets: apply(page.tweets) })),
  };
};

const useOptimisticTweetUpdate = () => {
  const queryClient = useQueryClient();
  return {
    queryClient,
    apply: async (update: (tweet: Tweet) => Tweet | null) => {
      await queryClient.cancelQueries({ queryKey: ["tweets"] });
      const previous = queryClient.getQueriesData<TweetCache>({ queryKey: ["tweets"] });
      queryClient.setQueriesData<TweetCache>({ queryKey: ["tweets"] }, (cache) =>
        mapCachedTweets(cache, update)
      );
      return { previous };
    },
    rollback: (previous?: [QueryKey, TweetCache][]) =>
      previous?.forEach(([key, data]) => queryClient.setQueryData(key, data)),
    invalidate: () => queryClient.invalidateQueries({ queryKey: ["tweets"] }),
  };
};

export const useCreateTweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => createTweet(content),
    onError: (error) => toastApiError(error, "Failed to post"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tweets"] }),
  });
};

export const useUpdateTweet = () => {
  const { apply, rollback, invalidate } = useOptimisticTweetUpdate();
  return useMutation({
    mutationFn: ({ tweetId, content }: { tweetId: string; content: string }) => updateTweet(tweetId, content),
    onMutate: ({ tweetId, content }) => apply((t) => (t._id === tweetId ? { ...t, content } : t)),
    onError: (error, _vars, context) => {
      rollback(context?.previous);
      toastApiError(error, "Failed to update post");
    },
    onSettled: invalidate,
  });
};

export const useDeleteTweet = () => {
  const { apply, rollback, invalidate } = useOptimisticTweetUpdate();
  return useMutation({
    mutationFn: (tweetId: string) => deleteTweet(tweetId),
    onMutate: (tweetId) => apply((t) => (t._id === tweetId ? null : t)),
    onError: (error, _vars, context) => {
      rollback(context?.previous);
      toastApiError(error, "Failed to delete post");
    },
    onSettled: invalidate,
  });
};

export const useToggleTweetLike = () => {
  const { apply, rollback, invalidate } = useOptimisticTweetUpdate();
  return useMutation({
    mutationFn: (tweetId: string) => toggleTweetLike(tweetId),
    onMutate: (tweetId) =>
      apply((t) =>
        t._id === tweetId
          ? {
              ...t,
              isLikedByMe: !t.isLikedByMe,
              likeCount: Math.max(0, (t.likeCount ?? 0) + (t.isLikedByMe ? -1 : 1)),
            }
          : t
      ),
    onError: (error, _vars, context) => {
      rollback(context?.previous);
      toastApiError(error, "Failed to like post");
    },
    onSettled: invalidate,
  });
};
