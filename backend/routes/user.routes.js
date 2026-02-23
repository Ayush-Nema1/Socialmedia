import { Router } from "express";
import {
  login,
  register,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
  sendConnectionRequest,
  getmyConnectionRequests,
  whatAreMyConnections,
  acceptConnectionRequest,
  getUserbyusername
} from "../controllers/user.controllers.js";

import {upload} from "../middleware/upload.middleware.js";

const router = Router();

// Cloudinary upload middleware
router.post(
  "/update_profile_picture",
  upload.single("profile_picture"),
  uploadProfilePicture
);

router.post("/register", register);
router.post("/login", login);
router.post("/user_update", updateUserProfile);
router.get("/get_user_and_profile", getUserAndProfile);
router.post("/update_profile_data", updateProfileData);
router.get("/users/get_all_users", getAllUserProfile);
router.get("/user/dowmload_resume", downloadProfile);
router.post("/user/send_connection_request", sendConnectionRequest);
router.get("/user/getConnectionRequests", getmyConnectionRequests);
router.get("/user/user_connection_request", whatAreMyConnections);
router.post("/user/accept_connection_request", acceptConnectionRequest);
router.get("/user/get_profile_basedonusername", getUserbyusername);

export default router;