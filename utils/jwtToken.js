
//token genration
export const generatetoken =(user,message,statuscode,res) =>
    {
  const token = user.generateToken();
  const cookieName =  user.role === "Admin" ? "adminToken": "patientToken";//beacuse admin dashboard and admin frontend
   res
   .status(statuscode)//satuscode
   .cookie(cookieName,token,{
    expires:new Date(
        //whe will cookie expire 7 days 24hrs 60 mins 1000 secs
        Date.now()+ process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000

    ),
    httpOnly: true,
    secure: true,
    sameSite: "None"
    
    
   }).json({//what it will return
    success: true,
    message,
    user,
    token,
   });


};