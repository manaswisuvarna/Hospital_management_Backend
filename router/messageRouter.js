import express from "express";
import { getAllMessages, sendMessage } from "../controller/messagecontroller.js";
import { isAdminAuthenticated } from "../middleware/auth.js";

const router = express.Router();//create the instance for router

router.post("/send", sendMessage);//post it to the database //post it to postman
router .get("/getall",isAdminAuthenticated,getAllMessages);


export default router;