import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../api/playlist.api";
import type { Playlist } from "../api/types";
import { toastApiError } from "../utils/apiError";

export const usePlaylists = (userId?: string) => {
  return useQuery({
    queryKey: ["playlists", userId],
    queryFn: () => getUserPlaylists(userId as string),
    enabled: !!userId,
  });
};

export const usePlaylist = (playlistId?: string) => {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => getPlaylist(playlistId as string),
    enabled: !!playlistId,
  });
};

const useInvalidatePlaylists = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["playlists"] });
    queryClient.invalidateQueries({ queryKey: ["playlist"] });
  };
};

export const useCreatePlaylist = () => {
  const invalidate = useInvalidatePlaylists();
  return useMutation({
    mutationFn: createPlaylist,
    onError: (error) => toastApiError(error, "Failed to create playlist"),
    onSettled: invalidate,
  });
};

export const useUpdatePlaylist = () => {
  const invalidate = useInvalidatePlaylists();
  return useMutation({
    mutationFn: ({ playlistId, name, description }: { playlistId: string; name: string; description?: string }) =>
      updatePlaylist(playlistId, { name, description }),
    onError: (error) => toastApiError(error, "Failed to update playlist"),
    onSettled: invalidate,
  });
};

export const useDeletePlaylist = () => {
  const invalidate = useInvalidatePlaylists();
  return useMutation({
    mutationFn: deletePlaylist,
    onError: (error) => toastApiError(error, "Failed to delete playlist"),
    onSettled: invalidate,
  });
};

// Adds or removes a video, optimistically updating the owner's playlist list
export const useTogglePlaylistVideo = (userId?: string) => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidatePlaylists();
  const key = ["playlists", userId];

  return useMutation({
    mutationFn: ({ playlistId, videoId, add }: { playlistId: string; videoId: string; add: boolean }) =>
      add ? addVideoToPlaylist(videoId, playlistId) : removeVideoFromPlaylist(videoId, playlistId),
    onMutate: async ({ playlistId, videoId, add }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Playlist[]>(key);
      queryClient.setQueryData<Playlist[]>(key, (old) =>
        old?.map((p) =>
          p._id !== playlistId
            ? p
            : {
                ...p,
                videos: add
                  ? [...p.videos.filter((id) => id !== videoId), videoId]
                  : p.videos.filter((id) => id !== videoId),
              }
        )
      );
      return { previous };
    },
    onError: (error, _vars, context) => {
      queryClient.setQueryData(key, context?.previous);
      toastApiError(error, "Failed to update playlist");
    },
    onSettled: invalidate,
  });
};
