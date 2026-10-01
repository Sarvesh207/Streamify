import { Loader2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import TweetCard from '../components/community/TweetCard';
import Avatar from '../components/ui/Avatar';
import LoadMoreButton from '../components/ui/LoadMoreButton';
import { useCreateTweet, useTweetFeed } from '../hooks/useTweets';
import type { RootState } from '../store/store';

const MAX_LENGTH = 500;

export default function Community() {
  const user = useSelector((state: RootState) => state.user);
  const [content, setContent] = useState('');

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useTweetFeed();
  const createTweet = useCreateTweet();

  const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    createTweet.mutate(trimmed, { onSuccess: () => setContent('') });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-white">Community</h1>
      <p className="text-sm text-gray-400 mb-6">Posts from you and the channels you subscribe to.</p>

      {/* Create Post */}
      <form onSubmit={handleSubmit} className="bg-[#0f0f0f] rounded-xl p-4 mb-6 border border-gray-800">
        <div className="flex gap-4">
          <Avatar src={user?.avatar?.url} name={user?.username} />
          <textarea
            rows={2}
            value={content}
            maxLength={MAX_LENGTH}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Post an update to your subscribers..."
            aria-label="New post"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 resize-none text-lg"
          />
        </div>
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-800">
          <span className="text-xs text-gray-500">{content.length}/{MAX_LENGTH}</span>
          <button
            type="submit"
            disabled={!content.trim() || createTweet.isPending}
            className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 disabled:opacity-50 transition"
          >
            {createTweet.isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>

      {/* Feed */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}
      {isError && <p className="text-center text-red-400 py-10">Couldn't load posts.</p>}
      {!isLoading && !isError && tweets.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          Nothing here yet. Post something, or subscribe to channels to see their updates.
        </p>
      )}

      <div className="space-y-4">
        {tweets.map((tweet) => (
          <TweetCard key={tweet._id} tweet={tweet} />
        ))}
      </div>

      <LoadMoreButton
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </div>
  );
}
