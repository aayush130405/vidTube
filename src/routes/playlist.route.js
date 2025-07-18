import { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { Router } from "express";

const router = Router()

//all routes
router.route("/create-playlist").post(verifyJWT, createPlaylist)
router.route("/get-user-playlists/:userId").get(verifyJWT, getUserPlaylists)
router.route("/get-playlist-by-id/:playlistId").get(verifyJWT, getPlaylistById)
router.route("/add-video-to-playlist/:playlistId/:videoId").patch(verifyJWT, addVideoToPlaylist)
router.route("/remove-video-from-playlist/:playlistId/:videoId").patch(verifyJWT, removeVideoFromPlaylist)
router.route("/delete-playlist/:playlistId").patch(verifyJWT, deletePlaylist)
router.route("/update-playlist/:playlistId").patch(verifyJWT, updatePlaylist)

export default router