import exppress from 'express';
import { createColorCtrl, getAllcolorsCtrl, getOneColorCtrl, updateColorCtrl, deletecolorCtrl} from '../controllers/colorCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
const colorRouter= exppress.Router();


colorRouter.post("/",isLoggedIn,createColorCtrl);
colorRouter.get("/",getAllcolorsCtrl);
colorRouter.get("/:id",getOneColorCtrl);
colorRouter.put("/:id",isLoggedIn,updateColorCtrl);
colorRouter.delete("/:id",isLoggedIn,deletecolorCtrl);
export default colorRouter;
