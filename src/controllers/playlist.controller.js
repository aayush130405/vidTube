import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Playlist } from "../models/playlist.models.js";

const createPlaylist = asyncHandler(async (req,res) => {
    //name and description from the body
    //owner from req.user?._id => can be done due to verifyJWT middleware
    const {name, description} = req.body

    if([name,description].some(field => field.trim() === "")) {
        throw new apiError(401, "All fields are required")
    }

    const createdPlaylist = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    })

    if(!createdPlaylist) {
        throw new apiError(402, "Failed to create the playlist")
    }

    return res.status(200).json(new apiResponse(200, createdPlaylist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req,res) => {

})

const getVideoById = asyncHandler(async (req,res) => {

})

const addVideoToPlaylist = asyncHandler(async (req,res) => {

})

const removeVideoFromPlaylist = asyncHandler(async (req,res) => {

})

const deletePlaylist = asyncHandler(async (req,res) => {

})

const updatePlaylist = asyncHandler(async (req,res) => {

})

export { createPlaylist, getUserPlaylists, getVideoById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist }