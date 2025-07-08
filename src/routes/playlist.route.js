import { createPlaylist, getUserPlaylists, getVideoById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { Router } from "express";

const router = Router()

//all routes
router.route("/create-playlist").post(verifyJWT, createPlaylist)

export default router