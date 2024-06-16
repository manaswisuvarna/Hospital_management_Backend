import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { User } from "../models/userschema.js";
import { generatetoken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";



export const patientRegister = catchAsyncError(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role,
    } = req.body;

    if (!firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic ||
        !role) {
        return next(new ErrorHandler("Please Fill All The Details!", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorHandler("User Already Registered ", 400));
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role,
    });
    generatetoken(user, "User Registered!", 200, res);
    // res.status(200).json({
    //     success: true,
    //     message: "User Registered!", if not using generetae tocken
    // });
});







//loginn//admin or user can login
export const login = catchAsyncError(async (req, res, next) => {
    const {
        email,
        password,
        confirmpassword,
        role
    } = req.body;

    if (!email ||
        !password ||
        !confirmpassword ||
        !role) {
        return next(new ErrorHandler("Please Fill All The Details!", 400));//if any one field is not filled
    }

    if (password !== confirmpassword) {
        return next(new ErrorHandler("Passwords Do Not Match!", 400));
    }//pasword matching

    //if the user exits in the db or not  usig the email beacuse email is unique
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Inavlis Password or Email!", 400));
    }
    //to match the password 
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched)//if password doest match and retrns false
    {
        return next(new ErrorHandler("Inavlis Password or Email!", 400));
    }
    //if the user the role enetered and the exiting role matches or not 
    if (role !== user.role) {
        return next(new ErrorHandler("User with  this role not found", 400));
    }
    generatetoken(user, "User Logged In Successfully!", 200, res);
    // res.status(200).json({
    //     success: true,
    //     message: "User Logged In Successfully!",
    // });
    // if all the constarints are cleared 
});








//new admin add 
export const addNewAdmin = catchAsyncError(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic
    } = req.body;
    if (!firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic) {
        return next(new ErrorHandler("Please Fill All The Details!", 400));
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role}  With This Email Has Already Registered `, 400));
    }

    const admin = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role: "Admin",
    });

    res.status(200).json({
        success: true,
        message: "New Admin Registered!"
    })

});





//get  user details 

export const getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

//admin logout 

export const logoutAdmin = catchAsyncError(async (req, res, next) => {
    res.status(200)
        .cookie("adminToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
            secure: true,
            sameSite:"None",
        }).json({
            success: true,
            message: "User Log Out Successfully!",
        });
});

//patient logout
export const logoutPatient = catchAsyncError(async (req, res, next) => {
    res.status(200)
        .cookie("patientToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
            sameSite:"None", 
            secure: true, //can login but cannot logout
        }).json({
            success: true,
            message: "User Log Out Successfully!",
        });
});





//add new doctor 

// export const addNewDoctor = catchAsyncError(async (req, res, next) => {
//     if (!req.files || Object.keys(req.files).length === 0) {
//         return next(new ErrorHandler("Doctor Avatar Required!", 400));
//         //doctor avatar is required otherwose throw error 
//     }

//     const { docAvatar } = req.files;
//     const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
//     if (!allowedFormats.includes(docAvatar.mimetype))//type of the image minitype
//     {
//         return next(new ErrorHandler("File format Not Supported!", 400));//if the docavatar is not of suitable file type 
//     }

//     const {
//         firstName,
//         lastName,
//         email,
//         phone,
//         password,
//         gender,
//         dob,
//         nic,
//         doctorDepartment
//     } = req.body;

//     if (!firstName ||
//         !lastName ||
//         !email ||
//         !phone ||
//         !password ||
//         !gender ||
//         !dob ||
//         !doctorDepartment ||
//         !nic) {
//         return next(new ErrorHandler("Please Provide All The Details!", 400));
//     }

//     //if already registered with same mail id  
//     const isRegistered = await User.findOne({ email });
//     if (isRegistered) {
//         return next(new ErrorHandler(`${isRegistered.role} already registered with this email!`, 400));
//     }


//     //posting the avatar to cludinary  if there is the error then print the error in the console 

//     const cloudinaryResponse = await cloudinary.uploader.upload(
//         docAvatar.tempFilePath
//     );

//     // console.log('Cloudinary API Key:', process.env.COULDINARY_API_KEY);

//     if (!cloudinaryResponse || cloudinaryResponse.error) {
//         console.error("cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary Error");
//     }

//     //if uploadeded successfully 
//     const doctor = await User.create({
//         firstName,
//         lastName,
//         email,
//         phone,
//         password,
//         gender,
//         dob,
//         nic,
//         doctorDepartment,
//         role: "Doctor",
//         docAvatar: {
//             public_id: cloudinaryResponse.public_id,
//             url: cloudinaryResponse.secure_url,
//         },

//     });

//     res.status(200).json({
//         success: true,
//         message: "New Doctor Registerd!",
//         doctor
//     });



// });



//doctors geting
export const getAllDoctor = catchAsyncError(async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });

    res.status(200).json({
        success: true,
        doctors,
    });
});




//addnew doctor

export const addNewDoctor = catchAsyncError(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Doctor Avatar Required!", 400));
        //doctor avatar is required otherwise throw error 
    }

    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        return next(new ErrorHandler("File format Not Supported!", 400));
    } //if the docavatar is not of suitable file type 

    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment
    } = req.body;

    if (!firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !doctorDepartment ||
        !nic) {
        return next(new ErrorHandler("Please Provide All The Details!", 400));
    }

    //if already registered with the same mail id  
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} already registered with this email!`, 400));
    }

    try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
            docAvatar.tempFilePath
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary Error");
            return next(new ErrorHandler("Cloudinary Upload Failed", 500));
        }

        // Include the Cloudinary URL in the doctor data
        const doctorData = {
            firstName,
            lastName,
            email,
            phone,
            password,
            gender,
            dob,
            nic,
            doctorDepartment,
            role: "Doctor",
            // Save the Cloudinary URL in the database
            docAvatar: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            },
        };

        // Save the doctor details to the database
        const doctor = await User.create(doctorData);

        // Include the Cloudinary URL in the response
        const response = {
            success: true,
            message: "New Doctor Registered!",
            doctor: {
                ...doctor.toObject(), // Convert Mongoose document to plain JavaScript object
                docAvatar: {
                    public_id: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url,
                },
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return next(new ErrorHandler("Cloudinary Upload Failed", 500));
    }
});
