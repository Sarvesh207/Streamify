import client from "./axiosClient";
import type { ApiResponse, ChannelSummary } from "./types";

export const toggleSubscription = async (
  channelId: string
): Promise<ApiResponse<{ subscribed: boolean }>> => {
  const res = await client.post(`/subscriptions/c/${channelId}`);
  return res.data;
};

// The server resolves the subscriber from the auth token; the path param is required by the route but unused
export const getSubscribedChannels = async (userId: string): Promise<ChannelSummary[]> => {
  const res = await client.get(`/subscriptions/c/${userId}`);
  return res.data.data;
};

export const getChannelSubscribers = async (channelId: string): Promise<ChannelSummary[]> => {
  const res = await client.get(`/subscriptions/u/${channelId}`);
  return res.data.data;
};
