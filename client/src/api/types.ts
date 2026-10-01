export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: {
    url: string;
    publicId: string;
  };
  coverImage?: {
    url: string;
    publicId: string;
  };
  watchHistory?: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
  description?: string;
}

export interface Media {
  url: string;
  public_id: string;
}

export interface VideoOwner {
  _id: string;
  username: string;
  fullName: string;
  avatar: Media;
  subscribersCount?: number;
  isSubscribed?: boolean;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: VideoOwner;
  thumbnail: Media;
  videoFile: Media;
  createdAt: string; // ISO date
  updatedAt: string;
  __v: number;
  likeCount?: number;
  isLikedByMe?: boolean;
}

export interface GetVideosResponse {
  videos: Video[];
}

export interface FeedPage {
  videos: Video[];
  pagination: Pagination;
}


export interface Pagination {
  totalVideos: number;
  currentPage: number;
  page: number;
  totalPages: number;
  pageSize: number;
  hasNextPage: boolean;
}



export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface UserChannelProfile {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: {
    url: string;
    publicId: string;
  };
  coverImage: {
    url: string;
    publicId: string;
  };
  subscribersCount: number;
  channelsSubscribedToCount: number;
  isSubscribed: boolean;
}

export interface LoginData {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  avatar: File;
  coverImage?: File;
}

export interface UpdateAccountData {
  fullName?: string;
  email?: string;
}

export interface ChangePasswordData {
  oldPassword?: string;
  newPassword?: string;
}

export interface UpdateVideoData {
  title?: string;
  description?: string;
  thumbnail?: {
    url: string;
    public_id: string;
  };
}

// Public user shape returned by lookups (comment/tweet owners, channel lists, search)
export interface ChannelSummary {
  _id: string;
  username: string;
  fullName?: string;
  avatar?: Media;
}

export interface PaginatedDocs<T> {
  docs: T[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage: number | null;
}

export interface Comment {
  _id: string;
  content: string;
  owner: ChannelSummary;
  createdAt: string;
  updatedAt: string;
  likeCount?: number;
  isLikedByMe?: boolean;
}

export interface Tweet {
  _id: string;
  content: string;
  owner: ChannelSummary;
  createdAt: string;
  updatedAt: string;
  likeCount?: number;
  isLikedByMe?: boolean;
}

export interface TweetFeedPage {
  tweets: Tweet[];
  pagination: {
    page: number;
    pageSize: number;
    totalTweets: number;
    hasNextPage: boolean;
  };
}

export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  // Ids for list endpoints, populated videos for the detail endpoint
  videos: string[];
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistDetail extends Omit<Playlist, "videos" | "owner"> {
  videos: Video[];
  owner: ChannelSummary;
  totalVideos: number;
  totalViews: number;
}

export interface ChannelStats {
  totalSubscribers: number;
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
}

