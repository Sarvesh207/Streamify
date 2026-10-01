import client from "./axiosClient";
import type { ApiResponse, Tweet, TweetFeedPage } from "./types";

export const getTweetFeed = async (page: number = 1): Promise<TweetFeedPage> => {
  const res = await client.get("/tweets/feed", { params: { page } });
  return res.data.data;
};

export const getUserTweets = async (userId: string): Promise<Tweet[]> => {
  const res = await client.get(`/tweets/user/${userId}`);
  return res.data.data;
};

export const createTweet = async (content: string): Promise<ApiResponse<Tweet>> => {
  const res = await client.post("/tweets", { content });
  return res.data;
};

export const updateTweet = async (
  tweetId: string,
  content: string
): Promise<ApiResponse<Tweet>> => {
  const res = await client.patch(`/tweets/${tweetId}`, { content });
  return res.data;
};

export const deleteTweet = async (tweetId: string): Promise<ApiResponse<null>> => {
  const res = await client.delete(`/tweets/${tweetId}`);
  return res.data;
};
