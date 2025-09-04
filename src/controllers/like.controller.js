import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

// const toggleVideoLike = asyncHandler(async (req, res) => {
//     const {videoId} = req.params
//     //TODO: toggle like on video
// })

// const toggleCommentLike = asyncHandler(async (req, res) => {
//     const {commentId} = req.params
//     //TODO: toggle like on comment

// })

// const toggleTweetLike = asyncHandler(async (req, res) => {
//     const {tweetId} = req.params
//     //TODO: toggle like on tweet
// }
// )

// const getLikedVideos = asyncHandler(async (req, res) => {
//     //TODO: get all liked videos
// })
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID")
    }

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId })

    if (existingLike) {
        await existingLike.deleteOne()
        return res
            .status(200)
            .json(new ApiResponse(200, { liked: false }, "Video like removed"))
    }

    await Like.create({ video: videoId, likedBy: userId })
    return res
        .status(201)
        .json(new ApiResponse(201, { liked: true }, "Video liked successfully"))
})


// Toggle Like on Comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment ID")
    }

    const existingLike = await Like.findOne({ comment: commentId, likedBy: userId })

    if (existingLike) {
        await existingLike.deleteOne()
        return res
            .status(200)
            .json(new ApiResponse(200, { liked: false }, "Comment like removed"))
    }

    await Like.create({ comment: commentId, likedBy: userId })
    return res
        .status(201)
        .json(new ApiResponse(201, { liked: true }, "Comment liked successfully"))
})


// Toggle Like on Tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID")
    }

    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId })

    if (existingLike) {
        await existingLike.deleteOne()
        return res
            .status(200)
            .json(new ApiResponse(200, { liked: false }, "Tweet like removed"))
    }

    await Like.create({ tweet: tweetId, likedBy: userId })
    return res
        .status(201)
        .json(new ApiResponse(201, { liked: true }, "Tweet liked successfully"))
})


// Get all liked videos of a user
const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const likedVideos = await Like.find({ likedBy: userId, video: { $ne: null } })
        .populate("video")

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Fetched liked videos successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}