import { Router } from "express"
import { getAllVideos, uploadVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus } from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js"

const router = Router()

router.route("/").get(verifyJWT, getAllVideos)

router.route("/upload").post(verifyJWT,
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        },              
        {
            name: "videoFile",
            maxCount: 1
        }
    ]),
    uploadVideo)

router.route("/get-video-by-id/:videoId").get(verifyJWT, getVideoById)

router.route("/update-video/:videoId").patch(verifyJWT,
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    updateVideo)

router.route("/delete-video/:videoId").patch(verifyJWT, deleteVideo)

router.route("/toggle-publish-status/:videoId").patch(verifyJWT, togglePublishStatus)

export default router

