import exppress from 'express';
import { createColorCtrl, getAllcolorsCtrl, getOneColorCtrl, updateColorCtrl, deletecolorCtrl} from '../controllers/colorCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';
const colorRouter= exppress.Router();


colorRouter.post("/",isLoggedIn,isAdmin,createColorCtrl);
colorRouter.get("/",getAllcolorsCtrl);
colorRouter.get("/:id",getOneColorCtrl);
colorRouter.put("/:id",isLoggedIn,isAdmin,updateColorCtrl);
colorRouter.delete("/:id",isLoggedIn,isAdmin,deletecolorCtrl);
export default colorRouter;
