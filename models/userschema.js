import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
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
    nic:{
        type: String,
        required: true,
        minLength: [5, "NIC Must Contain Exact 10 Digits!"],
        maxLength: [5, "NIC Must Contain Exact 10 Digits!"]
    },
    dob:{
        type: Date,
        required: [true, "DOB is required!"],

    },
    gender:{
        type: String,
        required: true,
        enum:["Male" ,"Female"],
    },
    password:
    {// future work can aid password update functionality workkkkkkkkkkkkkkkkkkkkk
        type: String,
        minLength:[8, "Password Must Contain Atleast 8 Characters!"],
        required: true,
        select: false //password conatins 8 character we will get all the details except the password so select false
    },
    role:
    {
        type:String,
        required:true,
        enum: ["Admin", "Patient", "Doctor"],//different roles 
    },
    doctorDepartment:
    {
        type:String,//---------future workkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
    },
    
    docAvatar://doctor avtar 
    {
        public_id: String,
        url: String
    },


});

userSchema.pre("save", async function(next)
{
    if(!this.isModified("password"))
        {
            next();
        }
        this.password= await bcrypt.hash(this.password,10);
});//security measure so that the we get password in the hashed form 

userSchema.methods.comparePassword = async function(enteredPassword)
{
    return await bcrypt.compare(enteredPassword,this.password)
}
//to compare the password eneterd and the encrypted password 

//token generate  when the user logins this token has to be unique  mention the unique token and its expired date
userSchema.methods.generateToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};


export const User = mongoose.model("User",userSchema)
