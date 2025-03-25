import exppress from 'express';
import { createBrandCtrl, getAllBrandsCtrl , getOneBrandCtrl, updateBrandCtrl, deleteBrandCtrl} from '../controllers/brandCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';
const brandRouter= exppress.Router();


brandRouter.post("/",isLoggedIn,isAdmin,createBrandCtrl);
brandRouter.get("/",getAllBrandsCtrl);
brandRouter.get("/:id",getOneBrandCtrl);
brandRouter.put("/:id",isLoggedIn,isAdmin,updateBrandCtrl);
brandRouter.delete("/:id",isLoggedIn,isAdmin,deleteBrandCtrl);
export default brandRouter;
