import { Link } from "react-router-dom";
import VideoCard from "../components/ui/VideoCard";
import useFeed from "../hooks/useFeed";
import type { Video } from "../api/types";

const categories = [
  "All",
  "Gaming",
  "Music",
  "Live",
  "Computers",
  "Programming",
  "Podcasts",
  "News",
  "Sports",
  "Fashion",
  "Learning",
];

export default function Home() {
  const { data, isLoading } = useFeed();

  console.log("VIdeos Data", data);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const videos = data?.pages.flatMap((page) => page.videos) ?? [];

  return (
    <div className="flex flex-col gap-8">
      {/* Categories */}
      <div className="sticky top-0 z-10 bg-[#0f0f0f]/95 backdrop-blur-md pb-2 pt-2 -mx-4 px-4 flex gap-3 overflow-x-auto scrollbar-hide border-b border-white/5">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`px-4 py-1.5 rounded-lg whitespace-nowrap text-sm font-medium transition-all duration-200 ${i === 0
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 gap-y-10 gap-x-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos &&
          videos.map((video: Video) => (
            <Link to={`/video/${video._id}`} key={video._id} className="block hover:no-underline">
              <VideoCard video={video} />
            </Link>
          ))}
      </div>
    </div>
  );
}
