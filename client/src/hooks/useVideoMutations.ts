import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePublishStatus, updateVideo, deleteVideo } from "../api/video.api";
import type { Video, ApiResponse } from "../api/types";
import { toast, Bounce } from "react-toastify";
import type { AxiosError } from "axios";

/**
 * Hook for toggling video publish status with optimistic updates
 */
export const useTogglePublishStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (videoId: string) => togglePublishStatus(videoId),
        onMutate: async (videoId: string) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["getMyVideos"] });

            // Snapshot previous value
            const previousData = queryClient.getQueryData(["getMyVideos"]);

            // Optimistically update
            queryClient.setQueryData(["getMyVideos"], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    videos: old.videos.map((video: Video) =>
                        video._id === videoId
                            ? { ...video, isPublished: !video.isPublished }
                            : video
                    ),
                };
            });

            return { previousData };
        },
        onError: (error: AxiosError<any>, _videoId, context) => {
            // Rollback on error
            if (context?.previousData) {
                queryClient.setQueryData(["getMyVideos"], context.previousData);
            }
            toast.error(error.response?.data?.message || "Failed to update publish status", {
                position: "bottom-right",
                autoClose: 3000,
                transition: Bounce,
            });
        },
        onSuccess: (data: ApiResponse<Video>) => {
            const status = data.data.isPublished ? "published" : "unpublished";
            toast.success(`Video ${status} successfully!`, {
                position: "bottom-right",
                autoClose: 3000,
                transition: Bounce,
            });
        },
        onSettled: () => {
            // Refetch to ensure data consistency
            queryClient.invalidateQueries({ queryKey: ["getMyVideos"] });
        },
    });
};

/**
 * Hook for updating video details
 */
export const useUpdateVideo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ videoId, data }: { videoId: string; data: FormData }) =>
            updateVideo(videoId, data),
        onSuccess: () => {
            toast.success("Video updated successfully!", {
                position: "bottom-right",
                autoClose: 3000,
                transition: Bounce,
            });
            queryClient.invalidateQueries({ queryKey: ["getMyVideos"] });
            queryClient.invalidateQueries({ queryKey: ["feed"] });
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response?.data?.message || "Failed to update video", {
                position: "bottom-right",
                autoClose: 3000,
                transition: Bounce,
            });
        },
    });
};

/**
 * Hook for deleting a video with optimistic update
 */
export const useDeleteVideo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (videoId: string) => deleteVideo(videoId),
        onMutate: async (videoId: string) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["getMyVideos"] });

            // Snapshot previous value
            const previousData = queryClient.getQueryData(["getMyVideos"]);

            // Optimistically remove the video
            queryClient.setQueryData(["getMyVideos"], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    videos: old.videos.filter((video: Video) => video._id !== videoId),
                };
            });

            return { previousData };
        },
        onError: (error: AxiosError<any>, _videoId, context) => {
            // Rollback on error
            if (context?.previousData) {
                queryClient.setQueryData(["getMyVideos"], context.previousData);
            }
            toast.error(error.response?.data?.message || "Failed to delete video", {
                position: "bottom-right",
                autoClose: 3000,
                transition: Bounce,
            });
        },
        onSuccess: () => {
            toast.success("Video deleted successfully!", {
                position: "bottom-right",
                autoClose: 3000,
                transition: Bounce,
            });
        },
        onSettled: () => {
            // Refetch to ensure data consistency
            queryClient.invalidateQueries({ queryKey: ["getMyVideos"] });
            queryClient.invalidateQueries({ queryKey: ["feed"] });
        },
    });
};
