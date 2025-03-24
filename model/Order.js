import mongoose from "mongoose";
const Schema=mongoose.Schema;
//generate random numbers for order
const randomTxt=Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumbers = Math.floor(1000 + Math.random() * 90000)
const OrderSchema =new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    orderItems:[
        {
           type: Object,
           required: true,
        },
    ],
    shippingAddress: {
        type: Object,
        required: true,
    },
    orderNumber:{
        type: String,
        required: true,
        default: randomTxt + randomNumbers,
    },
    //for stripe payment
    paymentsStatus: {
        type:String,
        required: true,
        default: "Not paid",
    },
    paymentMethod:{
        type: String,
        required: true,
        default: "Not specified",
    },
   totalPrice:{
        type: Number,
        default: 0.0,
    },
    currency:{
        type:String,
        default:"Not specified",
    },
    //For admin
    status:{
       type:  String,
       default: "pending",
       enum:['pending','processing','shipped','delivered'],
    },
    deliveredAt:{
        type: Date,
    },
},{
    timestamps: true,
});

//compiled to form model
const Order= mongoose.model('Order',OrderSchema);
export default Order;