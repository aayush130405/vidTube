//the asyncHandler function is used to handle any routes that the user requests and saves us from writing try-catch again and again for every route 

const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
}

export { asyncHandler } 
