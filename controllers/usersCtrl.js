import User from "../model/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";
export const registerUserCtrl = asyncHandler(async (req, res) => {
    try {
      const { fullname, email, password } = req.body;
  
      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({  // ✅ Added `return` to stop further execution
          status: "fail",
          message: "User already exists",
        });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create user
      const user = await User.create({
        fullname,
        email,
        password: hashedPassword,
      });
  
      return res.status(201).json({  // ✅ Return prevents duplicate responses
        status: "success",
        message: "User Registered Successfully",
        data: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
      });
  
    } catch (error) {
      console.error("Error in registerUserCtrl:", error);
  
      if (!res.headersSent) {  // ✅ Prevents multiple responses
        return res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  });

export const loginUserCtrl=asyncHandler(async(req,res)=>{
        const{email, password} =req.body;
        //find user in db by email only
        const userFound = await User.findOne({
          email,
        });
        if(userFound && await bcrypt.compare(password,userFound?.password)){
            res.json({
              status:'success',
              message:'User logged in successfully',
              userFound,
              token:generateToken(userFound?._id),
            });
        }else{
          throw new Error('Invalid login credentials');
          } 
});

export const getUserProfileCtrl =asyncHandler(async(req,res)=>{
  //get token from header
  const user=await User.findById(req.userAuthId).populate("orders");
 res.json({
  status:'succcess',
  message:"User Profile fetchedsuccessfully",
  user,
 })
  
});

export const updateShippingAddressCtrl = asyncHandler(async(req,res)=>{
  const {firstName,lastName,address,city,postalCode,province,phone}=req.body;
  const user=await User.findByIdAndUpdate(req.userAuthId,{
    shippingAddress:{
      firstName,lastName,address,city,postalCode,province,phone,
    },
    hasShippingAddress: true,
  },{
    new: true,
  });
  res.json({
    status:"success",
    meessage:"User shipping address updated successfully",
    user,
  });
})