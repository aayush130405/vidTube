import { Router } from "express"
import { getVideoComments, addComment, updateComment, deleteComment } from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = Router()

//all the routes for comments
router.route("/add-comment/:videoId").post(verifyJWT, addComment)
router.route("/get-comment/:videoId").get(verifyJWT, getVideoComments)
router.route("/update-comment/:commentId").patch(verifyJWT, updateComment)
router.route("/delete-comment/:commentId").patch(verifyJWT, deleteComment)

export default router