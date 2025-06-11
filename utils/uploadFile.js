import {v2 as cloudinary} from "cloudinary"
export const uploadFileToCloudinary = async (file,folder) => {
    const options ={folder}
    return await cloudinary.uploader.upload(file.tempFilePath, options)
    console.log("File in cloudinary", file)

}


export const uploadVideo = async () => {
    
}

