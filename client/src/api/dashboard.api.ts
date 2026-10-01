import client from "./axiosClient";
import type { ChannelStats } from "./types";

export const getChannelStats = async (): Promise<ChannelStats> => {
  const res = await client.get("/dashboard/stats");
  return res.data.data;
};
