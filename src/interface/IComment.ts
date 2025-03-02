import { Types } from "mongoose";

export interface IComment{
    user:Types.ObjectId,
    comment:string,
    likes:number,
    dislikes:number
}