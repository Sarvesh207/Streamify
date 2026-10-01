import client from "./axiosClient";
import type { ApiResponse, FeedPage } from "./types";

export const toggleVideoLike = async (videoId: string): Promise<ApiResponse<any>> => {
  const res = await client.post(`/likes/toggle/v/${videoId}`);
  return res.data;
};

export const toggleCommentLike = async (commentId: string): Promise<ApiResponse<any>> => {
  const res = await client.post(`/likes/toggle/c/${commentId}`);
  return res.data;
};

export const toggleTweetLike = async (tweetId: string): Promise<ApiResponse<any>> => {
  const res = await client.post(`/likes/toggle/t/${tweetId}`);
  return res.data;
};

export const getLikedVideos = async (page: number = 1): Promise<FeedPage> => {
  const res = await client.get("/likes/videos", { params: { page, limit: 12 } });
  return res.data.data;
};
