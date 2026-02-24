import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "profile_pictures",
      format: file.mimetype.split("/")[1], 
    };
  },
});

const postStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "post_media",
      format: file.mimetype.split("/")[1],
    };
  },
});

export const uploadProfile = multer({ storage: profileStorage });
export const uploadPost = multer({ storage: postStorage });