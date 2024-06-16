import express from "express";//node framework
import {config} from "dotenv";//secrets
import cors from 'cors'; //connect frontend+backend
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbconnection } from "./database/dbconnection.js";
import messageRouter from "./router/messageRouter.js";
import {errorMiddleware} from "./middleware/errorMiddleware.js"
import userRouter from "./router/userRouter.js"
import appointmentRouter  from "./router/appointmentRouter.js";

const app = express()
config({path: "./config/config.env"}); //path to the config .env file

app.use(cors({
    origin: [process.env.FRONTEND_URL,process.env.DASHBOARD_URL],
    methods: ["GET","POST","PUT","DELETE"],//methods
    credentials: true,
}));

app.use(cookieParser()); //cookies get 
app.use(express.json());//data parse  json to string
app.use(express.urlencoded({extended:true}));// data type checking ed date n string name

app.use(fileUpload({
    useTempFiles: true,  //as per the documentation to handle the files
    tempFileDir: "/tmp/"
}));

app.use("/api/v1/message",messageRouter);//will be posted in the postman
app.use("/api/v1/user",userRouter);//router pathe for the user check 
app.use("/api/v1/appointment",appointmentRouter);

dbconnection() ;  // database connection calling 

app.use(errorMiddleware);//error handler should alwys be at the end

export default app