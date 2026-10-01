import VideoGrid from "../components/ui/VideoGrid";
import { useWatchHistory } from "../hooks/useLibrary";

export default function History() {
  const { data: videos = [], isLoading, isError } = useWatchHistory();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Watch history</h1>
      {isError ? (
        <p className="text-red-400">Couldn't load your watch history.</p>
      ) : (
        <VideoGrid videos={videos} isLoading={isLoading} emptyMessage="Videos you watch will show up here." />
      )}
    </div>
  );
}
