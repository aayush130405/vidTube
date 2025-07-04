//here we want to build a healthcheck that is going to check routes after some time repeatedly...

import {apiResponse} from '../utils/apiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'

const healthCheck = asyncHandler(async (req,res) => {
    return res
        .status(200)
        .json(new apiResponse(200, "OK", "Healthcheck passed!!!"))
})

export { healthCheck }

