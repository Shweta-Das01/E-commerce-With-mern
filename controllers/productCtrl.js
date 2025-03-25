import asyncHandler from "express-async-handler";
import Product from "../model/product.js";
import Category from "../model/category.js";
import Brand from "../model/Brand.js";
import Color from "../model/Color.js";
import { populate } from "dotenv";
export const createProductCtrl = asyncHandler(async(req, res)=>{

 const convertedImages=req.files.map(file=> file.path);
 
const{name, description, category, sizes, colors, user, price, totalQty, brand} =req.body;
 //productexists
 const productexists =await Product.findOne({name});
 if(productexists){
    throw new Error("product already Exists");
 }
 //find the brand
 const brandFound =await Brand.findOne({
   name: brand?.toLowerCase(),
 });
 if(!brandFound){
   throw new Error(
      "Brand not found,please create brand first or check brand name"
   );
 }
 const colorFound =await Color.findOne({
   name: colors,
 });
 if(!colorFound){
   throw new Error(
      "color not found,please create color first or check brand name"
   );
 }
 //find the category
 const categoryFound =await Category.findOne({
   name: category,
 });
 if(!categoryFound){
   throw new Error(
      "Category not found,please create category first or check category name"
   );
 }
 const product =await Product.create({
    name, 
    description, 
    category, 
    sizes, 
    colors, 
    user: req.userAuthId, 
    price, 
    totalQty,
    brand,
    images: convertedImages,
 });
 //push the product into category
 categoryFound.products.push(product._id);
 //receive
 await categoryFound.save();
 brandFound.products.push(product._id);
 //receive
 await brandFound.save();
 colorFound.products.push(product._id);
 //receive
 await colorFound.save();
 res.json({
    status:"success",
    message: "Product created successfully",
    product,
 });
});

export const getProductCtrl=asyncHandler(async(req,res)=>{
   console.log(req.query);
   
   //query
   let productQuery = Product.find()
  
  //search by name
   if(req.query.name){
      productQuery =productQuery.find({
         name:{$regex: req.query.name, $options:"i"},
      })
   }
   //filter by brand
   if(req.query.brand){
      productQuery =productQuery.find({
         brand:{$regex: req.query.brand, $options:"i"},
      })
   }
     //filter by category
   if(req.query.category){
      productQuery =productQuery.find({
         category:{$regex: req.query.category, $options:"i"},
      })
   }
    //filter by colors
    if(req.query.colors){
      productQuery =productQuery.find({
         colors:{$regex: req.query.colors, $options:"i"},
      })
   }
   //filter by size
   if(req.query.sizes){
      productQuery =productQuery.find({
         sizes:{$regex: req.query.sizes, $options:"i"},
      })
   }
   //filter by price range
   if(req.query.price){
      const pricerange=req.query.price.split("-");
      //gte:greater than or equal 
      //lte:less than or equal to
      productQuery=productQuery.find({
         price:{$gte: pricerange[0], $lte: pricerange[1]},
      })
   }

   //pagenation
   //page
   const page =parseInt(req.query.page)?parseInt(req.query.page):1;
   //limit
   const limit =parseInt(req.query.limit)?parseInt(req.query.limit):1;
   //start index
   const startIndex=(page-1)*limit;
   //endidx
   const endIndex =page * limit;
   //total
   const total =await Product.countDocuments()
   productQuery =productQuery.skip(startIndex).limit(limit);

   //pagination results
   const pagination ={}
   if(endIndex<total){
      pagination.next={
         page:page+1,
         limit,
      };
   }
   if(startIndex>0){
      pagination.prev={
         page:page-1,
         limit,
      };
   }
   //await the query
   const products= await productQuery.populate("reviews");
    res.json({
        status: "success",
        total,
        results: products.length,
        pagination,
        message: "Products fetched successfully",
        products,
    });
})

export const getOneProductCtrl =asyncHandler(async(req,res)=>{
   const product= await Product.findById(req.params.id).populate("reviews");
   if(!product){
      throw new Error("Product not found");
   }
   res.json({
      status:"success",
      message:"Product fetched successfully",
      product,
   })
})

export const updateProductCtrl =asyncHandler(async(req,res)=>{
   const{name, description, category, sizes, colors, user, price, totalQty, brand} =req.body;
   //update
   const product=await Product.findByIdAndUpdate(req.params.id,{
     name, description, category, sizes, colors, user, price, totalQty, brand,
   },{
      new: true,
   }) ;
   res.json({
      status: "success",
      message: "Product updated successfully",
      product,
   });
})

export const deleteProductCtrl = asyncHandler(async (req, res) => {
   const product = await Product.findById(req.params.id);
   if (!product) {
      throw new Error("Product not found");
   }
   await product.deleteOne();
   res.json({
      status: "success",
      message: "Product deleted successfully",
   });
});
