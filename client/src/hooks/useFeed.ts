import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllVideos } from "../api/video.api";
import type { FeedPage } from "../api/types";

const useFeed = () => {
  return useInfiniteQuery<FeedPage>({
    queryKey: ["feed"],
    queryFn: ({ pageParam = 1 }) => getAllVideos(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },
  });
};

export default useFeed;
