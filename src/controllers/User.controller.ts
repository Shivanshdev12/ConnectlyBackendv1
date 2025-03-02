import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomError, UserRequest } from "../interface/IUser";
import { User } from "../models/User.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";

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
            avatar: avatar?.secure_url || "",
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
        const {userId} = req.params;
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