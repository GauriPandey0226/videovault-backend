import mongoose from "mongoose"
import Comment from "../models/comment.model.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

// const getVideoComments = asyncHandler(async (req, res) => {
//     //TODO: get all comments for a video
//     const {videoId} = req.params
//     const {page = 1, limit = 10} = req.query

// })

// const addComment = asyncHandler(async (req, res) => {
//     // TODO: add a comment to a video
// })

// const updateComment = asyncHandler(async (req, res) => {
//     // TODO: update a comment
// })

// const deleteComment = asyncHandler(async (req, res) => {
//     // TODO: delete a comment
// })
    

// ✅ Get all comments for a video (with pagination)
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const commentsAggregate = Comment.aggregate([
        { $match: { video: new mongoose.Types.ObjectId(videoId) } },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [{ $project: { fullName: 1, username: 1, avatar: 1 } }]
            }
        },
        { $unwind: "$owner" },
        { $sort: { createdAt: -1 } }
    ])

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const comments = await Comment.aggregatePaginate(commentsAggregate, options)

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"))
})


// ✅ Add a comment to a video
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content is required")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"))
})


// ✅ Update a comment
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content is required")
    }

    const comment = await Comment.findOneAndUpdate(
        { _id: commentId, owner: req.user._id },
        { content },
        { new: true }
    )

    if (!comment) {
        throw new ApiError(404, "Comment not found or not authorized")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment updated successfully"))
})


// ✅ Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    const comment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: req.user._id
    })

    if (!comment) {
        throw new ApiError(404, "Comment not found or not authorized")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }