import { Request } from "express";

export interface UserRegister{
    avatar: string;
    coverImage: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isPasswordCorrect:(password:string)=>{}
}

export interface UserRequest extends Request{
    user?: any,
}

export interface CustomError extends Error{
    statusCode: number;
    data: object;
    message: string;
}