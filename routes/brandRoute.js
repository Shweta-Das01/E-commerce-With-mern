import exppress from 'express';
import { createBrandCtrl, getAllBrandsCtrl , getOneBrandCtrl, updateBrandCtrl, deleteBrandCtrl} from '../controllers/brandCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
const brandRouter= exppress.Router();


brandRouter.post("/",isLoggedIn,createBrandCtrl);
brandRouter.get("/",getAllBrandsCtrl);
brandRouter.get("/:id",getOneBrandCtrl);
brandRouter.put("/:id",isLoggedIn,updateBrandCtrl);
brandRouter.delete("/:id",isLoggedIn,deleteBrandCtrl);
export default brandRouter;
