import exppress from 'express';
import { createCategoryCtrl, getAllCategoriesCtrl, getOneCategoryCtrl, updateCategoryCtrl, deleteCategoryCtrl } from '../controllers/categoryCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import categoryFileUpload from '../config/categoryUpload.js';
const categoryRouter= exppress.Router();



categoryRouter.post("/",isLoggedIn,categoryFileUpload.single("file"),createCategoryCtrl);
categoryRouter.get("/",getAllCategoriesCtrl);
categoryRouter.get("/:id",getOneCategoryCtrl);
categoryRouter.put("/:id",isLoggedIn,updateCategoryCtrl);
categoryRouter.delete("/:id",isLoggedIn,deleteCategoryCtrl);
export default categoryRouter;
