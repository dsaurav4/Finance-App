import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**/
/*

NAME

        uploadOnCloudinary - Uploads a file from a buffer to Cloudinary.

SYNOPSIS

        uploadOnCloudinary(fileBuffer)
              fileBuffer --> The file data as a buffer in memory.

DESCRIPTION

        The uploadOnCloudinary function uploads a file to Cloudinary by streaming a buffer. This is suitable for serverless or ephemeral file system environments.

RETURNS

        Returns the response from Cloudinary if the file is uploaded successfully, otherwise returns a rejected promise.

*/
/**/
const uploadOnCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // Use upload_stream to handle the buffer
    const cloudStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        console.log("File Uploaded Successfully", result.url);
        resolve(result);
      }
    );

    // Create a readable stream from the buffer and pipe it to Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(cloudStream);
  });
};

export default uploadOnCloudinary;
