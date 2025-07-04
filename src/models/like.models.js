/*
  id string pk
  createdAt Date
  updatedAt Date
  comment ObjectId comments
  video ObjectId videos
  likedBy ObjectId users
  tweet ObjectId tweets
*/

import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        //either of video, comment or tweet will be filled rest will be NULL

        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        likedby: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
        ,
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        }
    }, {timestamps: true}
)

export const Like = mongoose.model("Like", likeSchema)