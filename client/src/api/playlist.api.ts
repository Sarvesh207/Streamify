import client from "./axiosClient";
import type { ApiResponse, Playlist, PlaylistDetail } from "./types";

export const createPlaylist = async (data: {
  name: string;
  description?: string;
}): Promise<ApiResponse<Playlist>> => {
  const res = await client.post("/playlist", data);
  return res.data;
};

export const getUserPlaylists = async (userId: string): Promise<Playlist[]> => {
  const res = await client.get(`/playlist/user/${userId}`);
  return res.data.data;
};

export const getPlaylist = async (playlistId: string): Promise<PlaylistDetail> => {
  const res = await client.get(`/playlist/${playlistId}`);
  return res.data.data;
};

export const updatePlaylist = async (
  playlistId: string,
  data: { name: string; description?: string }
): Promise<ApiResponse<Playlist>> => {
  const res = await client.patch(`/playlist/${playlistId}`, data);
  return res.data;
};

export const deletePlaylist = async (playlistId: string): Promise<ApiResponse<null>> => {
  const res = await client.delete(`/playlist/${playlistId}`);
  return res.data;
};

export const addVideoToPlaylist = async (
  videoId: string,
  playlistId: string
): Promise<ApiResponse<Playlist>> => {
  const res = await client.patch(`/playlist/add/${videoId}/${playlistId}`);
  return res.data;
};

export const removeVideoFromPlaylist = async (
  videoId: string,
  playlistId: string
): Promise<ApiResponse<Playlist>> => {
  const res = await client.patch(`/playlist/remove/${videoId}/${playlistId}`);
  return res.data;
};
