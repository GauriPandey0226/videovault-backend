import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


// const toggleSubscription = asyncHandler(async (req, res) => {
//     const {channelId} = req.params
//     // TODO: toggle subscription
// })
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const subscriberId = req.user._id   // logged-in user

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId")
    }

    if (subscriberId.toString() === channelId.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself")
    }

    const existingSub = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    })

    if (existingSub) {
        // Already subscribed → Unsubscribe
        await Subscription.findByIdAndDelete(existingSub._id)
        return res
            .status(200)
            .json(new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully"))
    } else {
        // Not subscribed → Subscribe
        const newSub = await Subscription.create({
            subscriber: subscriberId,
            channel: channelId
        })
        return res
            .status(201)
            .json(new ApiResponse(201, { subscribed: true, subscription: newSub }, "Subscribed successfully"))
    }
})

// controller to return subscriber list of a channel
// const getUserChannelSubscribers = asyncHandler(async (req, res) => {
//     const {channelId} = req.params
// })

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId")
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username email avatar") // populate basic user info
        .exec()

    return res
        .status(200)
        .json(new ApiResponse(200, subscribers, "Fetched channel subscribers successfully"))
})

// controller to return channel list to which user has subscribed
// const getSubscribedChannels = asyncHandler(async (req, res) => {
//     const { subscriberId } = req.params
// })

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriberId")
    }

    const channels = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "username email avatar") // populate channel info
        .exec()

    return res
        .status(200)
        .json(new ApiResponse(200, channels, "Fetched subscribed channels successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}