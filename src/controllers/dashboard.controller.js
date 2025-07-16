import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js"
import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    //video, video views => video model, subs => subscription model, total likes => like model

    const {userId} = req.params

    if(!userId) {
        throw new apiError(404, "User not found")
    }

    const videos = await Video.find({owner: userId}).select("_id views")
    const videoIds = videos.map(v => v._id)
 
    if(!videos) {
        throw new apiError(402, "Failed to get video stats")
    }

    const subscribers = await Subscription.countDocuments({channel: userId})

    if(!subscribers) {
        throw new apiError(403, "Failed to get subscribers")
    }

    const likesOnVideosOfUser = await Like.countDocuments({video: {$in: videoIds}})

    if(!likesOnVideosOfUser) {
        throw new apiError(405, "Failed to get likes")
    }

    return res.status(200).json(new apiResponse(200, {
        videos,
        subscribers,
        likesOnVideosOfUser
    }, "Channel stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
})

export {
    getChannelStats,
    getChannelVideos
}