import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/product.js";
import Coupon from "../model/Coupon.js";

dotenv.config(); // Load environment variables

// Ensure STRIPE_KEY is available
if (!process.env.STRIPE_KEY) {
    throw new Error("STRIPE_KEY is missing in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async (req, res) => {
   const {coupon}=req?.query;
   
    const couponFound = await Coupon.findOne({
        code: coupon?.toUpperCase(),
    });
    if(couponFound?.isExpired){
        throw new Error("Coupon has expired")
    }
    if(!couponFound){
        throw new Error("Coupon does not exists");
    }
    //get discount
    const discount =couponFound?.discount / 100; 
    const { orderItems, shippingAddress, totalPrice } = req.body;

    // ✅ Fetch user before using it
    const user = await User.findById(req.userAuthId);
    if (!user) {
        throw new Error("User not found");
    }

    if (!user?.hasShippingAddress) {
        throw new Error("Please provide a shipping address");
    }

    if (!orderItems || orderItems.length === 0) {
        throw new Error("No Order Items");
    }

    // ✅ Log received order items for debugging
    console.log("Received Order Items:", orderItems);

    // ✅ Create Order
    const order = await Order.create({
        user: user._id,
        orderItems,
        shippingAddress,
        totalPrice: couponFound ? totalPrice - totalPrice* discount : totalPrice,
    });
    console.log(order);
    

    // ✅ Associate order with user
    user.orders.push(order._id);
    await user.save();

    // ✅ Fetch Products to Validate Order Items
    const productIds = orderItems.map((item) => item._id);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== orderItems.length) {
        throw new Error("Some products in the order do not exist.");
    }

    // ✅ Bulk Update: Ensure correct quantity usage
    const bulkUpdates = orderItems.map((orderItem) => {
        const qty = Number(orderItem.totalQtyBuying) || 1; // Ensure qty is at least 1

        if (!qty || isNaN(qty) || qty <= 0) {
            throw new Error(`Invalid quantity for product ${orderItem._id}`);
        }

        return {
            updateOne: {
                filter: { _id: orderItem._id },
                update: { $inc: { totalSold: qty } },
            },
        };
    });

    await Product.bulkWrite(bulkUpdates);

    // ✅ Convert order items into Stripe's required format
    const convertedOrders = orderItems.map((item) => {
        const quantity = Number(item.totalQtyBuying) || 1; // Ensure valid quantity

        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item?.name || "Unknown Product",
                    description: item?.description || "No description available",
                },
                unit_amount: Math.round(item?.price * 100), // Convert price to cents
            },
            quantity: quantity, // ✅ Ensure quantity is provided
        };
    });

    try {
        // ✅ Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: convertedOrders,
            metadata:{
                orderId: order._id.toString(),
            },
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });

        res.json({ url: session.url });

    } catch (stripeError) {
        console.error("Stripe Error:", stripeError.message);
        throw new Error(`Stripe Error: ${stripeError.message}`);
    }
});

export const getAllOrdersCtrl=asyncHandler(async(req,res)=>{
    //find all orders
    const orders=await Order.find();
    res.json({
        success: true,
        message: "All Orders",
        orders,
    })
});

export const getSingleOrderCtrl=asyncHandler(async(req,res)=>{
    //get the id from params
    const id=req.params.id;
    const order=await Order.findById(id);
    res.status(200).json({
        success: true,
        message: "Single Order",
        order,
    })
});

export const updateOrderCtrl=asyncHandler(async(req,res)=>{
     const id=req.params.id;
     //update
     const updateOrder= await Order.findByIdAndUpdate(id,{
        status: req.body.status,
     },{
        new: true,
     });
     res.status(200).json({
        success: true,
        message: "Order updated",
        updateOrder,
    })
});

export const deleteOrderCtrl= asyncHandler(async(req,res)=>{
    
})