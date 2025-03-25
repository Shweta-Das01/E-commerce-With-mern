import exppress from 'express';
import { createOrderCtrl, getAllOrdersCtrl,getSingleOrderCtrl, updateOrderCtrl, getOrderStatsCtrl} from '../controllers/orderCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
const orderRouter= exppress.Router();


orderRouter.post("/",isLoggedIn,createOrderCtrl);
orderRouter.get("/",isLoggedIn,getAllOrdersCtrl);
orderRouter.get("/:id",isLoggedIn,getSingleOrderCtrl);
orderRouter.put("/update/:id",isLoggedIn,updateOrderCtrl);
orderRouter.get("/sales/stats",isLoggedIn,getOrderStatsCtrl);
export default orderRouter;
