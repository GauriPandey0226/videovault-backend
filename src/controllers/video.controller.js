import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"



// ✅ Get all videos (query, sort, pagination)
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query

    const filter = {}
    if (query) {
        filter.title = { $regex: query, $options: "i" }
    }
    if (userId && isValidObjectId(userId)) {
        filter.owner = userId
    }

    const sortOptions = {}
    sortOptions[sortBy] = sortType === "asc" ? 1 : -1

    const videos = await Video.find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate("owner", "username email")

    const total = await Video.countDocuments(filter)

    return res.status(200).json(
        new ApiResponse(200, { videos, total, page, pages: Math.ceil(total / limit) }, "Videos fetched successfully")
    )
})

// ✅ Publish (upload video + thumbnail to Cloudinary, create record)
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    if (!req.files?.videoFile?.[0] || !req.files?.thumbnail?.[0]) {
        throw new ApiError(400, "Video file and thumbnail are required")
    }

    const videoUpload = await uploadOnCloudinary(req.files.videoFile[0].path, "video")
    const thumbnailUpload = await uploadOnCloudinary(req.files.thumbnail[0].path, "image")

    if (!videoUpload?.url || !thumbnailUpload?.url) {
        throw new ApiError(500, "Error uploading files to Cloudinary")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoUpload.url,      // ✅ match schema
        thumbnail: thumbnailUpload.url,  // ✅ match schema
        duration: videoUpload.duration || 0,
        owner: req.user._id,
    })

    return res.status(201).json(new ApiResponse(201, video, "Video published successfully"))
})

// ✅ Get video by ID (increment views)
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },   // increment views by 1
        { new: true }
    ).populate("owner", "username email")

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"))
})

// ✅ Update video
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const { title, description } = req.body
    const updateFields = {}
    if (title) updateFields.title = title
    if (description) updateFields.description = description

    if (req.files?.thumbnail?.[0]) {
        const thumbnailUpload = await uploadOnCloudinary(req.files.thumbnail[0].path, "image")
        if (thumbnailUpload?.url) {
            updateFields.thumbnail = thumbnailUpload.url
        }
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, { $set: updateFields }, { new: true })
    if (!updatedVideo) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully"))
})

// ✅ Delete video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const deleted = await Video.findByIdAndDelete(videoId)
    if (!deleted) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"))
})

// ✅ Toggle publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res.status(200).json(new ApiResponse(200, video, "Publish status updated successfully"))
})

// const getAllVideos = asyncHandler(async (req, res) => {
//     const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
//     //TODO: get all videos based on query, sort, pagination
// })

// const publishAVideo = asyncHandler(async (req, res) => {
//     const { title, description} = req.body
//     // TODO: get video, upload to cloudinary, create video
// })

// const getVideoById = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
//     //TODO: get video by id
// })

// const updateVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
//     //TODO: update video details like title, description, thumbnail

// })

// const deleteVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
//     //TODO: delete video
// })

// const togglePublishStatus = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
// })

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}











