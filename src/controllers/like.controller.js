import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.models.js";

const toggleVideoLike = asyncHandler( async (req,res) => {
    //toggle like on video
    const {videoId} = req.params

    if(!videoId) {
        throw new apiError(401, "Video ID is required")
    }

    const createdVideoLike = await Like.create({
        video: videoId,
        likedby: req.user?._id
    })

    if(!createdVideoLike) {
        throw new apiError(402, "Failed to create like on the video")
    }

    return res.status(200).json(new apiResponse(200, createdVideoLike, "Succesfully liked the video"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //toggle like on comment
    const {commentId} = req.params

    if(!commentId) {
        throw new apiError(401, "Comment ID is required")
    }

    const createdCommentLike = await Like.create({
        comment: commentId,
        likedby: req.user?._id
    })

    if(!createdCommentLike) {
        throw new apiError(402, "Failed to like the comment")
    }

    return res.status(200).json(new apiResponse(200, createdCommentLike, "Comment liked successfully"))
})

const toggleTweetLike = asyncHandler(async (req,res) => {
    //toggle like on tweet
    const {tweetId} = req.params

    if(!tweetId) {
        throw new apiError(401, "Tweet ID is required")
    }

    const createdTweetLike = await Like.create({
        tweet: tweetId,
        likedby: req.user?._id
    })

    if(!createdTweetLike) {
        throw new apiError(402, "Failed to like the tweet")
    }

    return res.status(200).json(new apiResponse(200, createdTweetLike, "Tweet liked successfully"))
})

const getVideoLikes = asyncHandler(async (req,res) => {
    //get all liked videos
    const {videoId} = req.params

    if(!videoId) {
        throw new apiError(401, "Video ID is required")
    }

    const videoWithLikes = await Like.find({video: videoId})

    if(!videoWithLikes) {
        throw new apiError(404, "No videos found")
    }

    return res.status(200).json(new apiResponse(200, videoWithLikes, "Videos with likes found successfully"))
})

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getVideoLikes }