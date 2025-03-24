import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"
import { verifyToken } from "../utils/verifyToken.js"

export const isLoggedIn =(req, res, next)=>{
   //get token from header
   const token=getTokenFromHeader(req)
   //verify the token 
   const decodedUser = verifyToken(token);
   //save the user into the req.object
   if(!decodedUser){
    throw new Error('Invalid/expired Token,please login again')
   }else{ 
     //save the user into the req.object
   req.userAuthId= decodedUser?.id;
   next()
   }
};