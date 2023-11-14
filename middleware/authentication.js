import  jwt  from 'jsonwebtoken';
import { UnauthenticatedError,ForbiddenError } from '../errors/index.js';


const auth = async (req,res,next) => {


  
  
  // jwt verification
  if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')){
    throw new ForbiddenError('Access Denied');
  }
  
  const token = req.headers.authorization.split(' ')[1];
  
  try{
    const decodedJWT = jwt.verify(token,process.env.JWT_SECRET)

    // make it a middleware in the future and use it in the post route
    if(req.params.id){
      if(req.params.id !== decodedJWT){
        throw new UnauthenticatedError("unauthenticated")
      }
    }

    
    req.user = {userId: decodedJWT.userId};
    next();
  }catch(err){
    throw new ForbiddenError('Access denied')
  }
}

export default auth;