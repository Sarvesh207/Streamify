import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleSubscription } from "../api/subscription.api";
import type { UserChannelProfile, Video } from "../api/types";
import { toastApiError } from "../utils/apiError";

const flip = <T extends { isSubscribed?: boolean; subscribersCount?: number }>(target: T): T => ({
  ...target,
  isSubscribed: !target.isSubscribed,
  subscribersCount: Math.max(0, (target.subscribersCount ?? 0) + (target.isSubscribed ? -1 : 1)),
});

// Toggles a subscription and optimistically updates every cached video/channel owned by that channel
const useToggleSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channelId: string) => toggleSubscription(channelId),
    onMutate: async (channelId) => {
      await queryClient.cancelQueries({ queryKey: ["video"] });
      await queryClient.cancelQueries({ queryKey: ["channel"] });

      const previousVideos = queryClient.getQueriesData<Video>({ queryKey: ["video"] });
      const previousChannels = queryClient.getQueriesData<UserChannelProfile>({ queryKey: ["channel"] });

      queryClient.setQueriesData<Video>({ queryKey: ["video"] }, (video) =>
        video && video.owner?._id === channelId ? { ...video, owner: flip(video.owner) } : video
      );
      queryClient.setQueriesData<UserChannelProfile>({ queryKey: ["channel"] }, (channel) =>
        channel && channel._id === channelId ? flip(channel) : channel
      );

      return { previousVideos, previousChannels };
    },
    onError: (error, _channelId, context) => {
      context?.previousVideos.forEach(([key, data]) => queryClient.setQueryData(key, data));
      context?.previousChannels.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toastApiError(error, "Failed to update subscription");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["video"] });
      queryClient.invalidateQueries({ queryKey: ["channel"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
};

export default useToggleSubscription;
