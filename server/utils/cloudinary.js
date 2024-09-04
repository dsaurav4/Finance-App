import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (loaclFilePath) => {
  try {
    if (!loaclFilePath) return null;
    const response = await cloudinary.uploader.upload(loaclFilePath, {
      resource_type: "image",
    });
    console.log("File Uploaded Successfully", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(loaclFilePath);
    console.log(error);
    return null;
  }
};

export default uploadOnCloudinary;
