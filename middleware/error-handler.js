// const { CustomAPIError } = require('../errors')
import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    // default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  }

  
  console.log(err)
  /*   if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  } */
  
  if(err.code){
    if(err.code === 11000){
      customError.statusCode = StatusCodes.BAD_REQUEST;
      customError.msg = `${Object.keys(err.keyValue)} field is allready used, Please choose another one`;
    }
  }
  // validation error
  if(err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if(err.name === 'CastError'){
    customError.msg = `No item found with id ${err.values}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

export default errorHandlerMiddleware
