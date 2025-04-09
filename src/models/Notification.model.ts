import mongoose,{Schema} from "mongoose";

const notificationSchema = new Schema({
    sender:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    receiver:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type: String,
        enum: ["follow", "like", "comment"],
        required: true
    },
    message:{
        type: String,
        required: true
    },
    read:{
        type: Boolean,
        default: false,
    }
},{
    timestamps: true
})

export const Notification = mongoose.model("Notification", notificationSchema);