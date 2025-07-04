import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { deleteFromCloudinary } from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import mongoose, { mongo } from "mongoose"

//pass userid -> generate access token -> give back refresh token
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
    
        if(!user) {
            throw new apiError(401, "No user can be found with the provided id")
        }
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken            //passing the refresh token we generated to user schema's refresh token
        await user.save({validateBeforeSave: false})        //saving the change in the user schema (i.e. refreshToken change)
    
        return { accessToken,refreshToken }
    } catch (error) {
        throw new apiError(500, "Something went wrong while generating access and refresh tokens")
    }
}

//registering user
const registerUser = asyncHandler( async (req,res) => {
    const {fullname, email, username, password} = req.body      //DESTRUCTURING

    //validation
    if([fullname,username,email,password].some( (field) => field?.trim() === "" )){
        throw new apiError(400, "All fields are required!!!")
    }   //if any field is empty throw error

    //checking if some user already exists in the DB
    const existingUser = await User.findOne({
        $or: [{username},{email}]
    })

    if (existingUser) {
        throw new apiError(409, "User with email or username already exists")
    }

    console.warn(req.files);

    //now handling images
    const avatarLocalPath = req.files?.avatar?.[0]?.path      //this path comes from multer
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path      //this path comes from multer

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is missing")
    }

    // const avatar = await uploadOnCloudinary(avatarLocalPath)
    
    // let coverImage = ""
    // if (coverImageLocalPath) {
    //     coverImage = await uploadOnCloudinary(coverImageLocalPath)
    // }


    //refactoring uploading part
    let avatar;
    try {
        avatar = await uploadOnCloudinary(avatarLocalPath)
        console.log("Uploaded avatar",avatar)
    } catch (error) {
        console.log("Error uploading avatar",error)
        throw new apiError(500, "Failed to upload avatar")
    }

    let coverImage;
    try {
        coverImage = await uploadOnCloudinary(coverImageLocalPath)
        console.log("Uploaded avatar",coverImage)
    } catch (error) {
        console.log("Error uploading cover image",error)
        throw new apiError(500, "Failed to upload cover image")
    }

    //constructing a new user
    try {
        const user = await User.create({
            avatar: avatar.url,     //required field, HAS to exist
            coverImage: coverImage?.url || "",      //optional field, MAY exist
            fullname,
            email,
            password,
            username : username.toLowerCase()
        })
    
        const createdUser = await User.findById(user._id).select("-password -refreshToken")
    
        if (!createdUser) {
            throw new apiError(500, "Something went wrong while registering a user")
        }
    
        return res
            .status(201)
            .json(new apiResponse(200, createdUser, "User registered successfully"))
    } catch (error) {
        console.log("User creation failed",error)

        if (avatar) {
            await deleteFromCloudinary(avatar.public_id)
        }
        if (coverImage) {
            await deleteFromCloudinary(coverImage.public_id)
        }

        throw new apiError(500, "Something went wrong while registering a user and images were deleted")
    }
})


//logging in
const loginUser = asyncHandler(async (req,res) => {
    const {email, password, username} = req.body

    //validation
    if(!email || !password || !username){
        throw new apiError(400, "All fields are required")
    }

    //checking if user exists in the DB
    const user = await User.findOne({
        $or:[{username},{email}]
    })

    if(!user) {
        throw new apiError(404, "User not found")
    }

    //validate password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new apiError(401, "Invalid credentials")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    if(!loggedInUser) {
        throw new apiError(405, "Failed to grab logged in user details")
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse(
            200,
            {user: loggedInUser, refreshToken, accessToken}, 
            "User logged in successfully"
        ))
})

const logoutUser = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(       //setting the refresh token to undefined
        req.user._id,{      //able to grab req.user._id due to the auth middleware
            $set:{
                refreshToken: undefined
            }
        },
        {new: true}
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {} ,"User logged out successfully"))
})

//want to refresh access token
const refreshAccessToken = asyncHandler( async (req,res) => {

    const incomingRefreshToken = req.cookie || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new apiError(401, "Refresh token is required")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if(!user) {
            throw new apiError(401, "Invalid refresh token")
        }

        if(incomingRefreshToken !== user?.refreshToken) {
            throw new apiError(401, "Invalid refresh token")
        }

        //sending new token to user
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }

        const {accessToken, refreshToken: newRefreshToken} = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("access token",accessToken,options)
            .cookie("refresh token",newRefreshToken,options)
            .json(new apiResponse(200,{accessToken,refreshToken:newRefreshToken}),"Access token refreshed successfully")
    } catch (error) {
        throw new apiError(500,"Something went wrong while refreshing token")
    }
}) 

const changeCurrentPassword = asyncHandler( async (req,res) => {

    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)     //have access to this because of auth.middleware.js

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid) {
        throw new apiError(401,"Old password is incorrect")
    }

    user.password = newPassword
    
    await user.save({validateBeforeSave: false})        //save new password in user DB

    return res
        .status(200)
        .json(new apiResponse(200,{}, "Password changed successfully"))
    })
    
const getCurrentUser = asyncHandler(async (req,res) => {
    return res
        .status(200)
        .json(new apiResponse(200, req.user, "Current user details"))
})

const updateAccountDetails = asyncHandler(async (req,res) => {
    // take only fullname and email for updation
    const {email, fullname} = req.body

    if(!fullname || !email) {
        throw new apiError(400, "Fullname and email fields are required")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullname,
            email
        }
    },
    {new: true}
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new apiResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req,res) => {
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath) {
        throw new apiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url) {
        throw new apiError(500, "Failed to upload avatar")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, 
        {
            $set: {
                avatar: avatar.url
            }
        }
        ,{new: true}
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new apiResponse(200, user, "Avatar updated successfully"))
})

const updateUserCoverImage = asyncHandler(async (req,res) => {
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath) {
        throw new apiError(400, "Cover image is required")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url) {
        throw new apiError(500, "Failed to upload cover image")
    }

    const user = User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            } 
        },{new: true}
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new apiResponse(200, user, "Cover image updated successfully"))
})

//getting user profile by their username
const getUserChannelProfile = asyncHandler(async (req,res) => {
    const {username} = req.params       //get username from the frontend i.e. the URL

    if(!username?.trim()) {
        throw new apiError(400, "Username is required")
    }

    const channel = await User.aggregate(
        [
            {
                //Find the user document where the username matches the provided username
                $match: {
                    username: username?.toLowerCase()
                }
            },
            {
                //collecting all the channels from the subscription model who matches the _id in user and these will be my subs
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            {
                //gathering all the channels i have subscribed to 
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                }
            },
            {
                $addFields: {
                    subscribersCount: {
                        $size: "$subscribers"
                    },
                    channelsSubscribedToCount: {
                        $size: "$subscribedTo"
                    },
                    isSubscribed: {
                        $cond: {
                            if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                //project only the necessary data
                $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                    subscribersCount: 1,
                    channelsSubscribedToCount: 1,
                    isSubscribed: 1,
                    coverImage: 1,
                    email: 1
                }
            }
        ]
    )    
     
    if(!channel?.length){
        throw new apiError(404, "Channel not found")
    }

    return res
        .status(200)
        .json(new apiResponse(200, channel[0], "Channel profile fetched successfully"))
})

const getWatchHistory = asyncHandler(async (req,res) => {
    const user = User.aggregate([
        {
            $match: {
                _id: req.user?._id              //POSSIBLE ERROR...... due to deprecation
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",        //this is the video id
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {

                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    if(!user) {
        throw new apiError(404, "User not found")
    }

    return res
        .status(200)
        .json(new apiResponse(200, user[0]?.watchHistory, "Watch history fetched successfully"))
})

export { registerUser, loginUser, refreshAccessToken, logoutUser, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory }
