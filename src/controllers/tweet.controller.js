import { Tweet } from "../models/tweet.models.js"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"

/*
    1. Create a tweet
    2. Get tweets
    3. Update a tweet
    4. Delete a tweet
*/      

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body

    if(!content) {
        throw new apiError("Content is required", 400)
    }
    
    // req.user is available from verifyJWT middleware
    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })
    
    if (!tweet) {
        throw new apiError(500, "Something went wrong while creating the tweet")
    }
    
    return res
        .status(201)
        .json(new apiResponse(201, tweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if(!user) {
        throw new apiError("User not found", 404)
    }

    const tweets = await Tweet.find({owner:user})

    if(!tweets) {
        throw new apiError("No tweets found", 404)
    }

    return res.status(200).json(new apiResponse(200, tweets, "Tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const {content} = req.body

    if(!tweetId) {
        throw new apiError("Tweet ID is required", 400)
    }

    if(!content) {
        throw new apiError("Content is required", 400)
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet) {
        throw new apiError("Tweet not found", 404)
    }

    //check if the user owns the tweet
    if(tweet.owner.toString() !== req.user._id.toString()) {
        throw new apiError("You can only update your own tweets", 403)
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {
        $set: {
            content: content
        }
    }, {new: true})

    if(!updatedTweet) {
        throw new apiError("Something went wrong while updating the tweet", 500)
    }

    return res.status(200).json(new apiResponse(200, updatedTweet, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //get tweet -> delete tweet -> send the response to the client
})

export { createTweet, getUserTweets, updateTweet, deleteTweet }