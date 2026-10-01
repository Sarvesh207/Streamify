import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getChannelStats } from "../api/dashboard.api";
import { getLikedVideos } from "../api/like.api";
import { getChannelSubscribers, getSubscribedChannels } from "../api/subscription.api";
import type { FeedPage } from "../api/types";
import { getHistory, getUserChannelProfile, searchChannels } from "../api/user.api";
import { getChannelVideos, searchVideos } from "../api/video.api";

const nextFeedPage = (lastPage: FeedPage) =>
  lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined;

export const useLikedVideos = () => {
  return useInfiniteQuery<FeedPage>({
    queryKey: ["likedVideos"],
    queryFn: ({ pageParam = 1 }) => getLikedVideos(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: nextFeedPage,
  });
};

export const useWatchHistory = () => {
  return useQuery({
    queryKey: ["watchHistory"],
    queryFn: async () => (await getHistory()).data,
  });
};

export const useChannelStats = () => {
  return useQuery({
    queryKey: ["channelStats"],
    queryFn: getChannelStats,
  });
};

export const useChannel = (username?: string) => {
  return useQuery({
    queryKey: ["channel", username],
    queryFn: async () => (await getUserChannelProfile(username as string)).data,
    enabled: !!username,
  });
};

export const useSubscribedChannels = (userId?: string) => {
  return useQuery({
    queryKey: ["subscriptions", "following", userId],
    queryFn: () => getSubscribedChannels(userId as string),
    enabled: !!userId,
  });
};

export const useChannelSubscribers = (channelId?: string) => {
  return useQuery({
    queryKey: ["subscriptions", "subscribers", channelId],
    queryFn: () => getChannelSubscribers(channelId as string),
    enabled: !!channelId,
  });
};

export const useVideoSearch = (query: string) => {
  return useInfiniteQuery<FeedPage>({
    queryKey: ["search", "videos", query],
    queryFn: ({ pageParam = 1 }) => searchVideos(query, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: nextFeedPage,
    enabled: !!query,
  });
};

export const useChannelSearch = (query: string) => {
  return useQuery({
    queryKey: ["search", "channels", query],
    queryFn: () => searchChannels(query),
    enabled: !!query,
    placeholderData: keepPreviousData,
  });
};

export const useChannelVideos = (userId?: string) => {
  return useInfiniteQuery<FeedPage>({
    queryKey: ["channelVideos", userId],
    queryFn: ({ pageParam = 1 }) => getChannelVideos(userId as string, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: nextFeedPage,
    enabled: !!userId,
  });
};
