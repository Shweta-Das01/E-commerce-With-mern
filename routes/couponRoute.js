import exppress from 'express';
import {createCouponCtrl, getAllCouponsCtrl, getSingleCouponCtrl, updateCouponCtrl, deleteCouponCtrl} from '../controllers/couponCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const couponRouter= exppress.Router();


couponRouter.post("/",isLoggedIn,createCouponCtrl);
couponRouter.get("/",isLoggedIn,getAllCouponsCtrl);
couponRouter.get("/:id",isLoggedIn,getSingleCouponCtrl);
couponRouter.put("/update/:id",isLoggedIn,updateCouponCtrl);
couponRouter.delete("/delete/:id",isLoggedIn,deleteCouponCtrl);
export default couponRouter;
