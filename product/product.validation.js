import Joi from "joi";

export const productValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(55).trim(),
  price: Joi.number().required().min(0),
  brand: Joi.string().min(3).max(55).trim(),
  quantity: Joi.number().min(1).required(),
  color: Joi.array().items(Joi.string()),
});
