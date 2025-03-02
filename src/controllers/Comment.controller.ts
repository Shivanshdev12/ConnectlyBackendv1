import { Response } from "express";
import { CustomError, UserRequest } from "../interface/IUser";
import ApiError from "../utils/ApiError";
import { Post } from "../models/Post.model";
import { Comment } from "../models/Comment.model";
import { User } from "../models/User.model";
import ApiResponse from "../utils/ApiResponse";

export const addComment=async(req:UserRequest,res:Response)=>{
    try{
        const user = req.user._id;
        if(!user){
            throw new ApiError(404, "Unauthorized request!");
        }
        const {id: postId, userId, comment} = req.body;
        const post = await Post.findById(postId);
        if(!post){
            throw new ApiError(404, "Post not found!");
        }
        const commentUser = await User.findById(userId);
        if(!commentUser){
            throw new ApiError(404, "User not found!");
        }
        const newComment = await Comment.create({
            user: commentUser,
            comment,
            likes:0,
            dislikes:0
        });
        post.comments.push(newComment._id);
        post.save();
        res.status(200).json(new ApiResponse("Comment added successfully",newComment,200));
    }
    catch(err){
        const customErr = err as CustomError;
        if(customErr.message){
            res.status(customErr?.statusCode || 500).json(customErr?.message);
        }
        else{
            res.status(500).json("Some error occured!");
        }
    }
}