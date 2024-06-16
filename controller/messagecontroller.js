import { Message } from "../models/messageschema.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
//catchsayncerror added
import ErrorHandler from  "../middleware/errorMiddleware.js";


export const sendMessage = catchAsyncError(async(req, res,next)=>{
const{ firstName ,lastName ,email, phone,message} = req.body;

if(!firstName || !lastName || !email || !phone || !message)
    {
        return next(new ErrorHandler("Please Fill All The Details!", 400));
    // return res.status(400).json(
    //     {
    //         success: false,
    //         message: "Please Fill All The Details!",
    //     } if using without middleware
    //this is contructed withoud using middleware 
    // responds with message if any of the field is not filled 
    //recieves all the information from the messageschema.js
    }
await Message.create ({ firstName,lastName,email,phone,message });
res.status(200).json({
    success:true,
    message: "Message Sent Successfully!",
});

});



// so that messages are seen only by the admin go to messrouter 
export const getAllMessages = catchAsyncError( async(req,res,next)=>
{
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages,
    });
});
