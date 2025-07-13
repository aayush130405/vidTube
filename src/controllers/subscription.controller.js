import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.model.js";

const toggleSubscription = asyncHandler(async (req,res) => {
    const {channelId} = req.params
    
    if(!channelId) {
        throw new apiError(400, "Channel ID is required")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: channelId
    })

    if(existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id)

        return res.status(200).json(new apiResponse(200, {}, "Subscription removed successfully"))
    } else {
        const subscriptionCreated = await Subscription.create({
            subscriber: req.user?._id,
            channel: channelId
        })

        return res.status(200).json(new apiResponse(200, subscriptionCreated, "Subscription created successfully"))
    }
})

const getUserChannelSubscribers = asyncHandler(async (req,res) => {

})

const getSubscribedChannels = asyncHandler(async (req,res) => {

})

export {
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscribers
}