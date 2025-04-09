import { NextFunction, Response } from "express";
import { CustomError, UserRequest } from "../interface/IUser";
import { Notification } from "../models/Notification.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export const getNotifications = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user._id;
        if(!user){
            throw new ApiError(401, "Unauthorized request");
        }
        const {userId} = req.body;
        const notification = await Notification.find({
            receiver: userId
        });
        if(!notification){
            throw new ApiError(404, "No Notification found for this user");
        }
        res
        .status(200)
        .json(new ApiResponse("Notifications fetched", notification, 200));
    }
    catch (err) {
        const CustomErr = err as CustomError;
        if (CustomErr?.statusCode) {
            res
            .status(CustomErr?.statusCode)
                .json(CustomErr?.message);
        }
        else {
            res.status(500)
                .json("Some error occured!");
        }

    }
}