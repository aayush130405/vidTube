import { Router } from "express"
import { createTweet, getUserTweets, updateTweet, deleteTweet } from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = Router()

router.route("/create").post(verifyJWT, createTweet)
router.route("/get-tweets").get(verifyJWT, getUserTweets)
router.route("/update/:tweetId").patch(verifyJWT, updateTweet)
router.route("/delete/:tweetId").patch(verifyJWT, deleteTweet)

export default router

