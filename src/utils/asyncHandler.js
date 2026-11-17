const asyncHandler = (requesthandler) =>{
    (req,res,next) => {
        promise.resolve(requestHandler(req,res,next)).
        catch((error)=>next(error))
    }
}

export {asyncHandler}





// const asyncHandler = (requestHandler) => async(req,res,next) =>{
//     try{
//         await requestHandler(req,res,next)

//     } catch (error){
//         res.status(err.code || 500).json({
//             success: false,
//             message: error.message || "Internal Server Error"
//         })
//     }
// }