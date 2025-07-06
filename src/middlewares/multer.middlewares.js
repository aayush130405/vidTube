//in this file we are just handling how we keep files in our server and configuring it with the help of multer-middleware


//use-case => whenever a user requests to upload an image or file, this middleware gets kicked in, handles how that image/file will be saved in our server then sends it to next service where uploading takes place for ex-> cloudinary...

import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/temp')
    },
    filename: function (req,file,cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 100MB limit
        files: 2 // Allow up to 2 files
    }
})