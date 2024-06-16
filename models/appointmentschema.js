import mongoose  from "mongoose";
import validator from "validator";


const appointmentSchema = new mongoose.Schema({
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
    
    // doctorDepartment:
    // {
    //     type:String,//---------future workkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
    // },
    
    // docAvatar://doctor avtar 
    // {
    //     public_id: String,
    //     url: String
    // },
     appointment_date:{
        type: String,
        required:true,
     },
     department:{
        type: String,
        required:true,
     },
   //to define the unique doctor 
   doctor:
   {
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
   },

   hasVisited:{
    type: Boolean,
    default: false
   },


   doctorId:
   {
    type: mongoose.Schema.ObjectId,  // collects the doctor id
    required: true
   },


   patientId:
   {
         type: mongoose.Schema.ObjectId, // collects the patient id  auto generated 
         required: true
   },

   address:
   {
    type: String,
    required: true,
   },
     
   status:
   {
    type:String,
    enum: ["Pending","Accepted","Rejected"],
    default: "Pending",

   },





});



export const Appointment = mongoose.model("Appointment",appointmentSchema)
