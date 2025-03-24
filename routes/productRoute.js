import exppress from 'express';
import upload from '../config/fileUpload.js';
import { createProductCtrl, getProductCtrl, getOneProductCtrl, updateProductCtrl, deleteProductCtrl} from '../controllers/productCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const productRouter= exppress.Router();

productRouter.post("/",isLoggedIn,upload.single("file"),createProductCtrl);
productRouter.get("/",getProductCtrl);
productRouter.get("/:id",getOneProductCtrl);
productRouter.put("/:id",isLoggedIn,updateProductCtrl);
productRouter.delete("/:id/delete",isLoggedIn,deleteProductCtrl);
export default productRouter;
