import { Router } from "express";

import { registerUser, logoutUser, loginUser, refreshAccessToken } from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

//using Multer middleware here to handle file uploads (like user avatars) during registration.
import { upload } from "../middlewares/multer.middlewares.js"

const router = Router()

//unsecured routes (can be accessed by anyone, do not have to use verifyJWT)
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

export default router