export const catchAsyncError = (theFunction)=>{
    return(req,res,next)=>
        {
            Promise.resolve(theFunction(req,res,next)).catch(next)
        };
};
//middleware to handle async error create promise to resolve the error otherwise catch the next
// to use this put it in the messagecontroller.js