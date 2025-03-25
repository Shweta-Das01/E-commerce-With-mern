import exppress from 'express';
import upload from '../config/fileUpload.js';
import { createProductCtrl, getProductCtrl, getOneProductCtrl, updateProductCtrl, deleteProductCtrl} from '../controllers/productCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';
const productRouter= exppress.Router();

productRouter.post("/",isLoggedIn,isAdmin, upload.array("files"), createProductCtrl);
productRouter.get("/",getProductCtrl);
productRouter.get("/:id",getOneProductCtrl);
productRouter.put("/:id",isLoggedIn,isAdmin,updateProductCtrl);
productRouter.delete("/:id/delete",isLoggedIn,isAdmin,deleteProductCtrl);
export default productRouter;
