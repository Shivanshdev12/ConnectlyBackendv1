import express from "express";
import connectDB from "./db";
import userRouter from "./routes/User.routes";
import postRouter from "./routes/Post.routes";
import commentRouter from "./routes/Comment.routes";
import notificationRouter from "./routes/Notification.routes";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const allowedOrigins: string[] = [
    'http://localhost:5173',
    'https://connectlyfrontendv1-1.onrender.com/'
];

const corsOption: CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
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
app.use("/api/v1/notifications", notificationRouter);

app.listen(`${process.env.PORT}`,()=>{
    try{
        console.log("App listening on port",`${process.env.PORT}`);
    }
    catch(err){
        console.log(err);
    }
})

export {app};