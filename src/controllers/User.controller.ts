import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomError, UserRequest } from "../interface/IUser";
import { User } from "../models/User.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";
import mongoose from "mongoose";

export const generateAuthToken = async (userId:object)=>{
    const id = await User.findById(userId);
    if(!id){
        return;
    }
    return jwt.sign(
        {
            id:id._id
        },
        `${process.env.ACCESS_SECRET}`
    )
}

export const registerUser = async (req: UserRequest, res: Response, next: NextFunction)=>{
    try{
        const {firstName, lastName, email, password} = req.body;
        const avatarFiles = req.files as {[fieldname:string] : Express.Multer.File[]} | undefined ;
        const avatarLocalPath = avatarFiles?.avatar?.[0]?.path;
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const user = await User.create({
            avatar: avatar?.url || "",
            firstName,
            lastName,
            email,
            password,
        });
        if(!user){
            throw new ApiError(400, "User creation failed");
        }
        res.status(200)
        .json(new ApiResponse("User created", user , 200));
    }
    catch(err){
        const CustomErr = err as CustomError;
        if(CustomErr?.message){
            res.status(CustomErr?.statusCode)
            .json(CustomErr?.message);
        }
        else{
            res.status(500)
            .json("Some error occured!");
        }
    }
}

export const loginUser = async (req: UserRequest, res: Response, next: NextFunction)=>{
    try{
        const {email, password} = req?.body;
        const user = await User.findOne({email});
        if(!user){
            throw new ApiError(404, "Email doesn't exist");
        }
        const isValid = await user?.isPasswordCorrect(password);
        if(!isValid){
            throw new ApiError(404, "Password is wrong!");
        }
        const token = await generateAuthToken(user._id);
        console.log(token);
        const data = {
            user,
            accessToken: token,
        }
        res.status(200)
        .cookie("accessToken",token)
        .json(new ApiResponse("User loggedIn",data,200));
    }
    catch(err){
        const CustomErr = err as CustomError;
        if(CustomErr?.message){
            res.status(CustomErr?.statusCode)
            .json(CustomErr?.message)
        }else{
            res.status(500)
            .json("Some error occured!");
        }
    }
}

export const getUser = async (req: UserRequest, res: Response, next: NextFunction)=>{
    try{
        const {userId} = req.query;
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404, "User doesn't exist");
        }
        res.status(200)
        .json(new ApiResponse("User details found", user, 200))
    }
    catch(err){
        const CustomErr = err as CustomError;
        if(CustomErr?.message){
            res.status(CustomErr?.statusCode)
            .json(CustomErr?.message);
        }
        else{
            res.status(500)
            .json("Some error occured!");
        }
    }
}

export const logoutUser = async (req: UserRequest, res: Response, next: NextFunction)=>{
    try{
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset:{
                    accessToken:1,
                }
            },
            {
                new: true
            }
        )
        res
        .status(200)
        .clearCookie("accessToken")
        .json(new ApiResponse("User logged Out",{},200));
    }
    catch(err){
        const customErr = err as CustomError;
        if(customErr?.message){
            res.status(customErr?.statusCode).json(customErr?.message)
        }else{
            res.status(500).json("Some error occured!");
        }
    }
}

export const updateCoverImage = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json("Unauthorized request!");
        }

        const coverFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
        const coverLocalPath = coverFiles.coverImage[0]?.path;

        if (!coverLocalPath) {
            res.status(400).json({ message: "Invalid file uploaded!" });
        }

        const coverImage = await uploadOnCloudinary(coverLocalPath);

        if (!coverImage?.url) {
            res.status(500).json({ message: "Failed to upload cover image!" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { coverImage: coverImage?.url ?? "" },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ message: "User not found!" });
        }
        res
        .status(200)
        .json(new ApiResponse("Cover Image updated!", { user }, 200));

    } catch (err) {
        res
        .status(500)
        .json({ message: "Internal Server Error!" });
    }
};

export const searchUsers = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const {q} = req.query;
      let users;
      if(q === ""){
        users = await User.find().select("-password");
      }
      else{
          users = await User.find({
            $or: [
              { firstName: { $regex: q, $options: "i" } }, 
              { email: { $regex: q, $options: "i" } },
              { lastName: { $regex: q, $options: "i" } }
            ]
          }).select("-password");
      }
      res.status(200)
      .json(new ApiResponse("Users list fetched!",users,200));
    } catch (error) {
        const CustomErr = error as CustomError;
        if(CustomErr?.message){
            res.status(CustomErr?.statusCode)
            .json(CustomErr?.message);
        }
        else{
            res.status(500)
            .json("Some error occured!");
        }
    }
};

export const followUser = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
        let { followingId } = req.query;

        if (Array.isArray(followingId)) {
            followingId = followingId[0];
        }

        // Validate input
        if (!followingId || typeof followingId !== "string") {
            res.status(400).json(new ApiError(400, "Invalid user Id"));
        }

        const currentUser = await User.findById(req.user?._id) as any;
        const userToFollow = await User.findById(followingId) as any;

        // Check if both users exist
        if (!currentUser) {
            res.status(401).json(new ApiError(401, "Unauthorized access"));
        }

        if (!userToFollow) {
            res.status(404).json(new ApiError(404, "User doesn't exist"));
        }

        const currentUserId = new mongoose.Types.ObjectId(currentUser?._id) as any;
        const targetUserId = new mongoose.Types.ObjectId(userToFollow?._id) as any;

        // Add to following list if not already followed
        if (!currentUser?.following?.some((id: any) => id.equals(targetUserId))) {
            currentUser.following = currentUser?.following || [];
            currentUser?.following.push(targetUserId);
            await currentUser?.save();
        }

        // Add to followers list of the target user
        if (!userToFollow?.followers?.some((id: any) => id.equals(currentUserId))) {
            userToFollow.followers = userToFollow?.followers || [];
            userToFollow?.followers.push(currentUserId);
            await userToFollow?.save();
        }

        res.status(200).json(new ApiResponse("User followed successfully", currentUser, 200));
    } catch (err) {
        const CustomErr = err as CustomError;
        if(CustomErr?.statusCode){
            res.status(CustomErr?.statusCode)
            .json(CustomErr?.message);
        }
        else{
            res.status(500)
            .json("Some error occured!");
        }
    }
};
