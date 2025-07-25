/*
  id string pk
  videoFile string
  thumbnail string
  owner ObjectId users
  title string
  description string
  duration number
  views number
  isPublished boolean
  createdAt Date
  updatedAt Date
*/

import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema =new Schema(
    {
        videoFile: {
            type: String,    //cloudinary URL
            required: true,
        },
        thumbnail: {
            type: String,    //cloudinary URL
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        views: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
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
        }
    }, {timestamps: true}
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)