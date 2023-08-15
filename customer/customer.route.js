import express from "express";
import Joi from "joi";
import { Customer } from "./customer.model.js";

const router = express.Router();

router.post("/customer/add", async (req, res) => {
  const newCustomer = req.body;

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

export default router;
