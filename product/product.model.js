import mongoose from "mongoose";

// set rule/schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 55,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  brand: {
    type: String,
    minlength: 3,
    maxlength: 55,
    required: false,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  color: {
    type: [String],
    required: true,
  },
});

// create table/model
export const Product = mongoose.model("Product", productSchema);
