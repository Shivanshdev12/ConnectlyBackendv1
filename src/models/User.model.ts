import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import { UserRegister } from "../interface/IUser";

const userSchema = new Schema<UserRegister>({
    avatar:{
        type:String,
        required:false,
        default:""
    },
    coverImage:{
        type:String,
        required:false,
        default:""
    },
    firstName:{
        type:String,
        required: true        
    },
    lastName:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

userSchema.pre("save", async function (next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    return next();
})

userSchema.methods.isPasswordCorrect = async function (password:string) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model<UserRegister>("User", userSchema);