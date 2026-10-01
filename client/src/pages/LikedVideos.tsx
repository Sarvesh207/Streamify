import LoadMoreButton from "../components/ui/LoadMoreButton";
import VideoGrid from "../components/ui/VideoGrid";
import { useLikedVideos } from "../hooks/useLibrary";

export default function LikedVideos() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useLikedVideos();
  const videos = data?.pages.flatMap((page) => page.videos) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Liked videos</h1>
      {isError ? (
        <p className="text-red-400">Couldn't load liked videos.</p>
      ) : (
        <VideoGrid videos={videos} isLoading={isLoading} emptyMessage="Videos you like will show up here." />
      )}
      <LoadMoreButton hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} onClick={() => fetchNextPage()} />
    </div>
  );
}
