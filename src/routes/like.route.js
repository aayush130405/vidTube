import { Router } from "express";

import { toggleVideoLike, toggleCommentLike, toggleTweetLike, getVideoLikes } from "../controllers/like.controller.js"

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

//all the routes
router.route("/like-video/:videoId").post(verifyJWT, toggleVideoLike)

export default router