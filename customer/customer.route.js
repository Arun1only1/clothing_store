import express from "express";
import Joi from "joi";
import { Customer } from "./customer.model.js";
import { checkMongoIdValidity } from "../utils/utils.js";
import mongoose from "mongoose";

const router = express.Router();

// add customer
router.post("/customer/add", async (req, res) => {
  const newCustomer = req.body;

  // validate req.body
  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required().min(1).max(55),
    firstName: Joi.string().trim().required().min(3).max(55),
    lastName: Joi.string().trim().required().min(3).max(55),
    dob: Joi.date().required(),
    gender: Joi.string()
      .required()
      .trim()
      .valid("male", "female", "preferNotToSay"),
  });

  try {
    await schema.validateAsync(newCustomer);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }

  //   check if user with this email already exist
  const customerExists = await Customer.findOne({ email: newCustomer.email });

  // if already exist, throw error
  if (customerExists) {
    return res
      .status(409)
      .send({ message: "User with this email already exists in our system." });
  }

  await Customer.create(newCustomer);

  return res.status(201).send({ message: "Customer added successfully." });
});

// get single customer
router.get("/customer/details/:id", async (req, res) => {
  // extract id from params
  const customerId = req.params.id;

  // validate mongo id
  const isValidMongoId = checkMongoIdValidity(customerId);

  // if not valid, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // find customer
  const customer = await Customer.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(customerId),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "purchasedItems",
        foreignField: "_id",
        as: "productData",
      },
    },
    {
      $project: {
        email: 1,
        fullName: { $concat: ["$firstName", " ", "$lastName"] },
        gender: 1,
        "productData.name": 1,
        "productData.price": 1,
      },
    },
  ]);

  // if not customer,throw error
  if (customer.length === 0) {
    return res.status(404).send({ message: "Customer does not exist." });
  }

  // send response
  return res.status(200).send(customer);
});

// delete customer
router.delete("/customer/delete/:id", async (req, res) => {
  // extract id from params
  const customerId = req.params.id;

  // validate mongo id
  const isValidMongoId = checkMongoIdValidity(customerId);

  // if not valid, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // find customer existence
  const customer = await Customer.findOne({ _id: customerId });

  // if not customer, throw error
  if (!customer) {
    return res.status(404).send({ message: "Customer does not exist." });
  }

  // delete customer
  // await Customer.deleteOne({_id:customerId})
  await Customer.findByIdAndDelete(customerId);
  // send response

  return res.status(200).send({ message: "Customer deleted successfully." });
});

// buy product
router.put("/customer/buy-product/:id", async (req, res) => {
  // extract id from params
  const customerId = req.params.id;

  // check mongo id validity
  const isValidMongoId = checkMongoIdValidity(customerId);

  // if not valid,throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // find customer
  const customer = await Customer.findOne({ _id: customerId });

  // if not customer,throw error
  if (!customer) {
    return res.status(404).send({ message: "Customer does not exist." });
  }

  const itemId = req.body.purchasedItemId;

  // TODO:validate this id and check if product is there or not

  // update customer table with purchased item list
  await Customer.updateOne(
    { _id: customerId },
    {
      $push: { purchasedItems: itemId },
    }
  );

  return res.status(200).send({ message: "You bought this item." });
});
export default router;
