import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.models.js";
import mongoose, {isValidObjectId} from "mongoose";


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
})

const getVideoLikes = asyncHandler(async (req,res) => {
    //get all liked videos
})

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getVideoLikes }