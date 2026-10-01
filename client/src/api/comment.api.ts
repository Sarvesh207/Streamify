import client from "./axiosClient";
import type { ApiResponse, Comment, PaginatedDocs } from "./types";

export const getComments = async (
  videoId: string,
  page: number = 1
): Promise<PaginatedDocs<Comment>> => {
  const res = await client.get(`/comments/${videoId}`, { params: { page, limit: 10 } });
  return res.data.data;
};

export const addComment = async (
  videoId: string,
  content: string
): Promise<ApiResponse<Comment>> => {
  const res = await client.post(`/comments/${videoId}`, { content });
  return res.data;
};

export const updateComment = async (
  commentId: string,
  content: string
): Promise<ApiResponse<Comment>> => {
  const res = await client.patch(`/comments/c/${commentId}`, { content });
  return res.data;
};

export const deleteComment = async (commentId: string): Promise<ApiResponse<null>> => {
  const res = await client.delete(`/comments/c/${commentId}`);
  return res.data;
};
