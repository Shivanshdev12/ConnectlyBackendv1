import express from "express";
import connectDB from "./db";
import userRouter from "./routes/User.routes";
import postRouter from "./routes/Post.routes";
import commentRouter from "./routes/Comment.routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

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
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

connectDB();

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

app.listen(`${process.env.PORT}`,()=>{
    try{
        console.log("App listening on port",`${process.env.PORT}`);
    }
    catch(err){
        console.log(err);
    }
})

export {app};