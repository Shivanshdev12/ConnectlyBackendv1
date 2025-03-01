import mongoose, { Schema } from "mongoose";
import { ICreatePost } from "../interface/IPost";

const postSchema = new Schema<ICreatePost>({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true,
    },
    image:{
        type:String,
        required:false,
        default:""
    },
    likes:[{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    dislikes:{
        type: Number,
        default: 0
    }
},{
    timestamps: true
});

export const Post = mongoose.model<ICreatePost>("Post", postSchema);