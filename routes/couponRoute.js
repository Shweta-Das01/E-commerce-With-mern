import exppress from 'express';
import {createCouponCtrl, getAllCouponsCtrl, getSingleCouponCtrl, updateCouponCtrl, deleteCouponCtrl} from '../controllers/couponCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';
const couponRouter= exppress.Router();


couponRouter.post("/",isLoggedIn,isAdmin,createCouponCtrl);
couponRouter.get("/",isLoggedIn,getAllCouponsCtrl);
couponRouter.get("/:id",isLoggedIn,getSingleCouponCtrl);
couponRouter.put("/update/:id",isLoggedIn,isAdmin,updateCouponCtrl);
couponRouter.delete("/delete/:id",isLoggedIn,isAdmin,deleteCouponCtrl);
export default couponRouter;
