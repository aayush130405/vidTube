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
    const { userId } = req.params

    if(!userId) {
        throw new apiError(401, "User ID is required")
    }

    const userPlaylists = await Playlist.find({owner: userId})

    if(!userPlaylists) {
        throw new apiError(402, "Failed to create user playlists")
    }

    return res.status(200).json(new apiResponse(200, userPlaylists, "User playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req,res) => {
    const { playlistId } = req.params

    if(!playlistId) {
        throw new apiError(401, "Playlist ID is required")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist) {
        throw new apiError(402, "Failed to grab playlists")
    }

    return res.status(200).json(new apiResponse(200, playlist, "Playlists grabbed successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req,res) => {
    const {playlistId, videoId} = req.params

    if([videoId, playlistId].some(field => field.trim() === "")) {
        throw new apiError(401, "All fields are required")
    }

    const addingVideoToPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        $addToSet: {
            videos: videoId
        }
    } , {new: true})

    if(!addingVideoToPlaylist) {
        throw new apiError(402, "Failed to add video to playlist")
    }

    return res.status(200).json(new apiResponse(200, addingVideoToPlaylist, "Successfully added video to playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async (req,res) => {
    const {videoId, playlistId} = req.params

    if([videoId, playlistId].some(field => field.trim() === "")) {
        throw new apiError(401, "All fields are required")
    }

    const videoToRemoveFromPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        $pull: {
            videos: videoId
        }
    }, {new: true})

    if(!videoToRemoveFromPlaylist) {
        throw new apiError(402, "Failed to remove video from playlist")
    }

    return res.status(200).json(new apiResponse(200, videoToRemoveFromPlaylist, "Video removed from playlist"))
})

const deletePlaylist = asyncHandler(async (req,res) => {

})

const updatePlaylist = asyncHandler(async (req,res) => {

})

export { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist }