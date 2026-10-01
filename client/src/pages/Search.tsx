import { useSearchParams } from "react-router-dom";
import ChannelRow from "../components/ui/ChannelRow";
import LoadMoreButton from "../components/ui/LoadMoreButton";
import VideoGrid from "../components/ui/VideoGrid";
import { useChannelSearch, useVideoSearch } from "../hooks/useLibrary";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();

  const channels = useChannelSearch(query);
  const videos = useVideoSearch(query);
  const videoResults = videos.data?.pages.flatMap((page) => page.videos) ?? [];

  if (!query) {
    return <p className="py-20 text-center text-gray-500">Search for videos and channels using the bar above.</p>;
  }

  return (
    <div className="space-y-10">
      <h1 className="text-xl text-gray-300">
        Results for <span className="font-bold text-white">"{query}"</span>
      </h1>

      {!!channels.data?.length && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Channels</h2>
          <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {channels.data.map((channel) => (
              <ChannelRow key={channel._id} channel={channel} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Videos</h2>
        {videos.isError ? (
          <p className="text-red-400">Search failed. Try again.</p>
        ) : (
          <VideoGrid
            videos={videoResults}
            isLoading={videos.isLoading}
            emptyMessage={`No videos match "${query}".`}
          />
        )}
        <LoadMoreButton
          hasNextPage={videos.hasNextPage}
          isFetchingNextPage={videos.isFetchingNextPage}
          onClick={() => videos.fetchNextPage()}
        />
      </section>
    </div>
  );
}
