// This file defines a middleware function called verifyJWT that protects routes by verifying the user's JWT (JSON Web Token).
// It ensures that only authenticated users can access certain endpoints in your app.


import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { apiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const verifyJWT = asyncHandler(async (req,res,next) => {
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token) {
        throw new apiError(401, "Unauthorized")
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user) {
            throw new apiError(401, "Unauthorized")
        }

        req.user = user     //doing this so that we can access the user in the next middleware or controller
    
        next()      //pushes to the next middleware or controller in sequence
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token")
    }
})


//   => FLOW
/*
    1.grab the accesstoken from the req.cookie or req.header
    2.error if not grabbed and move on if grabbed
    3.use jwt.verify to decode the grabbed token and find the corresponding user
    4.use DB query => .findById() to find the user from the decodedToken's id
    5.save the user to req.user that will be used in the next middleware or controller
    6.move the flow to next middleware or controller 
*/

