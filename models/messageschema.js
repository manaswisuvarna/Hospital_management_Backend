import mongoose from "mongoose";
import validator from "validator";


const messageSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: [3,"First Name Must contain Atleast 3 characters! "]
    },
    lastName:{
        type: String,
        required: true,
        minLength: [3,"Last Name Must contain Atleast 3 characters! "]
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return validator.isEmail(v);
            },
            message: "Please Provide A Valid Email!"
        }
    },
    
    phone:{
        type: String,
        required: true,
        minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
        maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"]
    },
    message:{
        type: String,
        required: true,
        minLength: [10, "Message Must Contain Atleast 3 Charatcters!"]
    },

});

export const Message = mongoose.model("Message",messageSchema)