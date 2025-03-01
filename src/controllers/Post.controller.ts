import { NextFunction, Response } from "express";
import { CustomError, UserRequest } from "../interface/IUser";
import ApiError from "../utils/ApiError";
import { Post } from "../models/Post.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import ApiResponse from "../utils/ApiResponse";

export const createPost=async(req:UserRequest,res:Response)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(401, "Unauthorized request");
        }
        const {title, description} = req.body;
        const imageFiles = 
        req.files as {[fieldname: string]: Express.Multer.File[]} | undefined;
        const imageLocalPath = imageFiles?.image?.[0]?.path;
        if(!imageLocalPath){
            throw new ApiError(400, "Image not uploaded");
        }
        const postImage = await uploadOnCloudinary(imageLocalPath);
        if(!postImage){
            throw new ApiError(400, "Image not uploaded");
        }
        const post = await Post.create({
            user:userId,
            title,
            description,
            image: postImage?.url
        })
        const data:object = {
            post
        }
        res.status(200)
        .json(new ApiResponse("Post created successfully", data, 200));
    }
    catch(err){
        const customErr = err as CustomError;
        if(customErr.message){
            res.status(customErr.statusCode)
            .json(customErr.message);
        }
        else{
            res.status(500)
            .json("Some error occured!");
        }
    }
}