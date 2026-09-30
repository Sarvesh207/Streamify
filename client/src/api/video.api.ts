import client from "./axiosClient";
import type { ApiResponse, Video, FeedPage } from "./types";

const getAllVideos = async (page: number = 1): Promise<FeedPage> => {
  const res = await client.get(`/videos?page=${page}`);
  console.log("videos123654", res.data);
  return {
    videos: res.data.data.videos,
    pagination: res.data.data.pagination,
  };
};

const getVideoById = async (videoId: string): Promise<Video> => {
  const res = await client.get(`/videos/${videoId}`);
  return res.data.data;
};

const publishVideo = async (
  videoFile: FormData
): Promise<ApiResponse<Video>> => {
  const res = await client.post("/videos", videoFile);
  return res.data;
};

const getMyVideos = async (
  page: number = 1,
  limit: number = 10,
  query: string = "",
  sortBy: string = "createdAt",
  sortType: string = "desc",
  userId: string = "",
  publishStatus: string = "true"
): Promise<FeedPage> => {
  const res = await client.get(
    `/videos/user/videos?page=${page}&limit=${limit}&query=${query}&sortBy=${sortBy}&sortType=${sortType}&userId=${userId}&publishStatus=${publishStatus}`
  );

  return res.data.data;
};

const togglePublishStatus = async (videoId: string): Promise<ApiResponse<Video>> => {
  const res = await client.patch(`/videos/toggle/publish/${videoId}`);
  return res.data;
};

const updateVideo = async (
  videoId: string,
  data: FormData
): Promise<ApiResponse<Video>> => {
  const res = await client.patch(`/videos/${videoId}`, data);
  return res.data;
};

const deleteVideo = async (videoId: string): Promise<ApiResponse<null>> => {
  const res = await client.delete(`/videos/${videoId}`);
  return res.data;
};

export { getAllVideos, getVideoById, publishVideo, getMyVideos, togglePublishStatus, updateVideo, deleteVideo };

