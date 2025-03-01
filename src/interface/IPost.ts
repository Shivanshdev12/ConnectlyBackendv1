import { Document, Types } from "mongoose";

export interface ICreatePost extends Document {
    user: Types.ObjectId;
    title: string;
    description: string;
    image?: string;
    likes: Types.ObjectId[];
    dislikes: number;
}
