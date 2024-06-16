import mongoose  from "mongoose";// database connection with node

export const dbconnection = () =>
    {
        mongoose.connect(process.env.MONGO_URI,{
            dbName: "HOSPITAL_MANAGE",  //name of the project 

        })
        .then(()=>
        {
            console.log("connected to database")  //if connected to db 
        })
        .catch((err)=>
        {
            console.log(`error has occured in connection db ${err} `)  // if error 
        })
    }