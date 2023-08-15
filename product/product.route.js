import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  editProduct,
} from "./product.service.js";

// router
const router = express.Router();

// add product
router.post("/product/add", addProduct);

// get all product
router.get("/products", getAllProducts);

// delete a product
router.delete("/product/delete/:id", deleteProduct);

// edit product
router.put("/product/edit/:id", editProduct);
export default router;
