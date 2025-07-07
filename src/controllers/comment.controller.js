//imports
import { Comment } from "../models/comment.models.js"
import { apiResponse } from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

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
    
    const {commentId} = req.params

    if(!commentId) {
        throw new apiError(401, "Comment ID can not be grabbed")
    }

    const {content} = req.body

    const updatedComment = await Comment.findByIdAndUpdate(commentId,{
        $set: {
            content: content,
            updatedAt: new Date()
        }
    },{new: true})

    if(!updatedComment) {
        throw new apiError(402, "Failed to update comment")
    }
    
    return res.status(200).json(new apiResponse(200, updatedComment, "Comment updated successfully"))
})

//soft delete
const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    if(!commentId) {
        throw new apiError(401, "Comment ID is required")
    }

    const deletedComment = await Comment.findByIdAndUpdate(commentId, {
        $set: {
            isDeleted: true,
            deletedAt: new Date()
        }
    }, {new: true})

    if(!deleteComment) {
        throw new apiError(402, "Failed to delete comment")
    }

    return res.status(200).json(new apiResponse(200, deletedComment, "Comment deleted successfully"))
})

//exports
export {getVideoComments, addComment, updateComment, deleteComment}