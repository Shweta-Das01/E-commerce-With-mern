import express from 'express';
import dbConnect from '../config/dbConnect.js';
import Stripe from "stripe";
import userRoutes from '../routes/userRoute.js';
import { globalErrhandler ,notFound } from '../middlewares/globalErrorHandler.js';
import productRouter from '../routes/productRoute.js';
import categoryRouter from '../routes/categoryRoute.js';
import brandRouter from '../routes/brandRoute.js';
import colorRouter from '../routes/colorRoute.js';
import reviewRouter from '../routes/reviewRoute.js';
import orderRouter from '../routes/OrderRoute.js';
import Order from '../model/Order.js';
import couponRouter from '../routes/couponRoute.js';

//db connect
dbConnect();
const app = express();

//Stripe webhook

// This is your test secret API key.

const stripe = new Stripe(process.env.STRIPE_KEY);

const endpointSecret = 'whsec_a36c098eeb2248748642df1bf3cb91dc6e1e50954149729784cad7aa01df7241';
//const express = require('express');


app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  let event = request.body;

  if (endpointSecret) {
      const signature = request.headers['stripe-signature'];
      try {
          event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
         //console.log("✅ Webhook Received:", JSON.stringify(event, null, 2)); // <-- ADD THIS
      } catch (err) {
          console.log("❌ Webhook Signature Verification Failed:", err.message);
          return response.sendStatus(400);
      }
  }

  if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { orderId } = session.metadata;
      console.log("🟢 Extracted Order ID:", orderId);

      if (!orderId) {
          console.error("❌ orderId is missing in metadata!");
          return response.sendStatus(400);
      }

      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;

      console.log("🔄 Updating Order:", { orderId, paymentStatus, paymentMethod, totalAmount, currency });

      const order = await Order.findByIdAndUpdate(
          orderId,
          { totalPrice: totalAmount / 100, currency, paymentMethod, paymentStatus },
          { new: true }
      );

      if (!order) {
          console.error("❌ Order Not Found!");
          return response.sendStatus(404);
      }

      console.log("✅ Updated Order:", order);
  } else {
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  response.send();
});


app.listen(4242, () => console.log('Running on port 4242'));
//pass incoming data
app.use(express.json())
app.use("/api/v1/users/",userRoutes)
app.use("/api/v1/products/",productRouter)
app.use("/api/v1/categories/",categoryRouter)
app.use("/api/v1/brands/",brandRouter)
app.use("/api/v1/colors/",colorRouter)
app.use("/api/v1/reviews/",reviewRouter)
app.use("/api/v1/orders/",orderRouter)
app.use("/api/v1/coupons/",couponRouter)

//error middlewa
app.use(notFound);
app.use(globalErrhandler);
export default app;

