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

const createTweeet = asyncHandler(async (req, res) => {
    //get the tweet -> get the associated user -> create the tweet in db -> send the body response to db -> send the response to the client
})

const getUserTweets = asyncHandler(async (req, res) => {
    //get user -> get tweets -> send the response to the client

})

const updateTweet = asyncHandler(async (req, res) => {
    //get tweet -> update tweet -> send the response to the client
})

const deleteTweet = asyncHandler(async (req, res) => {
    //get tweet -> delete tweet -> send the response to the client
})

export { createTweeet, getUserTweets, updateTweet, deleteTweet }