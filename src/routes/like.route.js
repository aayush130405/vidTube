import { Router } from "express";

import { toggleVideoLike, toggleCommentLike, toggleTweetLike, getVideoLikes } from "../controllers/like.controller.js"

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

//all the routes
router.route("/like-video/:videoId").post(verifyJWT, toggleVideoLike)
router.route("/like-comment/:commentId").post(verifyJWT, toggleCommentLike)
router.route("/like-tweet/:tweetId").post(verifyJWT, toggleTweetLike)
router.route("/get-video-likes/:videoId").get(verifyJWT, getVideoLikes)

export default router