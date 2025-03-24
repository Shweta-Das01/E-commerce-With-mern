import asyncHandler from "express-async-handler";
import Review from "../model/Review.js";
import Product from "../model/product.js";
export const createReviewCtrl = asyncHandler(async(req,res)=>{
    //1. find the product
    const {product, message, rating} =req.body;
    const{productID}=req.params
    const productFound= await Product.findById(productID).populate("reviews");
    if(!productFound){
        throw new Error("Product not found");
    }
    const hashReviewed=productFound?.reviews?.find((review)=>{
        console.log(review);
        
  return review?.user?.toString() === req.userAuthId?.toString();
    });
 
    if(hashReviewed){
        throw new Error("You have already reviwed this product");
    }
    
    //check if user already reviewd the product
    //create review
     const review =await Review.create({
        message,
        rating, 
        product: productFound?._id,
        user: req.userAuthId,
     });
     //push review into product found
     productFound.reviews.push(review?._id);
     await productFound.save();
     res.status(201).json({
        success: true,
        message: "Review created successfully",
     });
    });