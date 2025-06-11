import {v2 as cloudinary} from "cloudinary"

//step1
export const cloudinaryConnect = ()=>{
    try {
        cloudinary.config({
            cloud_name:process.env.CLOUDE_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET
        })
    } catch (error) {
        console.log("Error in config cloudinary",error)
    }
}