import express from "express";
import { patientRegister, login, addNewAdmin, getAllDoctor, getUserDetails, logoutAdmin, logoutPatient, addNewDoctor } from "../controller/usercontroller.js";


import { isAdminAuthenticated, isPatientAuthenticated } from "../middleware/auth.js"; // Uncommented import

const router = express.Router();

router.post("/patient/register", patientRegister); // for patient register
router.post("/login", login); // for login
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin); // Added isAdminAuthenticated middleware
router.get("/doctors", getAllDoctor);//get the doctors 
router .get("/admin/me" , isAdminAuthenticated,getUserDetails);
router .get("/patient/me" , isPatientAuthenticated,getUserDetails);
router .get("/admin/logout" , isAdminAuthenticated,logoutAdmin);
router .get("/patient/logout" , isPatientAuthenticated,logoutPatient);

router .post("/doctor/addnew" , isAdminAuthenticated,addNewDoctor);

export default router;
