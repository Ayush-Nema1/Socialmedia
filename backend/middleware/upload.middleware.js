import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pictures",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "post_media",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export const uploadProfile = multer({ storage: profileStorage });
export const uploadPost = multer({ storage: postStorage });