import { Heart, MessageSquare, MoreHorizontal, Share } from 'lucide-react';

export default function Community() {
  const posts = [
    {
       id: 1,
       author: "TechMaster",
       avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
       content: "Just dropped a new video on React 19 features! 🚀 Check it out and let me know what you think. #ReactJS #WebDev",
       likes: "1.5K",
       comments: "230",
       time: "1 hour ago",
       image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    },
    {
       id: 2,
       author: "CodeWithMe",
       avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
       content: "Poll: Which CSS framework do you prefer for large applications? 🎨",
       likes: "890",
       comments: "450",
       time: "3 hours ago",
       isPoll: true
    },
     {
       id: 3,
       author: "WebDev Daily",
       avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
       content: "Working on a new course! 📚 It's going to cover full-stack development with Next.js and Supabase. Stay tuned!",
       likes: "3.2K",
       comments: "156",
       time: "1 day ago"
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Community Posts</h1>
      
      {/* Create Post Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
         <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                Me
            </div>
            <div className="flex-1">
                <textarea 
                    rows={2}
                    placeholder="Post an update to your fans..."
                    className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 resize-none text-lg"
                />
            </div>
         </div>
         <div className="flex justify-end mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
             <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition">
                Post
             </button>
         </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                        <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{post.author}</h3>
                            <p className="text-xs text-gray-500">{post.time}</p>
                        </div>
                    </div>
                    <button className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">
                    {post.content}
                </p>

                {post.image && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img src={post.image} alt="Post content" className="w-full h-auto" />
                    </div>
                )}

                {post.isPoll && (
                    <div className="mb-4 space-y-2">
                        {['Tailwind CSS', 'Bootstrap', 'Material UI', 'Other'].map((option, idx) => (
                            <div key={idx} className="border border-blue-500 rounded p-2 text-center text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition">
                                {option}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 text-sm">
                    <button className="flex items-center gap-2 hover:text-blue-500">
                        <Heart size={18} />
                        <span>{post.likes}</span>
                    </button>
                     <button className="flex items-center gap-2 hover:text-blue-500">
                        <MessageSquare size={18} />
                        <span>{post.comments}</span>
                    </button>
                     <button className="flex items-center gap-2 hover:text-blue-500">
                        <Share size={18} />
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
