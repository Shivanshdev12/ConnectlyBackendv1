import express from "express";
import connectDB from "./db";
import userRouter from "./routes/User.routes";
import postRouter from "./routes/Post.routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const corsOption = {
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials:true
};

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({limit:"16kb"}));

app.use(cors(corsOption));
app.use(cookieParser());

connectDB();

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.listen(`${process.env.PORT}`,()=>{
    try{
        console.log("App listening on port",`${process.env.PORT}`);
    }
    catch(err){
        console.log(err);
    }
})

export {app};