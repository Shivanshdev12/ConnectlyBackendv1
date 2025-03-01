import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({});

const connectDB=async()=>{
    try{
        const connection = await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("DB Connected!");
    }
    catch(err){
        console.log("Some error occured!");
    }
}

export default connectDB;