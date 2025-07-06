import { apiResponse } from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose, {isValidObjectId} from "mongoose"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"

const uploadVideo = asyncHandler(async (req, res) => {
    const {title, description} = req.body

    if([title,description].some(field => field?.trim() === "")) {
        throw new apiError(400, "All fields are required")
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path
    if(!videoFileLocalPath) {
        throw new apiError(400, "Video file is required")
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    if(!thumbnailLocalPath) {
        throw new apiError(400, "Thumbnail file is required")
    }

    let videoFile = null
    let thumbnail = null

    try {
        videoFile = await uploadOnCloudinary(videoFileLocalPath)
        if (!videoFile) {
            throw new apiError(500, "Failed to upload video file")
        }

        thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if (!thumbnail) {
            throw new apiError(500, "Failed to upload thumbnail")
        }

        const video = await Video.create({
            videoFile: videoFile.url,
            thumbnail: thumbnail.url,
            title,
            description,
            views: 0,
            owner: req.user?._id
        })
    
        const uploadedVideo = await Video.findById(video._id).select("-videoFile -thumbnail")
    
        if(!uploadedVideo) {
            throw new apiError(500, "Something went wrong while uploading the video")
        }
    
        return res.status(201).json(new apiResponse(201, uploadedVideo, "Video uploaded successfully"))
    } catch (error) {
        // Clean up uploaded files if there was an error
        if(videoFile?.public_id) {
            await deleteFromCloudinary(videoFile.public_id)
        }
        if(thumbnail?.public_id) {
            await deleteFromCloudinary(thumbnail.public_id)
        }
        throw new apiError(500, "Something went wrong while uploading the video")
    }
})

const getAllVideos = asyncHandler(async (req, res) => {
    //we will have the _id of user req.user through verifyJWT middleware, we need to get all videos that match the user id
    const user = req.user?._id
    if(!user) {
        throw new apiError(401, "User not found")
    }

    const videos = await Video.find({owner: user}).select("-videoFile -thumbnail")

    if(!videos) {
        throw new apiError(404, "No videos found")
    }

    return res.status(200).json(new apiResponse(200, videos, "Videos fetched successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    const video = await Video.findById(videoId)

    if(!video) {
        throw new apiError(404, "Video not found")
    }

    return res.status(200).json(new apiResponse(200, video, "Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    //expecting title,description in body and thumbnail in path
    const {videoId} = req.params
    if(!videoId) {
        throw new apiError(400, "Video ID is required")
    }

    const {title, description} = req.body
    if([title,description].some(field => field?.trim() === "")) {
        throw new apiError(400, "All fields are required")
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    if(!thumbnailLocalPath) {
        throw new apiError(401, "Thumbnail not found")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnail) {
        throw new apiError(402, "Failed to upload thumbnail")
    }

    const video = await Video.findByIdAndUpdate(videoId,{
        $set: {
            title: title,
            description: description,
            thumbnail: thumbnail.url,
            updatedAt: new Date()
        }
    },{new: true})

    if(!video) {
        throw new apiError(404, "Video can not be updated")
    }

    return res.status(200).json(new apiResponse(200, video, "Video updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {

})

const togglePublishStatus = asyncHandler(async (req, res) => {

})

export { getAllVideos, uploadVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus }

