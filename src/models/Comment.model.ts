import mongoose, { Schema } from "mongoose";
import { IComment } from "../interface/IComment";

const commentSchema = new Schema<IComment>({
    user:{
        type:Schema.Types.ObjectId,
        required:true
    },
    comment:{
        type:String,
        required:true,
        default:""
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});

export const Comment = mongoose.model<IComment>("Comment", commentSchema);