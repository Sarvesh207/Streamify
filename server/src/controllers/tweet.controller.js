import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";

// Shared stages: attach public owner fields, like count and whether the viewer liked it
const tweetEnrichmentStages = (viewerId) => [
    {
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }],
        },
    },
    { $unwind: "$owner" },
    {
        $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "tweet",
            as: "likes",
        },
    },
    {
        $addFields: {
            likeCount: { $size: "$likes" },
            isLikedByMe: viewerId
                ? { $in: [viewerId, "$likes.likedBy"] }
                : false,
        },
    },
    { $project: { likes: 0 } },
];

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required for the tweet");
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: req.user?._id,
    });

    if (!tweet) {
        throw new ApiError(500, "Failed to create tweet");
    }

    const [createdTweet] = await Tweet.aggregate([
        { $match: { _id: tweet._id } },
        ...tweetEnrichmentStages(req.user._id),
    ]);

    return res
        .status(201)
        .json(new ApiResponse(201, createdTweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const tweets = await Tweet.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        { $sort: { createdAt: -1 } },
        ...tweetEnrichmentStages(req.user?._id),
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

// Tweets from channels the user subscribes to, plus the user's own tweets
const getTweetFeed = asyncHandler(async (req, res) => {
    const pageNumber = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = Math.min(
        50,
        Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const subscriptions = await Subscription.find({
        subscriber: req.user._id,
    }).select("channel");

    const ownerIds = [req.user._id, ...subscriptions.map((s) => s.channel)];

    const [tweets, totalTweets] = await Promise.all([
        Tweet.aggregate([
            { $match: { owner: { $in: ownerIds } } },
            { $sort: { createdAt: -1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            ...tweetEnrichmentStages(req.user._id),
        ]),
        Tweet.countDocuments({ owner: { $in: ownerIds } }),
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                tweets,
                pagination: {
                    page: pageNumber,
                    pageSize,
                    totalTweets,
                    hasNextPage: pageNumber * pageSize < totalTweets,
                },
            },
            "Tweet feed fetched successfully"
        )
    );
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required to update the tweet");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet");
    }

    tweet.content = content.trim();
    await tweet.save({ validateBeforeSave: true });

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet");
    }

    await Tweet.deleteOne({ _id: tweetId });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, getTweetFeed, updateTweet, deleteTweet };
