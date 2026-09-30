import client from "./axiosClient";
import type { ApiResponse } from "./types";

export const toggleVideoLike = async (videoId: string): Promise<ApiResponse<any>> => {
  const res = await client.post(`/likes/toggle/v/${videoId}`);
  return res.data;
};
