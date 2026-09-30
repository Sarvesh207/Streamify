import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleVideoLike } from "../api/like.api";
import type { Video } from "../api/types";

const useToggleVideoLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: string) => toggleVideoLike(videoId),
    onMutate: async (videoId) => {
      await queryClient.cancelQueries({ queryKey: ["video", videoId] });
      const previousVideo = queryClient.getQueryData<Video>(["video", videoId]);

      if (previousVideo) {
        queryClient.setQueryData<Video>(["video", videoId], {
          ...previousVideo,
          isLikedByMe: !previousVideo.isLikedByMe,
          likeCount: previousVideo.isLikedByMe
            ? Math.max(0, (previousVideo.likeCount || 0) - 1)
            : (previousVideo.likeCount || 0) + 1,
        });
      }
      return { previousVideo };
    },
    onError: (_err, videoId, context) => {
      if (context?.previousVideo) {
        queryClient.setQueryData(["video", videoId], context.previousVideo);
      }
    },
    onSettled: (_data, _error, videoId) => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
    },
  });
};

export default useToggleVideoLike;
