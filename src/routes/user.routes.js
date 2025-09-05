import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory, 
    updateAccountDetails
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

// router.route("/register").post(
//      (req, res, next) => {
//       console.log("Route /register hit");
//       console.log("Files received:", req.files);
//       next();
//     },
//     upload.fields([
//         {
//             name: "avatar",
//             maxCount: 1
//         }, 
//         {
//             name: "coverImage",
//             maxCount: 1
//         }
//     ]),
//     registerUser
//     );
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Secured Routes (require JWT)
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-avatar").patch(
  verifyJWT,
  upload.single("avatar"),
  updateUserAvatar
);

router.route("/update-cover").patch(
  verifyJWT,
  upload.single("coverImage"),
  updateUserCoverImage
);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);
router.route("/watch-history").get(verifyJWT, getWatchHistory);

export default router;