import { useQuery } from "@tanstack/react-query";
import { getVideoById } from "../api/video.api";

const useVideoById = (videoId: string) => {
  return useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideoById(videoId),
    enabled: !!videoId, // 🔥 prevents unnecessary call
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
};

export default useVideoById;
