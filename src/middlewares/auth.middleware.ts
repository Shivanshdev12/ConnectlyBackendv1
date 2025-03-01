import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User.model";
import { CustomError, UserRequest } from "../interface/IUser";

export const verifyJwt = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies.accessToken;
        if (!token) {
            throw new ApiError(401, "Unauthorized request!");
        }

        let decodeToken: JwtPayload | null;
        try {
            decodeToken = jwt.verify(token, `${process.env.ACCESS_SECRET}`) as JwtPayload;
        } catch (error) {
            throw new ApiError(401, "Invalid token");
        }

        if (!decodeToken) {
            throw new ApiError(500, "Some error occurred");
        }

        const user = await User.findById(decodeToken.id);
        req.user = user;
        next();
    } catch (err) {
        const customErr = err as CustomError;
        console.error("Error Status:", customErr.statusCode);
        console.error("Error Message:", customErr.message);

        res.status(customErr.statusCode || 500).json(customErr.message || "Some error occurred!");
    }
};