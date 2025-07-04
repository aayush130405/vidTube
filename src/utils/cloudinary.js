//This code uploads a local file to Cloudinary, lets Cloudinary detect the file type, waits for the upload to finish, and then logs the URL of the uploaded file.

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

//configure cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"})
        console.log("File uploaded on cloudinary, File src : " + response.url);

        //once file is uploaded we want to delete it from our server
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        console.log("Error on cloudinary ",error);
        fs.unlinkSync(localFilePath)
        return null
    }
}

const deleteFromCloudinary = async (publicid) => {
    try {
        const result = await cloudinary.uploader.destroy(publicid)
        console.log("Deleted from cloudinary", publicid);
    } catch (error) {
        console.log("Error deleting from cloudinary",error);
        return null
    }
}

export {deleteFromCloudinary}
export {uploadOnCloudinary}