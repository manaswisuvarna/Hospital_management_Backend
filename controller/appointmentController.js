import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { Appointment } from "../models/appointmentschema.js";
import { User } from "../models/userschema.js";


export const postAppointment = catchAsyncError(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address,

    } = req.body;

 if (!firstName||
    !lastName||
    !email||
    !phone||
    !nic||
    !dob||
    !gender||
    !appointment_date||
    !department||
    !doctor_firstName||
    !doctor_lastName||
    
    !address
)
{
    return next(new ErrorHandler("please fill full form",400));
}

//to resolve the doctor conflict when they have same name 

const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department
})

if( isConflict.length === 0) // when the doctor with that name is not found 
    {
        return next(new ErrorHandler("Doctor not found!",404));
    }

    if( isConflict.length > 1)//when  more doctors with same name  
        {
            return next(new ErrorHandler("Doctors Conflict! Contact Through Email or Phone! ",404));
        }
    


const doctorId = isConflict[0]._id;
const patientId = req.user._id;


const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor :{
        firstName:doctor_firstName,
        lastName: doctor_lastName,
    },
    
   
    hasVisited,
    address,
    doctorId,
    patientId


}) ;
res.status(200).json({
    success: true,
    message: "Appointment sent Successfully!",
    appointment,
});

});

//get all the appointments to the admin only  fitureee worl can add for doctor 
export const getAllAppointments = catchAsyncError(async(req,res,next)=>
{
    const appointments = await Appointment.find();
    res.status(200).json({
        success: true,
        appointments,
    });
});



//update the appointment status 

export const updateAppointmentStatus = catchAsyncError(async(req,res,next)=>
{
    const {id} = req.params; // to accept or reject the appointment  if we put id during the login we can getbthe id 

    let appointment = await Appointment.findById(id);
    if(!appointment)
        {
            return next ( new ErrorHandler("Appointment Not found!",404));// if the appointment is there 
        }

    appointment = await Appointment.findByIdAndUpdate(id,req.body,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message:"Appointment Status Updated!",
        appointment,
    });

});



export const deleteAppointment = catchAsyncError(async(req,res,next)=>
{
    const {id} = req.params; // to accept or reject the appointment  if we put id during the login we can getbthe id 

    let appointment = await Appointment.findById(id);
    if(!appointment)
        {
            return next ( new ErrorHandler("Appointment Not found!",404));// if the appointment is there 
        }

     await appointment.deleteOne();
     res.status(200).json({
        success: true,
        message: "Appointment deleted!",
     });
});

