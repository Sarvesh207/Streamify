import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import TweetCard from "../components/community/TweetCard";
import PlaylistCard from "../components/playlists/PlaylistCard";
import SubscribeButton from "../components/SubscribeButton";
import Avatar from "../components/ui/Avatar";
import LoadMoreButton from "../components/ui/LoadMoreButton";
import VideoGrid from "../components/ui/VideoGrid";
import { useChannel, useChannelVideos } from "../hooks/useLibrary";
import { usePlaylists } from "../hooks/usePlaylists";
import { useUserTweets } from "../hooks/useTweets";
import type { RootState } from "../store/store";

type Tab = "Videos" | "Playlists" | "Community";
const TABS: Tab[] = ["Videos", "Playlists", "Community"];

export default function Channel() {
  const { username } = useParams();
  const user = useSelector((state: RootState) => state.user);
  const [tab, setTab] = useState<Tab>("Videos");

  const { data: channel, isLoading, isError } = useChannel(username?.toLowerCase());
  const channelId = channel?._id;

  const videos = useChannelVideos(tab === "Videos" ? channelId : undefined);
  // Playlist endpoints require login on the server
  const playlists = usePlaylists(tab === "Playlists" && user ? channelId : undefined);
  const tweets = useUserTweets(tab === "Community" ? channelId : undefined);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }
  if (isError || !channel) return <p className="py-20 text-center text-gray-500">This channel doesn't exist.</p>;

  const videoResults = videos.data?.pages.flatMap((page) => page.videos) ?? [];

  return (
    <div className="-mt-4 -mx-4">
      {channel.coverImage?.url ? (
        <img src={channel.coverImage.url} alt="" className="w-full h-32 md:h-48 lg:h-56 object-cover" />
      ) : (
        <div className="w-full h-32 md:h-48 lg:h-56 bg-gradient-to-r from-pink-500 via-orange-400 to-cyan-400" />
      )}

      <div className="px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-10 md:-mt-14 mb-6">
          <Avatar
            src={channel.avatar?.url}
            name={channel.username}
            className="w-24 h-24 md:w-32 md:h-32 border-4 border-black"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{channel.fullName}</h1>
            <p className="text-gray-400 mt-1">
              @{channel.username} • {channel.subscribersCount.toLocaleString()} subscribers •{" "}
              {channel.channelsSubscribedToCount.toLocaleString()} subscribed
            </p>
          </div>
          <div className="md:mb-2">
            {user?._id === channel._id ? (
              <Link to="/settings" className="bg-[#2a2a2a] hover:bg-[#3f3f3f] text-white px-8 py-2.5 rounded-xl text-sm font-semibold">
                Customize channel
              </Link>
            ) : (
              <SubscribeButton channelId={channel._id} isSubscribed={channel.isSubscribed} />
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-8 border-b border-gray-800" role="tablist">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === t ? "border-white text-white" : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Videos" && (
          <>
            <VideoGrid videos={videoResults} isLoading={videos.isLoading} emptyMessage="This channel hasn't published any videos." />
            <LoadMoreButton
              hasNextPage={videos.hasNextPage}
              isFetchingNextPage={videos.isFetchingNextPage}
              onClick={() => videos.fetchNextPage()}
            />
          </>
        )}

        {tab === "Playlists" &&
          (!user ? (
            <p className="py-20 text-center text-gray-500">
              <Link to="/login" className="text-white font-semibold hover:underline">Log in</Link> to see playlists.
            </p>
          ) : playlists.isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : !playlists.data?.length ? (
            <p className="py-20 text-center text-gray-500">No playlists yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-y-8 gap-x-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {playlists.data.map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              ))}
            </div>
          ))}

        {tab === "Community" && (
          <div className="max-w-2xl space-y-4">
            {tweets.isLoading && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            )}
            {!tweets.isLoading && !tweets.data?.length && (
              <p className="py-20 text-center text-gray-500">No community posts yet.</p>
            )}
            {tweets.data?.map((tweet) => (
              <TweetCard key={tweet._id} tweet={tweet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
