class ErrorHandler extends Error{
    constructor(message,statuscode)
    {
        super(message);
        this.statuscode=statuscode;

    }
}

export const errorMiddleware = (err,req,res,next)=>
    {
        err.message=err.message||"Inetrnal Server Error"; // if error message exit otherwise
        err.statuscode=err.statuscode||500; // if statuscode error exitnotherwise 


        if(err.code === 11000)//1error that database should not consists of same values
            {
                const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;//when we hve nore tha 2 name with same email then throw error
                err = new ErrorHandler(message,400);//error message with the status code

            }
        if(err.name === "JasonWebTokenError"){ //
            const message = "Json Web Token is invalid ,Try Again!";
            err= new ErrorHandler(message,400);
        }

        if(err.name === "TokenExpiredError"){
            const message = "Json Web Token is expired ,Try Again!";
            err= new ErrorHandler(message,400);
        }

        if(err.name === "CastError"){//when data is entered wronly type doesntmatch 
            const message = `Invalid ${err.path}`;
            err= new ErrorHandler(message,400);
        }

        const errorMessage = err.errors
         ? Object.values(err.errors)
                 .map((error) => error.message)
         .join(" ") : err.message;


        return res.status(err.statuscode).json({
            success: false,
            message: errorMessage,
        });

    };

    export default ErrorHandler;