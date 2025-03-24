import asyncHandler from "express-async-handler";
import Color from "../model/Color.js";
export const createColorCtrl=asyncHandler(async(req,res)=>{
    const {name}=req.body;
    //category exist
    const colorFound =await Color.findOne({name})
    if(colorFound){
        throw new Error("color already exists")
    }
    const color = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });
    res.json({
        status: "success",
        message: "color created successfully",
        color
    });
});

export const getAllcolorsCtrl=asyncHandler(async(req,res)=>{
    const colors= await  Color.find();
    res.json({
        status:"success",
        message: "Colors fetched successfully",
        colors,
    });
})

export const getOneColorCtrl=asyncHandler(async(req,res)=>{
    const color= await  Color.findById(req.params.id);
    res.json({
        status:"success",
        message: "Color fetched successfully",
        color,
    });
})

export const updateColorCtrl=asyncHandler(async(req,res)=>{
    const {name} =req.body;
    const color= await  Color.findByIdAndUpdate(req.params.id,{
        name
    },{
        new: true,
    });
    res.json({
        status:"success",
        message: "Color updated successfully",
        color,
    });
})

export const deletecolorCtrl = asyncHandler(async (req, res) => {
  await Color.findByIdAndDelete(req.params.id);
   res.json({
      status: "success",
      message: "Color deleted successfully",
   });
});