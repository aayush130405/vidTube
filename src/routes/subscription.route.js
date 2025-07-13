import { Router } from "express";
import {toggleSubscription, getSubscribedChannels, getUserChannelSubscribers} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

//routes
router.route("/toggle-subscription/:channelId").patch(verifyJWT, toggleSubscription)

export default router
