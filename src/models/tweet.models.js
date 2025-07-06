/*
  id string pk
  createdAt Date
  updatedAt Date
  owner ObjectId users
  content string
  isDeleted boolean (for soft delete)
  deletedAt Date (when deleted)
  deletedBy ObjectId (who deleted)
*/

import mongoose,{ Schema } from "mongoose";

const tweetSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        },
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    }, {timestamps: true}
)

export const Tweet = mongoose.model("Tweet", tweetSchema)