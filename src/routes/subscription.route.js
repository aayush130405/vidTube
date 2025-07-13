import { Router } from "express";
import {toggleSubscription, getSubscribedChannels, getUserChannelSubscribers} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

//routes
router.route("/toggle-subscription/:channelId").patch(verifyJWT, toggleSubscription)
router.route("/get-subscribers-list/:channelId").get(verifyJWT, getUserChannelSubscribers)
router.route("/get-subscribed-channels/:subscriberId").get(verifyJWT, getSubscribedChannels)

export default router
