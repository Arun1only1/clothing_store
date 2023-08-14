import express from "express";
import { Product } from "./product.model.js";
import { productValidationSchema } from "./product.validation.js";
import { checkMongoIdValidity } from "../utils/utils.js";

// router
const router = express.Router();

// add product
router.post("/product/add", async (req, res) => {
  const newProduct = req.body;

  //   validation
  try {
    await productValidationSchema.validateAsync(newProduct);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }

  await Product.create(newProduct);

  return res.status(200).send({ message: "Product is added successfully." });
});

// get all product
router.get("/products", async (req, res) => {
  const allProducts = await Product.find();

  return res.status(200).send(allProducts);
});

// delete a product
router.delete("/product/delete/:id", async (req, res) => {
  // extract id from params
  const productId = req.params.id;

  // check mongoose id validity
  const isValid = checkMongoIdValidity(productId);

  // if not valid, throw error
  if (!isValid) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // check if product with id exists
  const product = await Product.findOne({ _id: productId });

  // if not product, throw error
  if (!product) {
    return res.status(404).send({ message: "Product does not exist." });
  }

  // delete product
  await Product.deleteOne({ _id: productId });

  // send appropriate response
  return res.status(200).send({ message: "Product is deleted successfully." });
});
export default router;
