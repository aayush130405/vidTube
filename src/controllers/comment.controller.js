//imports
import { Comment } from "../models/comment.models.js"
import { apiResponse } from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose"

//methods
const addComment = asyncHandler(async (req, res) => {
    
    const {videoId} = req.params

    if(!videoId) {
        throw new apiError(400, "Video ID is required")
    }
    
    const {content} = req.body

    if(!content) {
        throw new apiError(400, "Content is required")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    })

    if(!comment) {
        throw new apiError(400, "Failed to add comment")
    }

    return res.status(200).json(new apiResponse(200, comment, "Comment added successfully"))
})

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if(!videoId) {
        throw new apiError(400, "Video ID not found")
    }

    const comments = await Comment.find({video: videoId})
    if(!comments) {
        throw new apiError(402, "Failed to find comments")
    }

    return res.status(200).json(new apiResponse(200, comments, "Successfully grabbed comments"))
})

const updateComment = asyncHandler(async (req, res) => {

})

const deleteComment = asyncHandler(async (req, res) => {

})

//exports
export {getVideoComments, addComment, updateComment, deleteComment}